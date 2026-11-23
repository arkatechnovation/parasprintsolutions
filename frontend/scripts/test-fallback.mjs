import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { getFallbackData } from '../src/lib/catalog-fallback.js';
import { createPublicContentReader } from '../src/lib/public-content.mjs';

const catalog = JSON.parse(await fs.readFile(new URL('../src/data/catalog.json', import.meta.url)));
const sample = structuredClone(catalog);
sample.products.push({ slug: 'unpublished', name: 'Private', status: 'draft', primary: true });
sample.testimonials = [
  { slug: 'hidden', status: 'published', permissionConfirmed: false },
  { slug: 'approved', status: 'published', permissionConfirmed: true },
];
sample.certifications = [
  { slug: 'unverified', status: 'published', verified: false },
  { slug: 'verified', status: 'published', verified: true },
];
assert.equal(getFallbackData('/products/unpublished', sample).status, 404);
assert.deepEqual(
  getFallbackData('/testimonials', sample).data.map((x) => x.slug),
  ['approved'],
);
assert.deepEqual(
  getFallbackData('/certifications', sample).data.map((x) => x.slug),
  ['verified'],
);
assert.equal(getFallbackData('/calculator/settings', sample).data.rates, undefined);
assert.equal(getFallbackData('/quotations', sample).status, 404);
assert.equal(getFallbackData('/products?limit=0', sample).status, 422);
assert.equal(getFallbackData('/products/%ZZ', sample).status, 422);
assert.equal(getFallbackData('/case-studies', { ...sample, caseStudies: [] }).meta.pages, 0);
assert.equal(
  getFallbackData('/gallery?featured=true').meta.total,
  getFallbackData('/gallery').meta.total,
);
const ordered = getFallbackData('/products?limit=100').data;
assert.deepEqual(getFallbackData('/products?page=2&limit=2').data, ordered.slice(2, 4));
const category = ordered[0].categorySlug;
assert(
  getFallbackData('/products?category=' + category).data.every((p) => p.categorySlug === category),
);
const articles = getFallbackData('/blogs').data;
assert.deepEqual(
  articles.map((a) => a.publishedAt),
  articles
    .map((a) => a.publishedAt)
    .sort()
    .reverse(),
);

let mode = 'offline';
const fresh = { ok: true, data: { title: 'An exact database response' } };
const reader = createPublicContentReader({
  fetcher: async () => {
    if (mode === 'offline') throw new TypeError('Network unavailable');
    if (mode === 'malformed') return new Response('<html>Proxy error</html>');
    if (mode === 'invalid') return Response.json({ ok: false });
    if (mode === 'live') return Response.json(fresh);
    if (mode === 'empty') return Response.json({ ok: true, data: [] });
    return new Response(null, { status: Number(mode) });
  },
});
for (const outage of ['offline', '500', '503', '408', '429', 'malformed', 'invalid']) {
  mode = outage;
  assert.deepEqual(
    (await reader('/pages/home', 'http://unused')).json.data,
    getFallbackData('/pages/home').data,
  );
}
mode = 'live';
assert.deepEqual((await reader('/pages/home', 'http://unused')).json, fresh);
mode = 'offline';
assert.deepEqual((await reader('/pages/home', 'http://unused')).json, fresh);
mode = '404';
assert.equal((await reader('/pages/home', 'http://unused')).status, 404);
mode = 'offline';
assert.equal((await reader('/pages/home', 'http://unused')).status, 404);
mode = 'live';
assert.deepEqual((await reader('/pages/home', 'http://unused')).json, fresh);
mode = 'empty';
assert.deepEqual((await reader('/products', 'http://unused')).json.data, []);
mode = 'offline';
assert.deepEqual((await reader('/products', 'http://unused')).json.data, []);
for (const status of ['401', '403', '422']) {
  mode = status;
  assert.equal((await reader('/products', 'http://unused')).status, Number(status));
}
let count = 0;
async function checkImages(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.src === 'string') {
    assert(value.src.startsWith('/assets/'), 'Fallback images must be bundled');
    await fs.access(
      new URL('../public' + encodeURI(decodeURIComponent(value.src)), import.meta.url),
    );
    assert(value.width > 0 && value.height > 0, 'Image dimensions preserve layout');
    count++;
  }
  for (const child of Object.values(value)) await checkImages(child);
}
await checkImages(catalog);
console.log(
  `Fallback verified: outages, recovery, live data, empty results, access errors, public filters, pagination, and ${count} image references.`,
);
