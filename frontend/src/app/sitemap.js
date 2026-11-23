import { content, siteUrl } from '@/lib/api';
export const dynamic = 'force-dynamic';
export default async function sitemap() {
  const [products, industries, blogs, cases] = await Promise.all([
    content('/products?limit=100'),
    content('/industries?limit=100'),
    content('/blogs?limit=100'),
    content('/case-studies?limit=100'),
  ]);
  const paths = [
    '',
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
  ];
  return [
    ...paths.map((path) => ({
      url: siteUrl() + path,
      changeFrequency: 'monthly',
      priority: path === '' ? 1 : 0.7,
    })),
    ...[
      [products, 'products'],
      [industries, 'industries'],
      [blogs, 'blog'],
      [cases, 'case-studies'],
    ].flatMap(([items, base]) =>
      items.map((item) => ({
        url: `${siteUrl()}/${base}/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      })),
    ),
  ];
}
