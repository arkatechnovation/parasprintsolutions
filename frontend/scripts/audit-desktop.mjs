import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const require = createRequire(import.meta.url);
const lighthouseRequire = createRequire(require.resolve('lighthouse'));
const { launch } = await import(pathToFileURL(lighthouseRequire.resolve('chrome-launcher')).href);
const args = process.argv.slice(2);
const option = (name, fallback) =>
  args
    .find((arg) => arg.startsWith(`--${name}=`))
    ?.split('=')
    .slice(1)
    .join('=') || fallback;
const base = new URL(option('url', 'http://localhost:3000'));
if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Use an HTTP(S) website URL.');
const output = path.resolve(option('output', '../output/lighthouse'));
const requestedPaths = args.filter((arg) => arg.startsWith('/'));
const catalogue = JSON.parse(
  await fs.readFile(new URL('../../backend/data/catalog.json', import.meta.url)),
);
const publicPages = [
  '/',
  '/about',
  '/products',
  '/industries',
  '/manufacturing-process',
  '/infrastructure',
  '/quality-assurance',
  '/clients',
  '/gallery',
  '/blog',
  '/case-studies',
  '/packaging-calculator',
  '/request-a-quote',
  '/contact',
  '/faq',
  '/downloads',
  '/privacy-policy',
  '/terms-and-conditions',
  ...catalogue.products.map((item) => `/products/${item.slug}`),
  ...catalogue.industries.map((item) => `/industries/${item.slug}`),
  ...catalogue.blogs.map((item) => `/blog/${item.slug}`),
];
// Thank-you pages intentionally remain noindex; don't change that to inflate SEO.
const paths = args.includes('--all') ? publicPages : requestedPaths.length ? requestedPaths : ['/'];
await fs.mkdir(output, { recursive: true });
let summary = [];
try {
  summary = JSON.parse(await fs.readFile(path.join(output, 'summary.json'), 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
for (const route of paths) {
  // Use a fresh isolated browser for each page so a long audit doesn't accumulate
  // other pages' back/forward cache, renderer heaps and garbage-collection work.
  const chrome = await launch({
    chromeFlags: ['--headless=new', '--no-first-run', '--disable-extensions'],
  });
  try {
    const url = new URL(route, base).href;
    // Warm the application process, not browser caches. Lighthouse clears browser storage.
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
    const markup = await response.text();
    if (!markup.includes('<h1') || markup.includes('We couldn’t load this content.')) {
      throw new Error(`${route}: expected the complete page, received a fallback.`);
    }
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: 'html',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
      desktopConfig,
    );
    const slug = route === '/' ? 'home' : route.slice(1).replace(/[^a-z0-9-]/gi, '-');
    await fs.writeFile(path.join(output, `${slug}.report.html`), result.report);
    await fs.writeFile(
      path.join(output, `${slug}.report.json`),
      JSON.stringify(result.lhr, null, 2),
    );
    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    );
    const metrics = Object.fromEntries(
      [
        'first-contentful-paint',
        'largest-contentful-paint',
        'total-blocking-time',
        'cumulative-layout-shift',
        'speed-index',
      ].map((key) => [key, result.lhr.audits[key].numericValue]),
    );
    const failedAudits = [
      ...new Set(
        Object.values(result.lhr.categories).flatMap((category) =>
          category.auditRefs
            .filter(
              (ref) =>
                ref.weight > 0 &&
                result.lhr.audits[ref.id].score !== null &&
                result.lhr.audits[ref.id].score < 1,
            )
            .map((ref) => ref.id),
        ),
      ),
    ];
    const measurement = {
      route,
      url,
      scores,
      metrics,
      failedAudits,
      warnings: result.lhr.runWarnings,
    };
    const previous = summary.findIndex((item) => item.route === route);
    if (previous === -1) summary.push(measurement);
    else summary[previous] = measurement;
    await fs.writeFile(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
    console.log(
      `${route}: ${Object.entries(scores)
        .map(([key, value]) => `${key} ${value}`)
        .join(' | ')}`,
    );
  } finally {
    await chrome.kill();
  }
}
console.log(`Saved complete HTML/JSON reports in ${output}`);
if (summary.some((item) => Object.values(item.scores).some((score) => score < 100)))
  process.exitCode = 1;
