import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import {
  Product,
  Category,
  Page,
  Industry,
  Blog,
  CaseStudy,
  Client,
  Gallery,
  Testimonial,
  Machine,
  Certification,
  CalculatorSetting,
  SiteSetting,
  Enquiry,
  Quotation,
  CalculatorSubmission,
  Media,
} from '../models/index.js';
import { slug, listingSchema, configuration } from '../validators/index.js';
import { ok, validate, ApiError } from '../utils/errors.js';
import { internalOnly, submissionLimit, uploadLimit } from '../middleware/security.js';
import { calculate } from '../services/calculator.js';
import {
  createUploadSession,
  verifyUploadSession,
  storeUpload,
  uploadDirectory,
} from '../services/uploads.js';
import { submit, listPrivate } from '../controllers/submissions.js';
const router = Router();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const list =
  (Model, extra = {}) =>
  async (req, res) => {
    const q = validate(listingSchema, req.query);
    const filter = { status: 'published', ...extra };
    if (q.search)
      filter[Model === Product || Model === Industry || Model === Client ? 'name' : 'title'] = {
        $regex: escapeRegex(q.search),
        $options: 'i',
      };
    if (q.category) filter[Model === Product ? 'categorySlug' : 'category'] = q.category;
    if (q.featured === 'true' && Model === Product) filter.primary = true;
    const [data, total] = await Promise.all([
      Model.find(filter)
        .sort(
          Model === Blog || Model === CaseStudy ? { publishedAt: -1 } : { order: 1, createdAt: 1 },
        )
        .skip((q.page - 1) * q.limit)
        .limit(q.limit)
        .lean(),
      Model.countDocuments(filter),
    ]);
    ok(res, data, 200, { page: q.page, limit: q.limit, total, pages: Math.ceil(total / q.limit) });
  };
const detail = (Model) => async (req, res) => {
  const value = validate(slug, req.params.slug);
  const data = await Model.findOne({ slug: value, status: 'published' }).lean();
  if (!data) throw new ApiError(404, 'This content is not available.');
  ok(res, data);
};
router.get('/products', list(Product));
router.get('/products/:slug', detail(Product));
router.get('/categories', list(Category));
router.get('/categories/:slug', detail(Category));
router.get('/pages/:slug', detail(Page));
router.get('/industries', list(Industry));
router.get('/industries/:slug', detail(Industry));
router.get('/blogs', list(Blog));
router.get('/blogs/:slug', detail(Blog));
router.get('/case-studies', list(CaseStudy));
router.get('/case-studies/:slug', detail(CaseStudy));
router.get('/clients', list(Client));
router.get('/testimonials', list(Testimonial, { permissionConfirmed: true }));
router.get('/gallery/categories', async (req, res) =>
  ok(res, await Gallery.distinct('category', { status: 'published' })),
);
router.get('/gallery', list(Gallery));
router.get('/machines', list(Machine));
router.get('/certifications', list(Certification, { verified: true }));
router.get('/settings/public', async (req, res) =>
  ok(
    res,
    Object.fromEntries(
      (await SiteSetting.find({ public: true }).lean()).map((s) => [s.key, s.value]),
    ),
  ),
);
router.get('/calculator/settings', async (req, res) =>
  ok(res, await CalculatorSetting.findOne({ key: 'default' }).lean()),
);
router.post('/calculator/estimate', submissionLimit, async (req, res) =>
  ok(res, await calculate(validate(configuration, req.body))),
);
router.post('/calculator/submit', submissionLimit, submit('calculator'));
router.post('/enquiries', submissionLimit, submit('enquiries'));
router.get('/enquiries', internalOnly, listPrivate(Enquiry));
router.post('/quotations', submissionLimit, submit('quotations'));
router.get('/quotations', internalOnly, listPrivate(Quotation));
router.get('/calculator/submissions', internalOnly, listPrivate(CalculatorSubmission));
router.post('/uploads/session', uploadLimit, (req, res) => {
  if (req.body?.website) throw new ApiError(422, 'Unable to accept this request.');
  ok(res, { token: createUploadSession(), expiresIn: 1800 });
});
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 0 },
  fileFilter: (req, file, done) =>
    done(null, ['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)),
});
router.post(
  '/uploads',
  uploadLimit,
  (req, res, next) => {
    verifyUploadSession(req.get('X-Upload-Token'));
    next();
  },
  upload.single('file'),
  async (req, res) => ok(res, await storeUpload(req.file, req.get('X-Upload-Token')), 201),
);
router.get('/uploads/:id', internalOnly, async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) throw new ApiError(404, 'File not found.');
  const media = await Media.findById(req.params.id).select('+storageKey').lean();
  if (!media) throw new ApiError(404, 'File not found.');
  res.set('Cache-Control', 'no-store');
  if (media.provider === 'cloudinary') {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return ok(res, {
      url: cloudinary.utils.private_download_url(media.storageKey, '', {
        resource_type: 'raw',
        type: 'authenticated',
        expires_at: Math.floor(Date.now() / 1000) + 60,
        attachment: true,
      }),
    });
  }
  res.type(media.mime);
  res.attachment(media.originalName);
  res.send(await fs.readFile(path.join(uploadDirectory, path.basename(media.storageKey))));
});
export default router;
