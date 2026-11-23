import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const catalog = require('../data/catalog.json');
const resources = {
  products: 'products',
  categories: 'categories',
  industries: 'industries',
  pages: 'pages',
  blogs: 'blogs',
  'case-studies': 'caseStudies',
  clients: 'clients',
  testimonials: 'testimonials',
  machines: 'machines',
  gallery: 'gallery',
  certifications: 'certifications',
};
const detailResources = new Set([
  'products',
  'categories',
  'industries',
  'pages',
  'blogs',
  'case-studies',
]);
const failure = (status) => ({ ok: false, status, data: null });

// Match backend public routes and listingSchema, including publication/permission rules.
export function getFallbackData(pathAndQuery, snapshot = catalog) {
  const [pathname, queryString] = pathAndQuery.split('?');
  const params = new URLSearchParams(queryString || '');
  const path = pathname.replace(/^\/api\/v1(?=\/|$)/, '').replace(/^\//, '');
  if (path === 'settings/public') return { ok: true, data: structuredClone(snapshot.settings) };
  if (path === 'calculator/settings') {
    const data = structuredClone(snapshot.calculator);
    if (data) delete data.rates;
    return { ok: true, data };
  }
  if (path === 'gallery/categories')
    return {
      ok: true,
      data: [
        ...new Set(
          (snapshot.gallery || [])
            .filter((item) => item.status === 'published')
            .map((item) => item.category)
            .filter(Boolean),
        ),
      ].sort(),
    };
  const [resource, encodedSlug, ...rest] = path.split('/');
  if (
    !resources[resource] ||
    rest.length ||
    (encodedSlug && !detailResources.has(resource)) ||
    (resource === 'pages' && !encodedSlug)
  )
    return failure(404);
  let records = (snapshot[resources[resource]] || []).filter(
    (item) =>
      item.status === 'published' &&
      (resource !== 'testimonials' || item.permissionConfirmed === true) &&
      (resource !== 'certifications' || item.verified === true),
  );
  if (encodedSlug) {
    let slug;
    try {
      slug = decodeURIComponent(encodedSlug);
    } catch {
      return failure(422);
    }
    if (!/^[a-z0-9-]{1,100}$/.test(slug)) return failure(422);
    const item = records.find((record) => record.slug === slug);
    return item ? { ok: true, data: structuredClone(item) } : failure(404);
  }
  const page = Number(params.get('page') ?? 1);
  const limit = Number(params.get('limit') ?? 24);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    page > 10000 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    [...params.keys()].some(
      (key) => !['page', 'limit', 'search', 'category', 'featured'].includes(key),
    ) ||
    (params.get('search') || '').length > 120 ||
    (params.get('category') || '').length > 100 ||
    (params.get('featured') || '').length > 10
  )
    return failure(422);
  const search = (params.get('search') || '').trim().toLowerCase();
  const category = (params.get('category') || '').trim();
  const searchField = ['products', 'industries', 'clients'].includes(resource) ? 'name' : 'title';
  records = records.filter(
    (item) =>
      (!search || (item[searchField] || '').toLowerCase().includes(search)) &&
      (!category || item[resource === 'products' ? 'categorySlug' : 'category'] === category) &&
      (resource !== 'products' ||
        params.get('featured')?.trim() !== 'true' ||
        item.primary === true),
  );
  records.sort((a, b) =>
    ['blogs', 'case-studies'].includes(resource)
      ? (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0)
      : (a.order ?? 0) - (b.order ?? 0) ||
        (Date.parse(a.createdAt) || 0) - (Date.parse(b.createdAt) || 0),
  );
  return {
    ok: true,
    data: structuredClone(records.slice((page - 1) * limit, page * limit)),
    meta: { total: records.length, page, limit, pages: Math.ceil(records.length / limit) },
  };
}
