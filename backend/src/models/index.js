import mongoose from 'mongoose';
const { Schema } = mongoose;
const text = (max = 500) => ({ type: String, trim: true, maxlength: max });
const seo = { title: text(160), description: text(320) };
const image = new Schema(
  {
    src: text(500),
    alt: text(500),
    width: Number,
    height: Number,
    kind: { type: String, enum: ['illustrative', 'document', 'brand'], default: 'illustrative' },
  },
  { _id: false },
);
const block = new Schema(
  {
    type: { type: String, enum: ['paragraph', 'heading', 'list', 'image', 'link'] },
    text: text(12000),
    href: text(2000),
    items: [String],
    image,
  },
  { _id: false },
);
const faq = new Schema(
  { question: text(), answer: text(3000), category: text(80) },
  { _id: false },
);
const published = {
  slug: { type: String, required: true, unique: true, match: /^[a-z0-9-]+$/ },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  seo,
};
const make = (name, fields, indexes = []) => {
  const schema = new Schema(fields, {
    timestamps: true,
    strict: 'throw',
    toJSON: {
      transform: (_, obj) => {
        delete obj.__v;
        return obj;
      },
    },
  });
  for (const index of indexes) schema.index(index);
  return mongoose.models[name] || mongoose.model(name, schema);
};
export const Category = make('Category', {
  ...published,
  name: text(),
  description: text(3000),
  order: Number,
});
export const Product = make(
  'Product',
  {
    ...published,
    name: text(),
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    categorySlug: text(80),
    categoryName: text(100),
    summary: text(4000),
    description: text(6000),
    features: [String],
    specifications: [{ label: String, value: String, _id: false }],
    materials: [String],
    printingOptions: [String],
    finishingOptions: [String],
    applications: [String],
    industrySlugs: [String],
    images: [image],
    faqs: [faq],
    relatedSlugs: [String],
    primary: Boolean,
    sourceNote: text(3000),
    order: Number,
  },
  [{ name: 'text', summary: 'text' }],
);
export const Page = make('Page', {
  ...published,
  title: text(),
  eyebrow: text(),
  lead: text(4000),
  blocks: [block],
  faqs: [faq],
  highlights: [{ title: String, text: String, _id: false }],
  steps: [{ title: String, text: String, _id: false }],
});
export const Industry = make('Industry', {
  ...published,
  name: text(),
  summary: text(4000),
  description: text(6000),
  requirements: [String],
  considerations: [String],
  productSlugs: [String],
  image,
  faqs: [faq],
  order: Number,
});
const article = {
  ...published,
  title: text(),
  excerpt: text(2000),
  content: [block],
  featuredImage: image,
  category: text(100),
  author: text(120),
  tags: [String],
  publishedAt: Date,
  relatedSlugs: [String],
  faqs: [faq],
};
export const Blog = make('Blog', article, [{ title: 'text', excerpt: 'text' }]);
export const CaseStudy = make('CaseStudy', {
  ...article,
  client: { type: Schema.Types.ObjectId, ref: 'Client' },
  clientName: text(),
  clientPermission: { type: Boolean, default: false },
  industry: text(),
  challenge: text(8000),
  solution: text(8000),
  results: text(8000),
  productSlugs: [String],
  images: [image],
});
export const Client = make('Client', {
  ...published,
  name: text(),
  sector: text(),
  image,
  permissionConfirmed: Boolean,
  order: Number,
});
export const Testimonial = make('Testimonial', {
  ...published,
  name: text(),
  role: text(),
  quote: text(5000),
  permissionConfirmed: Boolean,
});
export const Gallery = make('Gallery', {
  ...published,
  title: text(),
  category: text(100),
  image,
  sourceFile: text(),
  order: Number,
});
export const Machine = make('Machine', {
  ...published,
  name: text(),
  description: text(4000),
  image,
  order: Number,
});
export const Certification = make('Certification', {
  ...published,
  name: text(),
  certificateNumber: text(),
  document: text(),
  verified: Boolean,
  expiresAt: Date,
});
const customer = new Schema(
  {
    name: { ...text(120), required: true },
    email: { ...text(254), required: true, lowercase: true },
    phone: text(40),
    company: text(200),
    city: text(120),
  },
  { _id: false },
);
const submission = {
  customer,
  source: text(100),
  status: {
    type: String,
    enum: ['new', 'reviewing', 'responded', 'closed'],
    default: 'new',
    index: true,
  },
  internalNotes: { ...text(12000), select: false },
  requestKey: { type: String, unique: true, sparse: true, select: false },
  notificationStatus: {
    type: String,
    enum: ['pending', 'sent', 'not-configured', 'failed'],
    default: 'pending',
  },
};
export const Enquiry = make(
  'Enquiry',
  { ...submission, subject: text(200), message: text(10000), productSlug: text(100) },
  [{ createdAt: -1 }],
);
const configuration = new Schema(
  {
    product: String,
    style: String,
    length: Number,
    width: Number,
    height: Number,
    unit: String,
    material: String,
    printing: String,
    finishing: [String],
    quantity: Number,
  },
  { _id: false },
);
export const Quotation = make(
  'Quotation',
  {
    ...submission,
    productSlug: text(100),
    requirements: text(10000),
    quantity: Number,
    dimensions: text(300),
    material: text(300),
    printing: text(300),
    finishing: text(1000),
    configuration,
    attachmentIds: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
  },
  [{ createdAt: -1 }],
);
export const CalculatorSetting = make('CalculatorSetting', {
  key: { type: String, unique: true },
  products: [String],
  styles: [{ value: String, label: String, products: [String], _id: false }],
  materials: [{ value: String, label: String, products: [String], _id: false }],
  printing: [{ value: String, label: String, products: [String], _id: false }],
  finishing: [{ value: String, label: String, products: [String], _id: false }],
  maxDimensionMm: Number,
  maxQuantity: Number,
  pricingVerified: { type: Boolean, default: false },
  rates: { type: Schema.Types.Mixed, select: false },
  currency: { type: String, default: 'INR' },
  disclaimer: text(2000),
});
export const CalculatorSubmission = make(
  'CalculatorSubmission',
  {
    ...submission,
    configuration,
    requirements: text(10000),
    estimate: { type: Schema.Types.Mixed },
    attachmentIds: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
  },
  [{ createdAt: -1 }],
);
export const Media = make(
  'Media',
  {
    originalName: text(180),
    mime: text(100),
    size: Number,
    provider: { type: String, enum: ['local', 'cloudinary'] },
    storageKey: { ...text(700), select: false },
    uploadSession: { ...text(128), select: false },
    claimedBy: { type: Schema.Types.ObjectId },
    expiresAt: Date,
  },
  [{ uploadSession: 1 }],
);
export const SiteSetting = make('SiteSetting', {
  key: { type: String, unique: true },
  public: Boolean,
  value: Schema.Types.Mixed,
});
export const models = {
  Product,
  Category,
  Page,
  Industry,
  Blog,
  CaseStudy,
  Client,
  Testimonial,
  Gallery,
  Machine,
  Certification,
  Enquiry,
  Quotation,
  CalculatorSetting,
  CalculatorSubmission,
  Media,
  SiteSetting,
};
