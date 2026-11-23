import { z } from 'zod';
const clean = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((s) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s), 'Invalid characters.');
const optional = (max) => clean(max).optional().default('');
export const slug = z.string().regex(/^[a-z0-9-]{1,100}$/);
export const customer = z
  .object({
    name: clean(120).min(2, 'Enter your full name.'),
    email: z.email().max(254).toLowerCase(),
    phone: clean(40).refine(
      (v) => /^[+()\d\s.-]{7,40}$/.test(v) && v.replace(/\D/g, '').length >= 7,
      'Enter a valid phone number.',
    ),
    company: optional(200),
    city: optional(120),
  })
  .strict();
export const configuration = z
  .object({
    product: slug,
    style: clean(100).min(1),
    length: z.number().positive().max(100000),
    width: z.number().positive().max(100000),
    height: z.number().positive().max(100000),
    unit: z.enum(['mm', 'cm', 'in']),
    material: clean(100).min(1),
    printing: clean(100).min(1),
    finishing: z.array(clean(100)).max(10).default([]),
    quantity: z.number().int().min(1).max(10000000),
  })
  .strict();
const base = {
  customer,
  source: optional(100),
  website: z.string().max(0, 'Unable to accept this request.').optional().default(''),
};
export const enquirySchema = z
  .object({
    ...base,
    subject: clean(200).min(2),
    message: clean(10000).min(10, 'Tell us a little more about your requirement.'),
    productSlug: optional(100),
  })
  .strict();
export const quoteSchema = z
  .object({
    ...base,
    productSlug: slug,
    requirements: clean(10000).min(10),
    quantity: z.number().int().min(1).max(10000000),
    dimensions: optional(300),
    material: optional(300),
    printing: optional(300),
    finishing: optional(1000),
    attachmentIds: z
      .array(z.string().regex(/^[a-f\d]{24}$/i))
      .max(3)
      .default([]),
    uploadToken: optional(2000),
  })
  .strict();
export const calculatorSubmissionSchema = z
  .object({ ...base, configuration, requirements: optional(10000) })
  .strict();
export const listingSchema = z
  .object({
    page: z.coerce.number().int().min(1).max(10000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(24),
    search: optional(120),
    category: optional(100),
    featured: optional(10),
  })
  .strict();
