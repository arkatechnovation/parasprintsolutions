import { randomUUID } from 'node:crypto';
import { Enquiry, Quotation, CalculatorSubmission, Product, Media } from '../models/index.js';
import { enquirySchema, quoteSchema, calculatorSubmissionSchema } from '../validators/index.js';
import { validate, ApiError, ok } from '../utils/errors.js';
import { calculate } from '../services/calculator.js';
import { notifySubmission } from '../services/email.js';
import { validateAttachments } from '../services/uploads.js';
const types = {
  enquiries: [Enquiry, enquirySchema, 'enquiry'],
  quotations: [Quotation, quoteSchema, 'quotation request'],
  calculator: [CalculatorSubmission, calculatorSubmissionSchema, 'calculator request'],
};
export const submit = (type) => async (req, res) => {
  const [Model, schema, label] = types[type];
  const data = validate(schema, req.body);
  const requestKey = req.get('Idempotency-Key') || randomUUID();
  if (!/^[a-zA-Z0-9-]{16,100}$/.test(requestKey))
    throw new ApiError(400, 'Invalid request identifier.');
  const existing = await Model.findOne({ requestKey }).select('_id');
  if (existing)
    return ok(res, { reference: existing._id, message: 'Your request has already been received.' });
  if (data.productSlug && !(await Product.exists({ slug: data.productSlug, status: 'published' })))
    throw new ApiError(422, 'Choose an available product.');
  if (type === 'calculator') data.estimate = await calculate(data.configuration);
  if (type === 'quotations') await validateAttachments(data.attachmentIds, data.uploadToken);
  delete data.website;
  delete data.uploadToken;
  let doc;
  try {
    doc = await Model.create({ ...data, requestKey });
  } catch (error) {
    if (error.code === 11000) {
      const duplicate = await Model.findOne({ requestKey });
      return ok(res, {
        reference: duplicate._id,
        message: 'Your request has already been received.',
      });
    }
    throw error;
  }
  if (data.attachmentIds?.length)
    await Media.updateMany(
      { _id: { $in: data.attachmentIds } },
      { $set: { claimedBy: doc._id }, $unset: { expiresAt: 1 } },
    );
  await notifySubmission(Model, doc, label);
  return ok(
    res,
    {
      reference: doc._id,
      message: 'Your request is saved. Our team will review your requirements.',
    },
    201,
  );
};
export const listPrivate = (Model) => async (req, res) => {
  const page = Math.max(1, Math.min(10000, Number(req.query.page) || 1));
  const limit = 25;
  const [items, total] = await Promise.all([
    Model.find()
      .select('+internalNotes')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Model.countDocuments(),
  ]);
  ok(res, items, 200, { page, limit, total, pages: Math.ceil(total / limit) });
};
