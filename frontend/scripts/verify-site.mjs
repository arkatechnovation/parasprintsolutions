import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.VERIFY_SITE_URL || 'http://localhost:3000';
const api = process.env.VERIFY_API_URL || 'http://localhost:4000/api/v1';
const catalogue = JSON.parse(await fs.readFile('src/data/catalog.json', 'utf8'));
const offline = process.env.VERIFY_OFFLINE === '1';
const pages = [
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
  '/thank-you',
  ...catalogue.products.map((p) => '/products/' + p.slug),
  ...catalogue.industries.map((i) => '/industries/' + i.slug),
  ...catalogue.blogs.map((a) => '/blog/' + a.slug),
  ...catalogue.caseStudies.map((a) => '/case-studies/' + a.slug),
];
const internalLinks = new Set(),
  images = new Set();
for (const page of pages) {
  const response = await fetch(base + page);
  assert.equal(response.status, 200, page);
  const html = await response.text();
  assert(html.includes('<h1'), `Missing H1: ${page}`);
  assert(!html.includes('We couldn’t load this content'), `Error boundary on ${page}`);
  assert(html.includes('rel="canonical"'), `Missing canonical: ${page}`);
  assert(
    html.includes('name="description"') || page === '/thank-you',
    `Missing description: ${page}`,
  );
  for (const [, value] of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = value.replaceAll('&amp;', '&');
    if (href.startsWith('/') && !href.startsWith('/_next/') && !href.includes('#'))
      internalLinks.add(href);
  }
  for (const [, value] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    const src = value.replaceAll('&amp;', '&');
    const url = new URL(src, base);
    images.add(decodeURIComponent(url.searchParams.get('url') || url.pathname));
    assert(html.includes('alt='), `Image alt missing: ${page}`);
  }
}
for (const href of internalLinks) {
  const response = await fetch(base + href);
  assert(response.ok, `Broken link ${href}: ${response.status}`);
}
for (const item of catalogue.gallery) {
  assert(images.has(item.image.src), `Asset not rendered: ${item.image.src}`);
  const response = await fetch(base + encodeURI(item.image.src));
  assert.equal(response.status, 200, item.image.src);
  const optimized = await fetch(
    base + '/_next/image?url=' + encodeURIComponent(item.image.src) + '&w=640&q=75',
  );
  assert.equal(optimized.status, 200, 'Optimized ' + item.image.src);
}
for (const route of [
  '/no-such-page',
  '/products/not-published',
  '/blog/not-published',
  '/case-studies/not-published',
  '/industries/not-published',
])
  assert.equal((await fetch(base + route)).status, 404, route);
for (const route of ['/quote', '/manufacturing', '/quality', '/products/duplex-boxes-monocartons'])
  assert.equal((await fetch(base + route, { redirect: 'manual' })).status, 308, route);
for (const route of ['/robots.txt', '/sitemap.xml', '/downloads/paras-prints-company-profile.pdf'])
  assert.equal((await fetch(base + route)).status, 200, route);
if (!offline) {
  const gallery = await (await fetch(api + '/gallery?limit=100')).json();
  assert.equal(gallery.meta.total, catalogue.gallery.length);
  const settings = await (await fetch(base + '/api/v1/calculator/settings')).json();
  assert.equal(settings.data.rates, undefined);
  // The verifier does not know the backend service's private environment.
  // Both a configured key (401) and disabled private integrations (503) must deny access.
  const privateStatus = (await fetch(base + '/api/v1/quotations')).status;
  assert([401, 503].includes(privateStatus), `Private quotations exposed: ${privateStatus}`);
}
console.log(
  `Verified ${pages.length} pages, ${internalLinks.size} internal links, ${catalogue.gallery.length} original and optimized gallery image URLs, downloads, metadata, redirects, missing-content routes${offline ? ' with the backend unavailable' : ', and the API proxy'}.`,
);
