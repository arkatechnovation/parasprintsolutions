// Read-only database export. No seed, inserts, updates, or private collections.
import fs from 'node:fs/promises';
import { connectDatabase, disconnectDatabase } from '../../backend/src/config/database.js';
import { models } from '../../backend/src/models/index.js';

const target = new URL('../src/data/catalog.json', import.meta.url);
const mapping = {
  categories: 'Category',
  products: 'Product',
  industries: 'Industry',
  pages: 'Page',
  blogs: 'Blog',
  caseStudies: 'CaseStudy',
  clients: 'Client',
  testimonials: 'Testimonial',
  gallery: 'Gallery',
  machines: 'Machine',
  certifications: 'Certification',
};
try {
  await connectDatabase({ local: process.argv.includes('--local') });
  const snapshot = {};
  for (const [key, name] of Object.entries(mapping)) {
    snapshot[key] = await models[name]
      .find({
        status: 'published',
        ...(name === 'Testimonial' ? { permissionConfirmed: true } : {}),
        ...(name === 'Certification' ? { verified: true } : {}),
      })
      .sort(['Blog', 'CaseStudy'].includes(name) ? { publishedAt: -1 } : { order: 1, createdAt: 1 })
      .lean();
  }
  snapshot.settings = Object.fromEntries(
    (await models.SiteSetting.find({ public: true }).lean()).map(({ key, value }) => [key, value]),
  );
  snapshot.calculator = await models.CalculatorSetting.findOne({ key: 'default' }).lean();
  if (snapshot.calculator) delete snapshot.calculator.rates;
  if (
    !snapshot.settings.company ||
    !snapshot.settings.home ||
    !snapshot.pages.some((page) => page.slug === 'home') ||
    !snapshot.calculator
  ) {
    throw new Error('Public database content is incomplete; existing snapshot preserved.');
  }
  // Verify the exported images can be served without the database.
  const images = [];
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.src === 'string') {
      if (!(value.width > 0 && value.height > 0) || typeof value.alt !== 'string') {
        throw new Error('Snapshot images need their existing dimensions and alternative text.');
      }
      images.push(value.src);
    }
    Object.values(value).forEach(visit);
  }
  visit(snapshot);
  for (const src of new Set(images)) {
    if (!src.startsWith('/assets/')) {
      throw new Error('Snapshot image must be bundled in public/assets before export.');
    }
    const root = new URL('../public/assets/', import.meta.url);
    const asset = new URL('.' + src.slice('/assets'.length), root);
    if (!asset.href.startsWith(root.href)) throw new Error('Invalid public asset path.');
    await fs.access(asset);
  }
  await fs.writeFile(
    new URL('../src/data/catalog.pending.json', import.meta.url),
    JSON.stringify(snapshot, null, 2) + '\n',
  );
  await fs.rename(new URL('../src/data/catalog.pending.json', import.meta.url), target);
  console.log(
    'Public fallback refreshed from the database. Review and deploy the snapshot with its assets.',
  );
} finally {
  await disconnectDatabase();
}
