# MASTER PROMPT: COMPLETE WEBSITE REDESIGN AND DEVELOPMENT — PARAS PRINTS SOLUTIONS

## 1. PROJECT OBJECTIVE

I want you to completely redesign and rebuild the existing website of **Paras Prints Solutions** from scratch.

**Existing website:** https://parasprints-nu.vercel.app/

Your task is to analyse the existing website, understand its business, extract and preserve all useful business information, and build a completely new, modern, premium, responsive, SEO-friendly, and conversion-focused website.

This is not a simple redesign or frontend-only task. Build a complete, functional, production-ready web application with:

- Complete public-facing frontend.
- Complete backend and REST APIs.
- Database integration.
- Dynamic product and category data.
- Individual product pages.
- Industry pages.
- Manufacturing and infrastructure pages.
- Product enquiry and quotation systems.
- Packaging cost calculator (Phase 1).
- Contact forms and lead management APIs.
- Image and document upload functionality.
- Blog and case study functionality.
- SEO implementation.
- Performance optimisation.
- Security implementation.
- Responsive layouts.
- Modern animations and interactions.
- Deployment-ready architecture.

**IMPORTANT: Do not build an admin panel in this project.** I will develop the admin panel separately after the public frontend and backend are completed. However, build the backend, database models, API endpoints, and content architecture in a way that a future admin panel can connect to the same APIs without requiring major architectural changes.

Do not leave incomplete pages, placeholder sections, non-functional buttons, dummy forms, or disconnected frontend components.

---

# 2. FIRST STEP: ANALYSE THE EXISTING WEBSITE

Before writing code, inspect the complete existing website:

https://parasprints-nu.vercel.app/

Analyse all accessible pages, sections, navigation links, images, product information, company details, contact information, services, and existing content.

Extract and document:

- Company name and brand identity.
- Company introduction and history.
- Products and product categories.
- Product descriptions and specifications.
- Industries served.
- Manufacturing capabilities.
- Machinery and infrastructure information.
- Quality assurance details.
- Company achievements.
- Client information and testimonials.
- Contact details and business location.
- Existing images, banners, product photographs, and logos.
- Existing SEO-relevant content.
- Existing internal page structure.

### Content preservation rules

1. Preserve genuine company information and useful existing content.
2. Improve grammar, readability, presentation, and SEO.
3. Do not invent certifications, client names, testimonials, machinery, production capacities, company statistics, awards, or achievements.
4. Do not fabricate product specifications or technical capabilities.
5. Do not invent prices or manufacturing claims.
6. If information cannot be verified, create a clearly identifiable content placeholder for later confirmation.
7. Preserve original product images wherever appropriate.
8. Do not reuse an old website's poor layout simply because it already exists.
9. Create a complete content inventory before implementation.
10. Ensure that important business information is not accidentally omitted.

The existing website is the source of business information, not the design reference. You have complete freedom to create a substantially better UI and UX.

---

# 3. DESIGN DIRECTION AND BRAND IDENTITY

Create a premium, minimal, modern industrial corporate website.

The website should communicate:

- Professional manufacturing capabilities.
- Reliability.
- Product quality.
- Industrial expertise.
- Custom packaging solutions.
- Commercial printing capabilities.
- Long-term business relationships.

### Visual direction

Use a clean, minimal, premium corporate design.

Suggested colour palette:

- Primary background: #FFFFFF
- Secondary background: #F5F5F3
- Main text: #202020
- Secondary text: #666666
- Accent colour: #B86B42
- Dark sections: #171717
- Borders: #E7E7E7

Use the accent colour carefully. Avoid excessive gradients, unnecessary shadows, excessive rounded cards, and decorative elements that reduce professionalism.

### Typography

Use:

- Manrope for headings.
- Inter for body text.

Maintain clear typography hierarchy, comfortable line spacing, readable text sizes, and consistent spacing.

### UI requirements

- Premium industrial website aesthetic.
- Large, well-composed hero sections.
- High-quality product photography.
- Consistent image aspect ratios.
- Clean navigation.
- Generous whitespace.
- Structured product grids.
- Elegant hover interactions.
- Professional buttons.
- Consistent cards and content containers.
- Responsive navigation.
- Clear calls to action.
- Accessible colour contrast.

Avoid:

- Generic AI-generated website layouts.
- Overused glassmorphism.
- Excessive animations.
- Unnecessary decorative shapes.
- Oversized text that breaks mobile layouts.
- Inconsistent spacing.
- Random colour combinations.
- Excessively rounded components.
- Tailwind CSS.

---

# 4. TECHNOLOGY STACK

Use the following technology stack.

## Frontend

- Next.js with App Router.
- React.
- JavaScript.
- Bootstrap 5.
- Plain CSS / CSS Modules.
- Framer Motion for animations.
- GSAP only where genuinely necessary.
- React Icons or Lucide React.
- Axios or an equivalent API client.

Do not use TypeScript unless a specific existing project constraint makes it necessary.

Do not use Tailwind CSS.

Use reusable components and maintain a clean component architecture.

## Backend

- Node.js.
- Express.js.
- JavaScript.
- MongoDB.
- Mongoose.
- REST APIs.
- Cloudinary for appropriate media storage.
- Nodemailer or a reliable email integration.
- Multer for file uploads.
- Helmet.
- Express Rate Limit.
- Express Validator or Joi/Zod-compatible validation.

## Development architecture

Use a structured frontend/backend project.

Suggested root structure:

paras-prints/

- frontend/
- backend/
- documentation/
- README.md
- .gitignore

Maintain independent environment configurations for frontend and backend.

Do not expose API secrets, database credentials, SMTP credentials, or Cloudinary secrets in frontend code.

---

# 5. GLOBAL WEBSITE STRUCTURE

Create the following public-facing routes.

1. `/`
2. `/about`
3. `/products`
4. `/products/corrugated-boxes`
5. `/products/duplex-boxes`
6. `/products/paper-bags`
7. `/products/brochures`
8. `/products/catalogues`
9. `/products/leaflets`
10. `/industries`
11. `/industries/electrical-electronics`
12. `/industries/automotive`
13. `/industries/pharmaceuticals`
14. `/industries/food-beverages`
15. `/industries/fmcg`
16. `/industries/engineering`
17. `/industries/ecommerce`
18. `/industries/home-appliances`
19. `/manufacturing-process`
20. `/infrastructure`
21. `/quality-assurance`
22. `/clients`
23. `/gallery`
24. `/blog`
25. `/blog/[slug]`
26. `/case-studies`
27. `/case-studies/[slug]`
28. `/packaging-calculator`
29. `/request-a-quote`
30. `/contact`
31. `/faq`
32. `/downloads`
33. `/privacy-policy`
34. `/terms-and-conditions`
35. `/thank-you`

Only publish individual industry pages when sufficient unique, verified content exists. Do not create thin SEO pages by duplicating content with different industry names.

---

# 6. GLOBAL HEADER AND NAVIGATION

Build a premium, responsive header.

### Desktop navigation

Include:

- Home
- About Us
- Products
- Industries
- Manufacturing
- Infrastructure
- Quality
- Resources
- Contact

Products should have a structured mega menu with product categories.

Industries should have a structured dropdown.

Resources should include:

- Blog.
- Case Studies.
- Downloads.
- FAQ.

Add a prominent Request a Quote CTA.

### Header behaviour

- Sticky header.
- Transparent or visually integrated header on the homepage hero if appropriate.
- Solid background after scrolling.
- Smooth transitions.
- Responsive mobile navigation.
- Accessible keyboard navigation.
- Proper dropdown handling.
- Active route highlighting.
- Clickable logo returning to homepage.

On mobile, create a clean slide-in navigation or accessible full-screen menu.

---

# 7. HOMEPAGE — COMPLETE DESIGN AND FUNCTIONALITY

The homepage is the most important page.

Build it as a premium, visually engaging, conversion-focused landing page.

Every major homepage section must have carefully designed scroll-triggered animation.

## Section 1: Hero

Create an impressive hero section with:

- Strong business-focused headline.
- Supporting description.
- Primary CTA: Explore Our Products.
- Secondary CTA: Request a Quote.
- High-quality packaging/manufacturing visual.
- Subtle background treatment.
- Optional verified company experience indicator.

Use a headline that communicates custom packaging and printing capabilities.

Avoid generic statements such as "We Create the Future."

The hero should immediately communicate what the company manufactures and whom it serves.

## Section 2: Trust and Company Highlights

Display only verified company information.

Possible highlights:

- Years of experience.
- Product categories.
- Industries served.
- Manufacturing capabilities.
- Customer relationships.

Do not invent numerical statistics.

If information is unavailable, use qualitative statements rather than fake numbers.

## Section 3: About the Company

Include:

- Company introduction.
- Business background.
- Core expertise.
- Manufacturing philosophy.
- Commitment to quality.
- Image composition.
- CTA to About Us.

## Section 4: Product Categories

Create a premium product showcase.

Include:

- Corrugated Boxes.
- Duplex Boxes.
- Paper Bags.
- Brochures.
- Catalogues.
- Leaflets.

Each product card should contain:

- Product image.
- Product name.
- Short description.
- Explore Product CTA.
- Hover interaction.

Link every card to its corresponding product detail page.

## Section 5: Manufacturing Capabilities

Showcase the company's manufacturing and printing capabilities.

Include only verified services and processes.

Create visually attractive cards or a structured horizontal layout.

## Section 6: Why Choose Us

Include business-relevant benefits such as:

- Customised packaging solutions.
- Quality-focused production.
- Printing capabilities.
- Product consistency.
- Customer-oriented approach.
- Industry-specific solutions.

Do not make unsupported claims.

## Section 7: Manufacturing Process

Create a visual manufacturing journey.

Possible stages:

1. Requirement Discussion.
2. Design and Specification.
3. Material Selection.
4. Printing and Production.
5. Quality Inspection.
6. Packaging and Dispatch.

Clearly identify these as the company's actual process only after verification.

Use an elegant timeline or connected process layout.

## Section 8: Industries We Serve

Display industry cards for:

- Electrical and Electronics.
- Automotive.
- Pharmaceuticals.
- Food and Beverages.
- FMCG.
- Engineering.
- E-commerce.
- Home Appliances.

Each card should have an appropriate visual, short explanation, and relevant link.

## Section 9: Infrastructure and Machinery

Show real factory, machinery, production, and infrastructure images where available.

Include a CTA to explore infrastructure.

Do not generate fake factory photographs and present them as the company's actual facility.

## Section 10: Client Portfolio

Display verified client logos or names.

Use a clean logo grid or subtle horizontal carousel.

Do not invent clients.

If client information is unavailable, do not display fake logos.

## Section 11: Packaging Calculator Preview

Introduce the packaging cost calculator.

Include:

- Short explanation.
- What users can calculate.
- CTA to open the calculator.
- A clean calculator preview visual.

## Section 12: Quality Assurance

Highlight quality-focused practices.

Include:

- Material inspection.
- Print quality.
- Dimensional accuracy.
- Production consistency.
- Final inspection.

Only claim specific processes that can be verified.

## Section 13: Testimonials

Display real customer testimonials only.

If existing testimonials are unavailable, omit the section or prepare it for future content. Never fabricate reviews.

## Section 14: FAQs

Display relevant homepage FAQs using an accessible accordion.

Include questions about:

- Product customisation.
- Minimum order quantities.
- Printing options.
- Quotation process.
- Product specifications.
- Delivery and order requirements.

Answers must reflect verified company policies. If unknown, use appropriately qualified wording.

## Section 15: Final CTA

Create an impressive final conversion section.

Include:

- Strong headline.
- Short description.
- Request a Quote CTA.
- Contact CTA.
- WhatsApp CTA if a verified business number exists.

## Section 16: Footer

Build a complete premium footer containing:

- Company logo.
- Company introduction.
- Quick navigation.
- Product categories.
- Industry links.
- Contact details.
- Business address.
- Email.
- Phone.
- WhatsApp.
- Social media links.
- Privacy Policy.
- Terms and Conditions.
- Copyright.

All contact information must come from verified existing company information.

---

# 8. ABOUT US PAGE

Create a complete company profile page.

Sections:

1. About Us hero.
2. Company introduction.
3. Company background and history.
4. Business philosophy.
5. Vision and mission, if verified.
6. Core capabilities.
7. Product expertise.
8. Industries served.
9. Manufacturing approach.
10. Quality commitment.
11. Why businesses choose the company.
12. CTA.

Use a combination of editorial layouts, photographs, and structured content blocks.

The page must be useful to potential customers and business decision-makers.

---

# 9. PRODUCTS DIRECTORY PAGE

Create a central product listing page.

Include:

- Product hero.
- Introductory description.
- Product category grid.
- Product images.
- Short product descriptions.
- Relevant applications.
- Product-specific CTAs.
- Quote CTA.

If the product catalogue grows, support filtering by category and searching by product name.

Product information must be fetched through APIs rather than duplicated in individual frontend files.

---

# 10. INDIVIDUAL PRODUCT DETAIL PAGES

Create six separate, complete product detail pages.

Each page must have its own content, visual identity, metadata, and product-specific SEO strategy.

Do not simply reuse the same page with different titles.

## A. Corrugated Boxes

Include:

- Product hero.
- Product overview.
- Corrugated box image gallery.
- Box styles and configurations.
- Available flute types, only when verified.
- Board and material options.
- Printing options.
- Custom dimensions.
- Branding options.
- Applications.
- Industries served.
- Product advantages.
- Quality considerations.
- Related products.
- Product FAQs.
- Request a Quote form.

Potential applications include industrial packaging, shipping, e-commerce, and product protection, subject to the company's actual capabilities.

## B. Duplex Boxes

Include:

- Product hero.
- Product overview.
- Product gallery.
- Box styles.
- Paperboard options.
- GSM and material specifications, only when verified.
- Printing options.
- Lamination and finishing options, only when available.
- Customisation.
- Branding.
- Applications.
- Industries served.
- Related products.
- FAQs.
- Quote CTA.

## C. Paper Bags

Include:

- Product hero.
- Product overview.
- Paper bag gallery.
- Bag styles.
- Handle options.
- Paper material options.
- Printing options.
- Sizes and custom dimensions.
- Branding.
- Applications.
- Industries served.
- Related products.
- FAQs.
- Quote CTA.

## D. Brochures

Include:

- Product hero.
- Product overview.
- Brochure styles.
- Fold types.
- Paper options.
- Printing options.
- Finishing options.
- Customisation.
- Business and promotional applications.
- Gallery.
- Related products.
- FAQs.
- Quote CTA.

## E. Catalogues

Include:

- Product hero.
- Product overview.
- Catalogue formats.
- Binding options.
- Page configurations.
- Paper options.
- Printing options.
- Finishing options.
- Product photography presentation.
- Business applications.
- Gallery.
- Related products.
- FAQs.
- Quote CTA.

## F. Leaflets

Include:

- Product hero.
- Product overview.
- Leaflet sizes.
- Paper options.
- Single-side and double-side printing, if available.
- Fold options.
- Finishing options.
- Customisation.
- Marketing applications.
- Gallery.
- Related products.
- FAQs.
- Quote CTA.

### Product page technical requirements

Every product page must support:

- Unique SEO title.
- Unique meta description.
- Canonical URL.
- Open Graph metadata.
- Breadcrumbs.
- Product-specific images.
- Optimised image alt text.
- Related product links.
- Relevant industry links.
- Structured FAQs.
- Quote enquiry with product preselected.

Use Product structured data only where the page represents a genuine product offering and the required data is accurate. Do not invent prices, availability, or reviews.

---

# 11. INDUSTRIES PAGES

Create an Industries landing page with individual industry pages where unique content is available.

Industry categories:

1. Electrical and Electronics.
2. Automotive.
3. Pharmaceuticals.
4. Food and Beverages.
5. FMCG.
6. Engineering.
7. E-commerce.
8. Home Appliances.

Each industry page should include:

- Industry-specific hero.
- Industry overview.
- Packaging and printing requirements.
- Relevant product categories.
- Potential packaging applications.
- Relevant product images.
- Customisation considerations.
- Quality and protection considerations.
- Related products.
- FAQs.
- Request a Quote CTA.

Never claim regulatory compliance, certifications, or specialist manufacturing capabilities without evidence.

Avoid duplicate SEO content across industry pages.

---

# 12. MANUFACTURING PROCESS PAGE

Build a complete page describing the production workflow.

Include:

- Process overview.
- Requirement gathering.
- Design and specification.
- Material selection.
- Printing.
- Production.
- Finishing.
- Quality inspection.
- Packaging.
- Dispatch.

Use a visually engaging process timeline with clear descriptions and suitable images.

Only present verified company-specific processes as factual.

---

# 13. INFRASTRUCTURE PAGE

Create a premium infrastructure and manufacturing facility page.

Include:

- Infrastructure introduction.
- Factory photographs.
- Machinery gallery.
- Production capabilities.
- Equipment descriptions.
- Manufacturing environment.
- Production workflow.
- Facility-related FAQs.
- CTA.

Create a clean image gallery with lightbox functionality.

Never use stock factory images as actual company infrastructure.

If real images are unavailable, create an explicitly marked image placeholder for future replacement.

---

# 14. QUALITY ASSURANCE PAGE

Include:

- Quality philosophy.
- Raw material inspection.
- Production monitoring.
- Print quality checks.
- Dimensional checks.
- Finishing inspection.
- Final quality verification.
- Quality-related documentation, where verified.
- CTA.

Do not invent ISO certification or other certifications.

If no certification details are available, do not show certification badges.

---

# 15. CLIENTS PAGE

Create a client portfolio page.

Include:

- Introduction.
- Verified client logos.
- Client categories or industries, where relevant.
- Case study links, if available.
- CTA.

Support an organised logo grid.

Do not fabricate client relationships.

---

# 16. GALLERY PAGE

Build a complete gallery.

Organise images into categories such as:

- Products.
- Packaging.
- Printing.
- Manufacturing.
- Machinery.
- Infrastructure.

Include:

- Responsive grid.
- Category filters.
- Image lightbox.
- Lazy loading.
- Optimised image sizes.
- Descriptive alt text.

Gallery data must come from the backend.

---

# 17. BLOG AND ARTICLE SYSTEM

Build a complete blog listing and article detail system.

## Blog listing page

Include:

- Blog hero.
- Featured article.
- Latest articles.
- Category filters.
- Search.
- Pagination.
- Article thumbnails.
- Publication dates.
- Reading time.
- Related content.

## Blog detail page

Include:

- Article title.
- SEO description.
- Author.
- Publication date.
- Updated date.
- Featured image.
- Article content.
- Table of contents for long articles.
- Social sharing.
- Related articles.
- Breadcrumbs.
- Relevant internal links.
- CTA.

Support structured content, headings, lists, images, links, and FAQs.

Suggested content topics:

- Choosing the right corrugated box.
- Packaging solutions for e-commerce.
- Importance of product packaging.
- Types of printing finishes.
- Custom packaging considerations.
- Packaging selection for industrial products.
- Brochure and catalogue printing considerations.

Create the backend functionality for blog content management, but do not create the admin interface.

---

# 18. CASE STUDIES

Create a case study listing page and individual case study detail pages.

Each case study should support:

- Project title.
- Client name, only with permission or verified information.
- Industry.
- Business challenge.
- Packaging or printing requirement.
- Solution.
- Product used.
- Project photographs.
- Results, only if documented.
- Related products.
- CTA.

Do not invent client projects or measurable results.

If no case study data exists, create the complete reusable system and an empty state that encourages visitors to contact the company.

---

# 19. PACKAGING CALCULATOR — PHASE 1

Build a functional packaging calculator.

This is a key interactive feature.

Create a clean, multi-step calculator interface.

## Step 1: Select product

Allow users to choose available packaging categories.

Initially support applicable box products, particularly corrugated and duplex boxes.

## Step 2: Select box configuration

Provide supported box styles, with the ability to expand later.

## Step 3: Enter dimensions

Collect:

- Length.
- Width.
- Height.
- Measurement unit.

Validate all dimensions.

## Step 4: Select material

Provide available material options only when verified.

## Step 5: Select printing

Allow users to select applicable printing requirements.

## Step 6: Select finishing

Display only applicable finishing options.

## Step 7: Enter quantity

Validate minimum quantities against actual company policies. Do not invent MOQ.

## Step 8: Calculate estimate

Build a modular calculation engine.

Important pricing rules:

- Never hardcode arbitrary market prices.
- Store configurable rates and calculation parameters in the database.
- Keep calculation logic in the backend.
- Support future pricing adjustments without frontend changes.
- Separate material cost, printing cost, finishing cost, and other configurable components.
- Validate all dimensions and quantity inputs.
- Do not expose confidential internal pricing rules to the frontend.
- If actual pricing data is unavailable, show an estimated quotation request workflow rather than fabricating a price.

## Step 9: Display result

Where verified pricing data exists, display:

- Estimated unit cost.
- Estimated total cost.
- Selected specifications.
- Quantity.
- Estimate disclaimer.
- Request Detailed Quote CTA.

Where pricing is not configured, display a message explaining that the team will prepare a quotation based on the selected specifications.

## Step 10: Customer information

Collect:

- Name.
- Company name.
- Email.
- Phone.
- City.
- Additional requirements.

## Step 11: Submit

Store calculator submissions in MongoDB.

Send a confirmation email to the customer and a notification to the company.

Show a proper success screen.

### Calculator technical requirements

- Multi-step progress indicator.
- Back and Next controls.
- Form validation.
- Responsive interface.
- Clear error messages.
- Persistent form state during navigation.
- Backend calculation API.
- Backend submission API.
- Secure data validation.
- Duplicate submission protection where appropriate.
- Configurable calculation rules.

Do not build the calculator as a fake visual demo.

---

# 20. REQUEST A QUOTE PAGE

Build a complete quotation request page.

Fields:

- Full name.
- Company name.
- Email.
- Phone number.
- City.
- Product category.
- Product requirements.
- Quantity.
- Dimensions.
- Material requirements.
- Printing requirements.
- Finishing requirements.
- Additional notes.
- Artwork or reference file upload.

Features:

- Product-specific preselection.
- Client-side validation.
- Server-side validation.
- Secure file uploads.
- Upload restrictions by file type and size.
- Submission confirmation.
- Customer acknowledgement email.
- Company notification email.
- Store submissions in MongoDB.

The quote form should be accessible from all relevant product pages.

---

# 21. CONTACT PAGE

Include:

- Contact hero.
- Company introduction.
- Verified phone number.
- Verified email address.
- Verified business address.
- Contact form.
- Google Maps embed only if the correct business location is verified.
- WhatsApp contact link.
- Business hours, if verified.
- Social links.
- FAQ.
- CTA.

Contact form fields:

- Name.
- Email.
- Phone.
- Subject.
- Message.

Save submissions in MongoDB and send email notifications.

---

# 22. FAQ PAGE

Create a structured FAQ page.

Organise questions into categories:

- Products.
- Customisation.
- Materials.
- Printing.
- Minimum order quantities.
- Quotation.
- Manufacturing.
- Delivery.
- General enquiries.

Answers must be based on verified company policies.

Implement accessible accordion behaviour.

Add relevant internal links.

Use FAQ structured data only where appropriate and compliant with current search engine guidelines.

---

# 23. DOWNLOADS PAGE

Create a resource download page.

Support:

- Company profile PDF.
- Product catalogues.
- Brochures.
- Technical documents.
- Other approved downloadable resources.

Only display actual available documents.

Implement secure and validated download links.

---

# 24. LEGAL AND SUPPORTING PAGES

Build:

- Privacy Policy.
- Terms and Conditions.
- Thank You page.
- Custom 404 page.

Privacy Policy should explain how enquiry and contact data is collected and used.

Do not claim legal compliance without appropriate verification.

The Thank You page should display a meaningful success message and useful navigation.

The 404 page should provide a clear way back to the homepage or products.

---

# 25. SCROLL ANIMATIONS AND INTERACTIONS

The homepage must have carefully designed scroll-triggered animations across every major section.

Use Framer Motion as the primary animation library.

Use GSAP only when a particular animation genuinely benefits from it.

Implement:

### Hero animations

- Headline reveal.
- Supporting text reveal.
- CTA entrance.
- Hero image movement.
- Subtle background animation.

### Trust section

- Smooth fade and slide.
- Staggered statistic reveals where verified.

### About section

- Image reveal.
- Text entrance.
- Subtle image parallax where appropriate.

### Product section

- Staggered product card entrance.
- Image hover zoom.
- CTA hover interaction.

### Capabilities section

- Sequential card reveals.
- Smooth hover transitions.

### Manufacturing process

- Timeline progress animation.
- Step-by-step reveals.
- Connected line animation where appropriate.

### Industries section

- Staggered card reveal.
- Image transitions.
- Hover interactions.

### Infrastructure section

- Image reveal.
- Gallery interactions.
- Subtle parallax where appropriate.

### Clients section

- Logo fade-in.
- Subtle carousel movement only if it improves usability.

### Calculator section

- Preview reveal.
- CTA animation.

### Quality section

- Staggered content reveal.

### Testimonials

- Smooth slider transitions if real testimonials exist.

### FAQ section

- Smooth accordion opening and closing.

### Final CTA and footer

- Smooth reveal.
- Subtle entrance animations.

### Animation rules

- Do not animate every individual word unnecessarily.
- Avoid excessive movement.
- Avoid scroll hijacking.
- Do not block normal scrolling.
- Avoid animations that delay content visibility.
- Respect `prefers-reduced-motion`.
- Keep animations smooth on mobile devices.
- Use Intersection Observer or Framer Motion viewport triggers.
- Ensure content remains visible when JavaScript is unavailable.
- Do not sacrifice SEO or Core Web Vitals for animation effects.

Use subtle hover interactions throughout the website, but keep the overall visual direction minimal.

---

# 26. SEO IMPLEMENTATION

SEO must be integrated into the complete project from the beginning.

## Technical SEO

Implement:

- Server-side rendering or static generation wherever suitable.
- Semantic HTML.
- Unique page titles.
- Unique meta descriptions.
- Canonical URLs.
- Open Graph metadata.
- Social sharing metadata.
- XML sitemap.
- Robots.txt.
- Clean URL structure.
- Breadcrumbs.
- Internal linking.
- Image alt text.
- Proper heading hierarchy.
- 404 handling.
- Redirect support where necessary.
- Noindex handling for utility and non-public pages where appropriate.

## Structured data

Implement suitable JSON-LD structured data for:

- Organization.
- LocalBusiness, only where applicable and verified.
- WebSite.
- BreadcrumbList.
- Article.
- FAQPage only when eligible under current guidelines.
- Product, only when applicable and supported by accurate data.

Never add fake ratings, prices, addresses, reviews, or business claims to structured data.

## On-page SEO

Create unique, useful content for:

- Homepage.
- About page.
- Product listing.
- Individual product pages.
- Industry pages.
- Manufacturing page.
- Infrastructure page.
- Quality page.
- Blog.
- Case studies.
- Contact page.

Target relevant search intent around packaging manufacturing, custom packaging, printing, industrial packaging, corrugated boxes, duplex boxes, paper bags, brochures, catalogues, and leaflets.

Use location-specific keywords only when they accurately represent the business's service area.

Do not keyword-stuff.

## Local SEO

Where verified, include:

- Correct company address.
- Phone number.
- Business email.
- Consistent business information.
- Relevant location references.
- Google Maps integration.
- Appropriate local structured data.

## SEO content quality

Every page must provide genuine information and useful content.

Avoid thin pages, duplicated descriptions, autogenerated keyword paragraphs, and doorway pages.

---

# 27. PERFORMANCE OPTIMISATION

Build the website with performance as a core requirement.

Target Core Web Vitals:

- LCP: 2.5 seconds or less.
- INP: 200 milliseconds or less.
- CLS: 0.1 or less.

Implement:

- Optimised images.
- Next.js Image component.
- WebP or AVIF where supported.
- Lazy loading for below-the-fold images.
- Priority loading for the hero image.
- Responsive image sizes.
- Font optimisation.
- Code splitting.
- Dynamic imports where appropriate.
- Avoid unnecessary dependencies.
- Minimise JavaScript execution.
- Avoid layout shifts.
- Database indexes.
- API pagination.
- Efficient database queries.
- Caching where appropriate.
- Compression.
- Production build optimisation.

Do not load unnecessary animation libraries or heavy components on every page.

---

# 28. RESPONSIVE DESIGN

The website must work correctly across:

- Desktop.
- Laptop.
- Tablet.
- Mobile.
- Small mobile screens.

Test at common viewport widths.

Ensure:

- No horizontal overflow.
- No broken layouts.
- No clipped headings.
- No overlapping elements.
- Proper mobile image cropping.
- Readable typography.
- Usable buttons.
- Accessible mobile menus.
- Properly spaced forms.
- Functional calculators on mobile.

Do not simply shrink the desktop layout.

Design mobile layouts intentionally.

---

# 29. BACKEND ARCHITECTURE

Build a complete modular Express backend.

Suggested structure:

backend/

- src/
  - config/
  - controllers/
  - models/
  - routes/
  - services/
  - middleware/
  - validators/
  - utils/
  - templates/
  - app.js
  - server.js
- uploads/
- .env.example
- package.json

Separate routes, controllers, business logic, database models, validation, and email services.

Do not put all business logic inside route files.

---

# 30. DATABASE MODELS

Create appropriate MongoDB models.

At minimum:

1. Product.
2. Category.
3. Page.
4. Industry.
5. Blog.
6. CaseStudy.
7. Client.
8. Testimonial.
9. Gallery.
10. Machine.
11. Certification.
12. Enquiry.
13. Quotation.
14. CalculatorSetting.
15. CalculatorSubmission.
16. Media.
17. SiteSetting.

### Important data architecture requirements

Products must support:

- Name.
- Slug.
- Category.
- Description.
- Features.
- Specifications.
- Materials.
- Printing options.
- Finishing options.
- Applications.
- Industries.
- Images.
- SEO title.
- SEO description.
- Publication status.
- Creation and update timestamps.

Blogs must support:

- Title.
- Slug.
- Excerpt.
- Content.
- Featured image.
- Category.
- Author.
- Tags.
- SEO metadata.
- Publication status.
- Published date.

Enquiries and quotations must support:

- Customer details.
- Product details.
- Requirements.
- Submission source.
- Status.
- Internal notes field for future admin use.
- Timestamps.

Use proper references, validation, indexing, and pagination.

The data models must be suitable for future CMS management.

---

# 31. REST API ENDPOINTS

Use a versioned API structure.

Base URL:

`/api/v1`

Create APIs for:

### Products

- GET `/products`
- GET `/products/:slug`
- GET `/categories`
- GET `/categories/:slug`

### Pages

- GET `/pages/:slug`

### Industries

- GET `/industries`
- GET `/industries/:slug`

### Blogs

- GET `/blogs`
- GET `/blogs/:slug`

### Case Studies

- GET `/case-studies`
- GET `/case-studies/:slug`

### Clients

- GET `/clients`

### Gallery

- GET `/gallery`
- GET `/gallery/categories`

### Testimonials

- GET `/testimonials`

### Enquiries

- POST `/enquiries`
- GET `/enquiries` only for authorised future internal integrations, not public access.

### Quotations

- POST `/quotations`
- GET `/quotations` only for authorised future internal integrations, not public access.

### Calculator

- GET `/calculator/settings` exposing only public options.
- POST `/calculator/estimate`
- POST `/calculator/submit`

### Uploads

- POST `/uploads` with secure validation and access restrictions.

### Settings

- GET `/settings/public`

All public APIs must return consistent JSON responses.

Implement:

- Proper HTTP status codes.
- Centralised error handling.
- Input validation.
- Pagination.
- Filtering.
- Search.
- Rate limiting.
- Secure access controls for private routes.

Do not expose private customer submissions through public GET endpoints.

---

# 32. EMAIL INTEGRATION

Build a reusable email service.

Support:

- New contact enquiry notification.
- New quotation request notification.
- Calculator submission notification.
- Customer confirmation email.
- File attachment handling where appropriate.

Use environment variables for:

- SMTP host.
- SMTP port.
- SMTP username.
- SMTP password.
- Sender email.
- Company notification email.

Create clean HTML email templates.

Do not hardcode credentials.

If email credentials are not configured, the website should still work and submissions should be stored successfully. Log email delivery failures safely.

---

# 33. SECURITY REQUIREMENTS

Implement:

- Helmet.
- CORS restrictions.
- Rate limiting.
- Server-side validation.
- Secure file upload handling.
- File extension and MIME type validation.
- File size restrictions.
- NoSQL injection protection.
- Safe error responses.
- Environment variables.
- Secure secrets management.
- Restricted private API access.
- Proper database connection handling.
- Spam protection for public forms.
- Honeypot fields or equivalent spam controls.
- Input sanitisation where appropriate.

Do not expose database credentials, SMTP passwords, API secrets, or internal system details.

---

# 34. FUTURE ADMIN PANEL COMPATIBILITY — NO ADMIN UI

This project must NOT include:

- Admin login page.
- Admin dashboard.
- Admin sidebar.
- Admin management interface.
- Admin analytics interface.
- Admin CRUD screens.

I will build the admin panel separately later.

However, prepare the system for future integration.

This means:

1. All important content should be database-driven.
2. Products should not be hardcoded throughout frontend pages.
3. Categories should be manageable through APIs.
4. Blogs should be manageable through APIs.
5. Gallery images should be database-driven.
6. Client and testimonial data should be database-driven.
7. SEO metadata should be stored with relevant content.
8. Publish/draft status should be supported.
9. Calculator pricing parameters should be configurable in the database.
10. Enquiry and quotation submissions should be stored properly.
11. Private APIs should be designed for future authentication and role-based access.
12. The public frontend must consume backend APIs.

Do not build unnecessary admin authentication now. Do not expose future administrative operations publicly.

The future admin panel should be able to connect to the existing backend without redesigning the database or rewriting the business logic.

---

# 35. UI COMPONENT ARCHITECTURE

Create reusable components, including:

- Header.
- Footer.
- MegaMenu.
- MobileNavigation.
- Breadcrumbs.
- PageHero.
- SectionHeading.
- PrimaryButton.
- SecondaryButton.
- ProductCard.
- ProductGrid.
- IndustryCard.
- ClientLogoGrid.
- TestimonialSlider.
- FAQAccordion.
- ImageGallery.
- Lightbox.
- QuoteForm.
- ContactForm.
- CalculatorWizard.
- CalculatorProgress.
- BlogCard.
- CaseStudyCard.
- RelatedProducts.
- WhatsAppButton.
- ScrollToTop.
- LoadingState.
- ErrorState.
- EmptyState.

Avoid duplicating UI code across pages.

---

# 36. ACCESSIBILITY

Follow WCAG 2.2 AA principles where practical.

Implement:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Accessible form labels.
- Proper error announcements.
- Sufficient colour contrast.
- Accessible accordions.
- Accessible navigation.
- Meaningful alt text.
- Reduced motion support.
- Appropriate ARIA attributes.

Ensure animations do not make content inaccessible.

---

# 37. ANALYTICS AND CONVERSION TRACKING

Prepare integration for Google Analytics 4 and Google Search Console.

Track meaningful conversion events such as:

- Quote button clicks.
- Quote form submissions.
- Contact form submissions.
- Calculator starts.
- Calculator completions.
- WhatsApp clicks.
- Phone clicks.
- Email clicks.
- Product page engagement.

Use environment-based configuration.

Do not add tracking scripts that unnecessarily harm performance.

---

# 38. CONTENT AND IMAGE MANAGEMENT

All content must be structured for future updates.

Use database-driven content for dynamic sections.

Use Cloudinary or an appropriate image storage solution for uploaded images.

Requirements:

- Responsive image delivery.
- Image optimisation.
- Meaningful alt text.
- Consistent image dimensions.
- Lazy loading.
- Proper fallback images.
- Secure upload validation.
- No broken image links.

Preserve genuine existing product and company images wherever possible.

If an image is unavailable, use a clearly identified placeholder rather than presenting an unrelated stock image as a real company photograph.

---

# 39. DEPLOYMENT READINESS

Prepare the application for production deployment.

Include:

- Production environment configuration.
- Frontend build configuration.
- Backend production start command.
- MongoDB connection configuration.
- Cloudinary configuration.
- SMTP configuration.
- CORS configuration.
- API base URL configuration.
- Environment variable examples.
- Health check endpoint.
- Error logging.
- Deployment documentation.

Create a detailed README with:

- Project overview.
- Technology stack.
- Folder structure.
- Installation instructions.
- Development commands.
- Environment variables.
- Database setup.
- API documentation.
- Production build commands.
- Deployment instructions.
- Troubleshooting.

Do not commit `.env` files or secrets.

---

# 40. DEVELOPMENT AND EXECUTION INSTRUCTIONS

Work through the entire project systematically.

Do not stop after creating the homepage.

Do not provide only a design concept or static prototype.

Do not leave important functionality for me to implement manually.

### Required execution sequence

**First: Existing website analysis**

Inspect the existing website and extract all available business content, products, images, contact information, and page requirements.

**Second: Architecture**

Create the complete frontend and backend architecture, database schemas, API structure, and reusable component system.

**Third: Design system**

Establish typography, colours, spacing, buttons, cards, responsive layouts, and animation rules.

**Fourth: Complete frontend**

Build every public page listed in this prompt.

**Fifth: Backend**

Build all required APIs, database models, validation, email services, uploads, and business logic.

**Sixth: Integration**

Connect every page, form, product, calculator, and dynamic section to the backend.

**Seventh: SEO**

Implement technical SEO, metadata, structured data, internal links, sitemap, robots.txt, and content optimisation.

**Eighth: Performance and accessibility**

Optimise all pages and verify mobile responsiveness, Core Web Vitals considerations, keyboard navigation, and reduced motion behaviour.

**Ninth: Testing**

Test all routes, forms, APIs, calculator workflows, uploads, email integration, database operations, and responsive layouts.

**Tenth: Production readiness**

Prepare the final project for deployment and document the complete setup.

You may divide your internal work into tasks and implementation stages, but do not require me to send additional prompts to complete the project.

If you are operating in an environment with limited execution time or context, continue from the existing project state rather than restarting or replacing completed work.

---

# 41. NON-NEGOTIABLE REQUIREMENTS

1. Build the entire public website, not just the homepage.
2. Build the complete backend and database.
3. Do not build the admin panel.
4. Do not use Tailwind CSS.
5. Use Next.js, React, JavaScript, Bootstrap 5, and plain CSS.
6. Keep the UI minimal, premium, and professional.
7. Add scroll-triggered animations throughout the homepage.
8. Maintain smooth performance on mobile.
9. Create genuinely unique product detail pages.
10. Implement the packaging calculator as a working feature.
11. Make every form functional and connected to the backend.
12. Store enquiries and quotations in MongoDB.
13. Implement real email integration with configurable credentials.
14. Make the website SEO-friendly from the beginning.
15. Do not invent company information.
16. Do not fabricate product prices, testimonials, statistics, or certifications.
17. Do not use fake images as actual company assets.
18. Do not leave broken links or non-functional buttons.
19. Do not hardcode dynamic product and business content throughout the frontend.
20. Ensure future admin panel compatibility.
21. Keep frontend and backend code clean, reusable, and maintainable.
22. Document the complete installation and deployment process.

---

# 42. FINAL DELIVERY CHECKLIST

Before declaring the project complete, verify all of the following:

### Frontend

- [ ] Homepage complete.
- [ ] About page complete.
- [ ] Products directory complete.
- [ ] All six product pages complete.
- [ ] Industries pages implemented where unique content is available.
- [ ] Manufacturing process complete.
- [ ] Infrastructure page complete.
- [ ] Quality page complete.
- [ ] Clients page complete.
- [ ] Gallery complete.
- [ ] Blog listing and detail pages complete.
- [ ] Case study listing and detail pages complete.
- [ ] Packaging calculator complete.
- [ ] Request a Quote page complete.
- [ ] Contact page complete.
- [ ] FAQ page complete.
- [ ] Downloads page complete.
- [ ] Legal pages complete.
- [ ] Thank You and 404 pages complete.
- [ ] Header and footer complete.
- [ ] Mobile navigation complete.

### Backend

- [ ] MongoDB connection working.
- [ ] All database models created.
- [ ] Product APIs working.
- [ ] Category APIs working.
- [ ] Blog APIs working.
- [ ] Industry APIs working.
- [ ] Gallery APIs working.
- [ ] Enquiry API working.
- [ ] Quotation API working.
- [ ] Calculator APIs working.
- [ ] Upload API working.
- [ ] Email service integrated.
- [ ] Validation implemented.
- [ ] Security middleware implemented.
- [ ] Error handling implemented.

### SEO and performance

- [ ] Unique metadata on all public pages.
- [ ] Canonical URLs.
- [ ] Sitemap.
- [ ] Robots.txt.
- [ ] Structured data.
- [ ] Internal linking.
- [ ] Image optimisation.
- [ ] Responsive layouts.
- [ ] Reduced motion support.
- [ ] Performance optimisation.
- [ ] No horizontal overflow.

### Functionality

- [ ] All navigation links working.
- [ ] All CTAs working.
- [ ] All forms submitting successfully.
- [ ] Email notifications working when credentials are configured.
- [ ] File uploads validated.
- [ ] Calculator workflow working.
- [ ] Database submissions verified.
- [ ] WhatsApp and contact links working where configured.
- [ ] No console errors.
- [ ] No broken API requests.
- [ ] No broken images.

### Final output

At the end, provide:

1. Final project folder structure.
2. Completed frontend and backend implementation.
3. Database model documentation.
4. API endpoint documentation.
5. `.env.example` files.
6. Installation instructions.
7. Local development commands.
8. Production build commands.
9. Deployment instructions.
10. List of features completed.
11. List of any features blocked by missing company information or external credentials.
12. List of items requiring real company images, verified specifications, or business confirmation.

**FINAL INSTRUCTION: Build Paras Prints Solutions as a complete, premium, SEO-focused industrial packaging and commercial printing website from scratch. Deliver the entire public frontend and backend as one integrated project. Do not build an admin panel, but ensure the architecture is ready for a separately developed admin panel in the future. Do not stop at a prototype. The final result must be functional, responsive, maintainable, and deployment-ready.**
