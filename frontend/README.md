# Paras Prints Solutions

A complete public packaging and commercial printing website with a separate Express/MongoDB API. There is **no admin panel**. The schema, publication controls and private integration endpoints support a future management application.

The rebuild also addresses the reported layout issues: responsive grids throughout, a viewport-contained Products menu, a five-second homepage slideshow with pause/play controls, and static company highlights that do not continually animate.

## Project structure

```text
paras_solutions/
├── frontend/                 Next.js App Router, React, JavaScript
│   ├── public/assets/        All 62 supplied images
│   ├── public/downloads/     Company profile PDF
│   ├── src/app/              Public routes, metadata, errors, sitemap
│   ├── src/components/       Navigation, gallery, forms, calculator, UI
│   ├── src/lib/              Server and browser API clients
│   └── .env.example
├── backend/
│   ├── data/catalog.json     Reviewed, seedable content inventory
│   ├── data/original/        Preserved extraction from the earlier site
│   ├── src/config/           MongoDB connection and local development DB
│   ├── src/models/           18 Mongoose models
│   ├── src/controllers/      Enquiry and quotation workflows
│   ├── src/routes/           Versioned REST API
│   ├── src/services/         Calculation, email and private uploads
│   ├── src/middleware/       Security, rate limits and safe errors
│   ├── src/validators/       Strict Zod input validation
│   ├── src/templates/        Escaped HTML email templates
│   ├── tests/                Database/API/upload/SMTP integration tests
│   └── .env.example
├── assets/                   Supplied source images, preserved
├── scripts/                  PDF generation and site verification
├── documentation/            Content audit, API, models, deployment, QA
├── compose.yaml
└── package.json              npm workspace commands
```

The preceding implementation is retained in the ignored `.local-backup/` directory. Existing root environment files are not copied into the frontend or committed.

## Requirements

- Node.js 22.13+ (Node 24 recommended), npm with workspace support.
- Internet on the first local database launch to download the MongoDB 8.0.17 binary.
- For production: MongoDB/Atlas, an email provider for email delivery, and Cloudinary for private attachments.

## Shared environment configuration

The project root `.env` is the central configuration file for both services. It includes application URLs, MongoDB, upload/security keys, SMTP, Cloudinary, optional analytics and optional Docker MongoDB settings. Run `node scripts/init-env.mjs` to create it with local defaults and randomly generated keys if it is missing; existing values are never overwritten.

Leave `MONGODB_URI` empty to use the automatic persistent database with `npm run dev`. Enter a real connection URI to use an existing MongoDB or Atlas instance. SMTP and Cloudinary credentials are deliberately blank until configured. Private local uploads are enabled for development. For production, configure a real database, set `NODE_ENV=production`, disable local uploads, and supply the appropriate service credentials.

Shell environment variables take precedence. `backend/.env` and frontend `.env*` files can optionally override the shared defaults. Only frontend-related settings are imported into the website process; database, SMTP and private API secrets stay on the backend. The old root `.env.local` is not used by the rebuilt services. Restart `npm run dev` after changing configuration.

## Local development

From the repository root:

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. API health is **http://localhost:4000/api/v1/health**.

`npm run dev` starts the frontend and API. Without `MONGODB_URI`, development starts a real local MongoDB process with durable WiredTiger files under `backend/.data/mongodb/`. These files are ignored. It is not an in-memory submission mock. Restarting development preserves records. Tests use a different, isolated temporary database.

If downloading or starting a local MongoDB binary is restricted, configure an existing database in `backend/.env` instead.

The shared root `.env` is sufficient for local development. For optional service-specific overrides, copy and edit:

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

On PowerShell use `Copy-Item` instead of `cp` if preferred. Set `NODE_ENV=development` in the backend file for local work. To use automatic local MongoDB, omit `MONGODB_URI`. The example file includes a connection to a separately running local MongoDB; remove it if you want automatic development startup.

### Individual services

```sh
npm run dev -w backend
npm run dev -w frontend
```

Start the backend first when using separate terminals. Both frontend commands now wait for the API health check before opening port 3000. Starting Next.js directly bypasses this check; prefer `npm run dev` from the project root. The old root `.env.local` belongs to the preceding implementation; configure the rebuilt services using `frontend/.env.local` and `backend/.env` as shown above.

## Database and content

The development API seeds missing records on startup. Seeding uses `$setOnInsert`: it **does not overwrite existing database edits**. For a configured production database:

```sh
npm run seed
```

All product, category, industry, gallery, article, client, FAQ, page, site-setting and calculator-option content is served through the backend. Public views fetch the APIs server-side; forms and calculator actions use the same-origin `/api/v1` proxy. Draft content is excluded from public reads. See [database models](documentation/database-models.md).

There are nine migrated product offerings, including the six core product pages, eight industry detail pages, three newly written planning guides and all 62 supplied assets. No client projects, prices, reviews or certificates are invented. Case studies have a complete listing/detail system and an honest empty state until approved content is available.

## Calculator

The eight-step wizard collects product, configuration, dimensions, material, printing/finishing, quantity, a specification review and customer details. It stores the final request in MongoDB and sends notifications when SMTP is configured.

No approved rate card was supplied. The default backend result is a **quotation workflow**, with no fabricated amount, MOQ, test result or lead time. A guarded estimate engine supports a future business-approved rate card. Internal rates are excluded from public settings; see [calculator configuration](documentation/calculator.md).

## Email and attachments

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, optional `SMTP_USER`/`SMTP_PASS`, `SMTP_FROM` and `NOTIFICATION_EMAIL` in `backend/.env`. Notifications and customer acknowledgements are generated from escaped templates. Missing or failed email does not undo the stored submission; its delivery status is recorded.

Quotation attachments accept up to three JPG, PNG or PDF files, at most 10 MB each. MIME, extension and file signatures are checked. Upload sessions expire and are bound to the submitted attachments. Files are **private**. Production requires Cloudinary credentials and a random `UPLOAD_SESSION_SECRET` of at least 32 characters. Local private storage is development-only. No upload directory is publicly mounted.

Run the following against a configured database to remove expired, unclaimed uploads; schedule it daily in production:

```sh
npm run uploads:cleanup -w backend
```

## API

Base: `/api/v1`. Public responses use `{ ok, data, meta? }`; errors use `{ ok: false, error: { message, fields?, requestId } }`. Private submission lists and file retrieval require a strong server-side bearer key; they are never exposed to the browser. There are no public administrative writes.

See the complete [API reference](documentation/api.md).

## Build, test and verification

```sh
npm test                 # Real MongoDB, REST, uploads, privacy and local SMTP tests
npm run lint             # Frontend ESLint
npm run build            # Next.js production build
npm run verify           # Requires both local services; crawls pages/links/images
npm run verify:browser   # Chrome interaction and desktop/mobile screenshot checks
npm run audit:desktop    # Desktop Lighthouse on the production site at localhost:3000
```

`npm run verify` checks public pages, canonical metadata, internal links, all supplied and optimized images, API proxying, redirects, missing-content responses and the profile download. It is an HTTP check, not a replacement for a browser viewport/accessibility audit. Current verification and remaining limits are recorded in [QA](documentation/qa.md).

The profile PDF can be reproduced and rendered for inspection:

```sh
npm run assets:profile
npm run assets:review
```

## Production

For one Vercel project containing both services, use the root `vercel.json` and follow [Vercel services deployment](documentation/vercel-services.md). Vercel injects `BACKEND_URL` for frontend server requests; do not set it manually. The steps below apply to standalone Node/Docker hosting.

1. Configure the backend with `NODE_ENV=production`, a production `MONGODB_URI`, allowed `FRONTEND_ORIGINS`, SMTP/Cloudinary values and random private keys.
2. Configure frontend `API_INTERNAL_URL` and `NEXT_PUBLIC_SITE_URL` to the real backend and public origin. Set `API_INTERNAL_URL` **at build time as well as runtime**, because Next.js proxy destinations are compiled into routing configuration.
3. Install, seed and build:

   ```sh
   npm ci
   npm run seed
   npm run build
   ```

4. Run `npm start` with both services configured, or supervise them independently:

   ```sh
   npm start -w backend
   npm start -w frontend
   ```

5. Route public HTTPS traffic to the frontend. Keep the database and internal API network restricted. Configure proxy-hop trust for the exact deployment; do not blindly trust arbitrary forwarded headers.

Container configuration, Atlas setup, secrets, proxy/upload limits, backups and launch checks are in [deployment instructions](documentation/deployment.md).

## SEO, accessibility and tracking

The site includes server-rendered content, unique product/industry/article metadata, canonical URLs, Open Graph images, a dynamic sitemap, robots rules, breadcrumbs and accurate Organization/WebSite/Product/Article JSON-LD. No fake offers or ratings are added. Utility pages are noindexed. FAQ accordions use native `details`; no unsupported rich-result promise is made.

Bootstrap 5 grids, Manrope/Inter, plain CSS, Lucide icons and native below-fold reveals are used. Content remains visible without animations. Native dialogs provide modal focus containment. Reduced motion disables autoplay unless explicitly started and suppresses movement.

Audit production output with `npm run build`, then `npm start -w frontend` while the backend is running. Development mode includes debugging and hot-reload scripts and is not representative of production performance. `npm run audit:desktop -- --all` audits every indexable public page and saves full HTML/JSON reports under `output/lighthouse/`. Lighthouse tooling requires Node 22.19+ (Node 24 recommended) and an installed Chrome; use `CHROME_PATH` if automatic discovery fails. See [performance verification](documentation/performance.md).

Optional GA4 uses `NEXT_PUBLIC_GA_ID`; no analytics script loads until allowed through **Analytics preferences** in the footer. Conversion hooks cover quote/contact/calculator submissions and phone/email/WhatsApp links. Search Console verification is environment-configured. Review privacy and consent requirements for the actual launch jurisdiction and providers.

## Business confirmations and external configuration

- Confirm the address, dispatch phone, business hours, certificate evidence, technical limits, production capacity and any timing/MOQ commitments. The source publishes conflicts; unsupported badges and numerical claims are omitted.
- Supplied illustrative imagery is labelled and never presented as proof of the actual factory. Current factory photographs and approved project images can be added through future content management.
- Approve case studies and testimonials before publishing. Obtain any required customer permissions.
- Provide approved pricing if monetary estimates are desired.
- Configure and verify actual production MongoDB, SMTP, Cloudinary, domain and analytics credentials. Local SMTP tests do not establish delivery through an external provider.
- Review legal copy, retention and provider arrangements before public launch.

See [content inventory and confirmation log](documentation/content-inventory.md).

## Database outage fallback

Public pages use the last successful API response or a bundled public database
snapshot when the backend is unavailable. Content and images keep the same layout.
After database edits, run `npm run fallback:sync` from `frontend`, review the exported
snapshot, and deploy it with its assets. For the persisted local development database,
use `npm run fallback:sync -- --local`. No database records are changed by the export.

Run `npm run test:fallback` for automated fallback checks. Set `VERIFY_OFFLINE=1`
when running `npm run verify` against a frontend with the backend stopped.
See [fallback behavior and refresh instructions](documentation/content-fallback.md).
