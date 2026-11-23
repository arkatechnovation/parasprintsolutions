import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import net from 'node:net';
import mongoose from 'mongoose';
import request from 'supertest';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { seed } from '../src/seed.js';
import { createApp } from '../src/app.js';
import serviceApp from '../src/index.js';
import { Enquiry, Quotation, CalculatorSubmission, Media, Product } from '../src/models/index.js';
import { notifySubmission } from '../src/services/email.js';
import { calculate } from '../src/services/calculator.js';
import { configuration } from '../src/validators/index.js';
import { validate } from '../src/utils/errors.js';
let app;
const customer = {
  name: 'Integration Test',
  email: 'test@example.invalid',
  phone: '+91 90000 00000',
  company: 'Test company',
  city: 'Ghaziabad',
};
const config = {
  product: 'corrugated-boxes',
  style: 'rsc',
  length: 400,
  width: 300,
  height: 250,
  unit: 'mm',
  material: 'kraft',
  printing: 'plain',
  finishing: [],
  quantity: 100,
};
const key = () => crypto.randomUUID();
const quote = {
  customer,
  source: 'integration-test',
  website: '',
  productSlug: 'corrugated-boxes',
  requirements: 'A test specification for database validation.',
  quantity: 100,
  dimensions: '400 x 300 x 250 mm',
  material: 'kraft',
  printing: 'plain',
  finishing: '',
  attachmentIds: [],
  uploadToken: '',
};
before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.INTERNAL_API_KEY = crypto.randomBytes(32).toString('hex');
  process.env.UPLOAD_SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.ALLOW_LOCAL_UPLOADS = 'true';
  delete process.env.SMTP_HOST;
  for (const variable of [
    'SMTP_USER',
    'SMTP_PASS',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ])
    delete process.env[variable];
  await connectDatabase({ test: true });
  await mongoose.connection.dropDatabase();
  await seed();
  app = createApp();
});
after(async () => {
  if (mongoose.connection.readyState === 1) await mongoose.connection.dropDatabase();
  await disconnectDatabase();
});

test('exported Vercel entrypoint serves the original API prefix with a reused connection', async () => {
  const [health, products] = await Promise.all([
    request(serviceApp).get('/api/v1/health'),
    request(serviceApp).get('/api/v1/products'),
  ]);
  assert.equal(health.status, 200);
  assert.equal(products.status, 200);
  assert.equal(products.body.data.length, 9);
  assert.equal((await request(serviceApp).get('/products')).status, 404);
});

test('database initialization failure returns 503 without exposing credentials', async () => {
  const unavailable = createApp({
    initialize: async () => {
      throw new Error('mongodb://private-credentials@example.invalid');
    },
  });
  const response = await request(unavailable).get('/api/v1/products');
  assert.equal(response.status, 503);
  assert.equal(response.body.ok, false);
  assert(!JSON.stringify(response.body).includes('private-credentials'));
  assert.match(response.body.error.message, /database is temporarily unavailable/);
});
test('public catalogue, pagination, filtering and unpublished content', async () => {
  const all = await request(app).get('/api/v1/products');
  assert.equal(all.status, 200);
  assert.equal(all.body.data.length, 9);
  assert.equal(
    (await request(app).get('/api/v1/products?category=commercial-print&limit=2')).body.data.length,
    2,
  );
  assert.equal(
    (await request(app).get('/api/v1/products?search=corrugated')).body.data[0].slug,
    'corrugated-boxes',
  );
  assert.equal((await request(app).get('/api/v1/gallery?limit=100')).body.meta.total, 62);
  assert.equal((await request(app).get('/api/v1/industries')).body.data.length, 8);
  assert.equal((await request(app).get('/api/v1/testimonials')).body.data.length, 0);
  assert.equal((await request(app).get('/api/v1/case-studies')).body.data.length, 0);
  await Product.create({ slug: 'draft-test', name: 'Draft product', status: 'draft' });
  assert.equal((await request(app).get('/api/v1/products/draft-test')).status, 404);
  assert.equal((await request(app).get('/api/v1/products?limit=100')).body.meta.total, 9);
});
test('public settings exclude internal rate cards and invalid dimensions are rejected', async () => {
  const settings = await request(app).get('/api/v1/calculator/settings');
  assert.equal(settings.status, 200);
  assert.equal(settings.body.data.rates, undefined);
  assert.throws(() => validate(configuration, { ...config, length: -1 }));
  await assert.rejects(
    calculate({ ...config, material: 'unlisted' }),
    (error) => error.status === 422,
  );
  await assert.rejects(
    calculate({ ...config, length: 1000, unit: 'in' }),
    (error) => error.status === 422,
  );
  const result = await request(app).post('/api/v1/calculator/estimate').send(config);
  assert.equal(result.status, 200);
  assert.equal(result.body.data.mode, 'quotation');
  assert.equal(result.body.data.unitCost, undefined);
});
test('enquiries and calculator requests persist even when email is not configured', async () => {
  const invalid = await request(app)
    .post('/api/v1/enquiries')
    .send({ customer, subject: 'Test', message: 'Test message', website: 'spam.example' });
  assert.equal(invalid.status, 422);
  const result = await request(app).post('/api/v1/enquiries').set('Idempotency-Key', key()).send({
    customer,
    subject: 'Packaging enquiry',
    message: 'This is a complete test enquiry.',
    source: 'test',
    website: '',
  });
  assert.equal(result.status, 201);
  const saved = await Enquiry.findById(result.body.data.reference);
  assert.equal(saved.customer.email, customer.email);
  assert.equal(saved.notificationStatus, 'not-configured');
  const calc = await request(app)
    .post('/api/v1/calculator/submit')
    .set('Idempotency-Key', key())
    .send({
      customer,
      configuration: config,
      requirements: 'Integration test',
      source: 'test',
      website: '',
    });
  assert.equal(calc.status, 201);
  assert.equal(
    (await CalculatorSubmission.findById(calc.body.data.reference)).configuration.quantity,
    100,
  );
});
test('quotations are idempotent and private records require a strong internal credential', async () => {
  const id = key();
  const first = await request(app)
    .post('/api/v1/quotations')
    .set('Idempotency-Key', id)
    .send(quote);
  assert.equal(first.status, 201);
  const duplicate = await request(app)
    .post('/api/v1/quotations')
    .set('Idempotency-Key', id)
    .send(quote);
  assert.equal(duplicate.status, 200);
  assert.equal(first.body.data.reference, duplicate.body.data.reference);
  assert.equal(await Quotation.countDocuments(), 1);
  assert.equal((await request(app).get('/api/v1/enquiries')).status, 401);
  assert.equal((await request(app).get('/api/v1/quotations')).status, 401);
  const result = await request(app)
    .get('/api/v1/quotations')
    .set('Authorization', 'Bearer ' + process.env.INTERNAL_API_KEY);
  assert.equal(result.status, 200);
  assert.equal(result.body.data.length, 1);
  assert.equal(result.body.data[0].requestKey, undefined);
});
test('secure uploads verify session, real file type, size and attachment ownership', async () => {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jGZkAAAAASUVORK5CYII=',
    'base64',
  );
  assert.equal(
    (
      await request(app)
        .post('/api/v1/uploads')
        .attach('file', png, { filename: 'test.png', contentType: 'image/png' })
    ).status,
    401,
  );
  const session = (await request(app).post('/api/v1/uploads/session').send({ website: '' })).body
    .data.token;
  assert.equal(
    (
      await request(app)
        .post('/api/v1/uploads')
        .set('X-Upload-Token', session)
        .attach('file', Buffer.from('not a png'), {
          filename: 'fake.png',
          contentType: 'image/png',
        })
    ).status,
    422,
  );
  const result = await request(app)
    .post('/api/v1/uploads')
    .set('X-Upload-Token', session)
    .attach('file', png, { filename: 'artwork.png', contentType: 'image/png' });
  assert.equal(result.status, 201);
  assert.equal(result.body.data.storageKey, undefined);
  const id = result.body.data.id;
  const other = (await request(app).post('/api/v1/uploads/session').send({ website: '' })).body.data
    .token;
  const denied = await request(app)
    .post('/api/v1/quotations')
    .set('Idempotency-Key', key())
    .send({ ...quote, attachmentIds: [id], uploadToken: other });
  assert.equal(denied.status, 422);
  const accepted = await request(app)
    .post('/api/v1/quotations')
    .set('Idempotency-Key', key())
    .send({ ...quote, attachmentIds: [id], uploadToken: session });
  assert.equal(accepted.status, 201);
  assert.equal(String((await Media.findById(id)).claimedBy), accepted.body.data.reference);
  assert.equal((await request(app).get('/api/v1/uploads/' + id)).status, 401);
  const downloaded = await request(app)
    .get('/api/v1/uploads/' + id)
    .set('Authorization', 'Bearer ' + process.env.INTERNAL_API_KEY);
  assert.equal(downloaded.status, 200);
  assert.equal(downloaded.headers['content-type'], 'image/png');
  const tooLarge = await request(app)
    .post('/api/v1/uploads')
    .set('X-Upload-Token', session)
    .attach('file', Buffer.alloc(10 * 1024 * 1024 + 1), {
      filename: 'large.png',
      contentType: 'image/png',
    });
  assert.equal(tooLarge.status, 413);
});
test('SMTP integration delivers both notifications to a local capture server', async () => {
  const messages = [];
  const smtp = net.createServer((socket) => {
    socket.setEncoding('utf8');
    socket.write('220 localhost ESMTP test\r\n');
    let input = '',
      data = false,
      message = '';
    socket.on('data', (chunk) => {
      input += chunk;
      while (input.includes('\r\n')) {
        const end = input.indexOf('\r\n'),
          line = input.slice(0, end);
        input = input.slice(end + 2);
        if (data) {
          if (line === '.') {
            messages.push(message);
            message = '';
            data = false;
            socket.write('250 Message accepted\r\n');
          } else message += line + '\r\n';
        } else if (/^EHLO|^HELO/.test(line)) socket.write('250 localhost\r\n');
        else if (/^MAIL FROM|^RCPT TO|^RSET/.test(line)) socket.write('250 OK\r\n');
        else if (/^DATA/.test(line)) {
          data = true;
          socket.write('354 End with dot\r\n');
        } else if (/^QUIT/.test(line)) {
          socket.end('221 Bye\r\n');
        } else socket.write('250 OK\r\n');
      }
    });
  });
  await new Promise((resolve) => smtp.listen(0, '127.0.0.1', resolve));
  process.env.SMTP_HOST = '127.0.0.1';
  process.env.SMTP_PORT = String(smtp.address().port);
  process.env.SMTP_FROM = 'website@example.invalid';
  process.env.NOTIFICATION_EMAIL = 'team@example.invalid';
  process.env.SMTP_SECURE = 'false';
  const saved = await Enquiry.create({
    customer,
    subject: 'Mail test',
    message: 'A local email integration test.',
  });
  await notifySubmission(Enquiry, saved, 'enquiry');
  assert.equal(messages.length, 2);
  assert(messages.some((m) => m.includes('team@example.invalid')));
  assert(messages.some((m) => m.includes('test@example.invalid')));
  assert.equal((await Enquiry.findById(saved._id)).notificationStatus, 'sent');
  await new Promise((resolve) => smtp.close(resolve));
  await notifySubmission(Enquiry, saved, 'enquiry');
  assert.equal((await Enquiry.findById(saved._id)).notificationStatus, 'failed');
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_FROM;
  delete process.env.NOTIFICATION_EMAIL;
});
test('CORS, injection rejection, safe error responses and submission rate limiting', async () => {
  assert.equal(
    (await request(app).get('/api/v1/products').set('Origin', 'https://untrusted.invalid')).status,
    403,
  );
  assert.equal((await request(app).get('/api/v1/products?search[$ne]=anything')).status, 400);
  const result = await request(app)
    .post('/api/v1/enquiries')
    .send({
      customer: { ...customer, name: { $ne: null } },
      subject: 'X',
      message: 'A test message.',
    });
  assert.equal(result.status, 400);
  assert.equal(
    (await request(app).get('/api/v1/health')).headers['x-content-type-options'],
    'nosniff',
  );
  let response;
  for (let i = 0; i < 10; i++) response = await request(app).post('/api/v1/enquiries').send({});
  assert.equal(response.status, 429);
});
