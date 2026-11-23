# Verification and remaining launch checks

Local verification completed on 18 November 2026.

## Passed

| Check               | Result                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Production build    | Next.js production compilation and route generation passed                                                           |
| Lint                | React hooks, JavaScript and JSX accessibility checks passed                                                          |
| Dependency audit    | Full dependency audit and production-only audit reported zero vulnerabilities                                        |
| Database/API tests  | Nine integration tests passed against an isolated, real MongoDB process                                              |
| Public route crawl  | 39 rendered pages returned successfully with headings and canonical metadata                                         |
| Internal navigation | 58 unique internal links, including category filters and product-preselected quote links, returned successfully      |
| Assets              | All 62 supplied images appeared in rendered markup and their original and optimized URLs returned successfully       |
| Downloads           | The company profile PDF returned successfully; all 13 pages were rendered and visually inspected                     |
| Missing content     | Unknown/draft product, industry, article and case-study paths returned actual HTTP 404 responses                     |
| Compatibility URLs  | Old quotation, manufacturing, quality and duplex-product routes redirected permanently                               |
| SEO utilities       | Robots and dynamic XML sitemap returned successfully                                                                 |
| Same-origin API     | Next.js API proxy and public calculator settings checked; internal rates were not exposed                            |
| Local startup       | The combined command starts a persistent local database/API and waits for health before starting the frontend        |
| Desktop Lighthouse  | All 38 indexable pages have a measured 100/100/100/100 result; conditions and re-runs are recorded in performance.md |
| Browser interaction | Autoplay, controls, reduced motion, menu bounds, search, gallery, mobile navigation and no-JS content passed         |

Six additional tests cover environment filtering, binding URL selection, readiness waiting and actionable errors when the API is unreachable (15 tests total). Both root and direct standalone frontend startup commands use this readiness gate. The database-backed sitemap is explicitly dynamic so production builds do not depend on a running API.

The backend test groups cover:

1. Public catalogue, pagination, search/category filters and draft exclusion.
2. Calculator option validation, invalid dimensions, internal-rate privacy and quotation mode.
3. Enquiry/calculator database persistence with missing SMTP configuration.
4. Idempotent quotation requests and denied unauthorised access to customer records.
5. Upload-session enforcement, true file signatures, size limits, session ownership and private retrieval.
6. Two-email SMTP delivery to an isolated local capture server and successful record retention when delivery fails.
7. Origin restrictions, injection rejection, safe response headers and submission rate limiting.
8. Exported Express service entrypoint, concurrent requests and original API-prefix routing.
9. Sanitized database initialization failure responses.

The deliberate email-failure case records a delivery-failure reference in test output. It is an expected assertion, not a failed test or a lost submission.

## Implemented layout and interaction changes

- Fixed the source counter restart problem by replacing animated numerical claims with stable, verified company highlights.
- Homepage slideshow advances every five seconds, has previous/next and slide selectors, and explicit pause/play. Reduced motion suppresses automatic movement unless the visitor explicitly starts it.
- Product dropdown is positioned against the full header container, constrained to its width and viewport height, and scrolls when necessary. Keyboard Escape returns focus to its disclosure button.
- Bootstrap breakpoints stack page, product, form, calculator and editorial layouts. Additional CSS covers 320/360/576/768/992/1200/1400-style layout ranges.
- Native dialogs provide focus containment/Escape handling; FAQ uses native disclosure elements. Content is visible when animation code is unavailable.
- Source documents, brand artwork and portrait images retain contained proportions rather than being cropped like product thumbnails.

## Verification limits

- The in-app browser remains unavailable. A separate, isolated headless Chrome session now verifies desktop/mobile screenshots, menu bounds, no mobile overflow, search, carousel controls/autoplay, reduced motion, gallery/lightbox, mobile navigation and server-rendered content without JavaScript. These checks submit no live customer forms. `npm run verify:browser` reproduces them; screenshots are saved under `output/lighthouse/screenshots/`.
- Desktop Lighthouse reports and measurement conditions are documented in [performance verification](performance.md). Automated accessibility checks and local Lighthouse scores do not establish full accessibility conformance or real-user Core Web Vitals on the deployed domain.
- Docker was unavailable in this environment. Container/Compose definitions were prepared but not built or run here.
- Production Atlas/MongoDB, SMTP, Cloudinary, a real domain and tracking credentials were not supplied. Local database and local SMTP tests do not verify external provider credentials or live email deliverability. Production uploads require configured Cloudinary; private development uploads were tested locally.
- No approved case-study content, testimonial permissions, certificate copies or pricing rate card was supplied. Those publication/data gaps remain explicit rather than being filled with fake claims.

Before public launch, re-run viewport/keyboard/reduced-motion checks on the deployed domain, validate external service credentials, confirm current business information and review legal/retention arrangements. Use the commands and environment instructions in the README and deployment guide.
