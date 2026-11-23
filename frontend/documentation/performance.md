# Desktop Lighthouse optimization

Measured on 18 November 2026 with Lighthouse 13.5.0, an isolated headless Chrome profile, the standard desktop preset (40 ms RTT, 10,240 Kbps throughput, CPU multiplier 1), and the local production build. No audit categories were disabled and no user-agent-specific website behavior was added.

## Report and measured homepage result

| Category       | Supplied desktop PDF | Optimized production homepage |
| -------------- | -------------------: | ----------------------------: |
| Performance    |                   44 |                           100 |
| Accessibility  |                   96 |                           100 |
| Best Practices |                  100 |                           100 |
| SEO            |                   85 |                           100 |

The supplied report used `localhost:3000` and reported unminified development assets, 2,110 ms of blocking time, contrast failures, three generic article links and a robots request timeout. A fresh production baseline measured 96/96/96/92 and also caught a missing favicon in a clean browser profile.

All 38 indexable public pages have a measured result of 100 in all four categories. Complete per-page scores, metrics, warnings and weighted audit failures are recorded in `output/lighthouse/desktop/summary.json`; each page also has a full standalone HTML report and raw JSON. These generated artifacts are ignored by Git.

The first full sweep produced 100 in every category on 33 pages. Five detail pages had performance outliers of 85–99, including image-generation delays and unattributed blocking tasks during the long shared-browser session. Each reached 100/100/100/100 when re-tested in a fresh isolated browser. The runner now starts a separate browser for each page, matching the single-page session in the supplied report; targeted re-runs update the affected records while preserving the rest of the coverage. These results do not imply that every repeat or cold-cache run will score 100.

The final homepage run measured FCP 0.35 seconds, LCP 0.78 seconds, Speed Index 0.45 seconds, total blocking time 20 ms and cumulative layout shift 0. The PDF reported FCP 0.7 seconds, LCP 2.9 seconds, Speed Index 4.8 seconds, blocking time 2,110 ms and layout shift 0.

## Changes

- Replaced Framer Motion with one native IntersectionObserver and Web Animations for below-fold reveals. Reveal wrappers are server components; the initial viewport never fades in or waits for animation hydration. Content remains visible without JavaScript. Reduced-motion changes cancel active animations.
- Replaced the carousel's animation-library preference hook with `useSyncExternalStore` and native media queries. Autoplay, pause, manual controls, keyboard controls and explicit play under reduced motion remain available.
- Marked the first hero image eager/high priority and kept it discoverable in server HTML. Other slide images load after the first image completes. Corrected responsive size hints and replaced deprecated image `priority` props on shared/detail components.
- Kept native Next.js image sizing/lazy loading and selected WebP delivery. The first uncached AVIF hero request took approximately 3.2 seconds in the initial audit; WebP reduces encoding work for uncached visitors. All 62 original assets remain present and in use.
- Deduplicated API reads within each server render using React `cache`, including layout/page and metadata/page duplicates. Responses remain uncached across requests, and Vercel binding URLs are still resolved only at request time.
- Passed only navigation/search fields to the client header instead of complete product, industry and company records.
- Darkened the shared brown accent and slider count to meet text contrast requirements on the existing soft backgrounds. The layout, fonts and image placements remain intact.
- Made article links descriptive to search engines and screen readers. Corrected product/blog listing card headings to H2 while keeping H3 beneath section headings elsewhere.
- Added an explicit logo favicon and a valid `/favicon.ico` fallback, eliminating the clean-browser 404. Verified valid `robots.txt`, canonicals and sitemap in production.

## Reproduce

Use Node 22.19+ (Node 24 recommended), install dependencies with `npm ci`, and have Chrome installed. Set `CHROME_PATH` when automatic browser discovery is unavailable.

Start the backend first, using `npm run dev -w backend` for the local persistent development database. Then:

```sh
npm run build
npm start -w frontend
```

In another terminal:

```sh
npm run audit:desktop
npm run audit:desktop -- --all
npm run audit:desktop -- /products /blog
npm run verify
npm run verify:browser
```

The audit tool defaults to `http://localhost:3000` and accepts `--url=https://your-domain.example` and `--output=output/lighthouse/another-run`. It warms the application process with an HTML request, then lets Lighthouse clear browser storage/cache normally. It does not prime browser caches, disable failures, remove functionality or weaken checks. A run returns a failing exit code when any audited category scores below 100.

The `--all` list covers all 38 current indexable public pages. `/thank-you` intentionally remains `noindex`; removing that policy to increase an SEO score would be incorrect. The HTTP crawler still verifies that utility page, resulting in 39 checked pages.

The browser check covers desktop/mobile screenshots, navigation/search, dropdown bounds, autoplay and pause, explicit/manual movement, reduced motion, all gallery entries/lightbox controls, no mobile horizontal overflow, and visible server-rendered content with JavaScript disabled. It does not submit live customer forms. Screenshots are under `output/lighthouse/screenshots/`.

## Measurement limits

Use the production server for auditing, rather than `npm run dev`. Development includes hot reload and debugging work and is not the production bundle. Results can vary with machine load, image cache state, browser version, server/database region and deployed integrations. Re-run the same checks on the actual Vercel domain after deployment, including uncached requests. Local Lighthouse scores are lab measurements, not a guarantee of deployed scores, search rankings, complete accessibility conformance or real-user Core Web Vitals.

References: [Lighthouse scoring and variability](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist), [Next.js images](https://nextjs.org/docs/app/api-reference/components/image).
