# MongoDB models

All models use Mongoose, strict schemas and timestamps. Slug-based public content has a unique slug, draft/published status and SEO title/description. Public queries include `status: published`.

| Model                | Key data and relationships                                                                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product              | Name, category reference and slug, unique description, features, specifications, materials, printing/finishing, applications, industry slugs, images, FAQs, related-product slugs, SEO, source note |
| Category             | Unique slug, name, description, order, publication status                                                                                                                                           |
| Page                 | Slug, hero copy, structured paragraphs/headings/lists/images, FAQs, highlights, workflow steps, SEO                                                                                                 |
| Industry             | Unique application content, requirements, considerations, product slugs, image, FAQs, SEO                                                                                                           |
| Blog                 | Title/slug, excerpt, structured content, category, author, tags, image, dates, related slugs, SEO, status                                                                                           |
| CaseStudy            | Article fields plus permission-controlled client reference/name, challenge, solution, documented results, products and images                                                                       |
| Client               | Published source name/sector, optional image, permission flag, order                                                                                                                                |
| Testimonial          | Name, role, quote, status and permission confirmation; imported testimonials remain draft                                                                                                           |
| Gallery              | Category, image with dimensions/alt/kind, source filename, order and status                                                                                                                         |
| Machine              | Source equipment description, optional image, status and order                                                                                                                                      |
| Certification        | Certificate identity/document, verification flag, expiry and status; none seeded as verified                                                                                                        |
| Enquiry              | Customer details, subject/message, product/source, status, private internal notes, idempotency key, notification state                                                                              |
| Quotation            | Customer and product, quantity/dimensions/material/printing/finishing/requirements, private Media references, status/notes/idempotency                                                              |
| CalculatorSetting    | Public option lists, supported products, software caps, private rate card, pricing verification and disclaimer                                                                                      |
| CalculatorSubmission | Customer, validated configuration, server estimate snapshot, requirements/source/status/notes/idempotency                                                                                           |
| Media                | Private provider/storage key, original name, MIME/size, hashed upload-session ownership, claim and expiry                                                                                           |
| SiteSetting          | Unique setting key, explicit public flag, structured value                                                                                                                                          |

Image records retain source path, meaningful alt text, actual intrinsic dimensions and one of `illustrative`, `document` or `brand`. This prevents the website from labelling decorative factory artwork as verified facility photography.

Structured content supports paragraphs, headings, lists, images and safe HTTP(S)/relative link blocks. It is rendered through React without executing arbitrary stored HTML. A future editor can author supported block types and add explicit sanitisation for additional formats rather than using raw `dangerouslySetInnerHTML` for content.

## Indexes

- Unique content slugs, setting keys and sparse unique request-idempotency keys.
- Publication-status indexes; product/blog text indexes.
- Submission creation-date indexes and status indexes.
- Media session ownership index.

The seeder creates indexes. Production migrations should review additional compound indexes based on real query volume, backups and data size. Do not drop existing collections to reseed: `$setOnInsert` preserves database edits.

## Future admin integration

Private reads use a strong server-only integration key. No admin UI, login screen or anonymous write API is included. The future admin service must add its own authentication, role-based authorisation, audit records and validated mutations, reuse the existing models, and enforce case-study/testimonial permission and certification verification rules before changing publication status.

Private customer records, upload paths, rate cards, secrets and internal notes must never be returned by public content endpoints. Final pricing and performance claims require business approval rather than merely a schema field being present.
