import Link from 'next/link';
import { api, content } from '@/lib/api';
import { PageHero, ProductGrid, CTA, EmptyState } from '@/components/UI';
export const metadata = {
  title: 'Products | Packaging & Commercial Print',
  description:
    'Explore corrugated boxes, duplex boxes, paper bags, brochures, catalogues, leaflets and business print products.',
  alternates: { canonical: '/products' },
};
export default async function Products({ searchParams }) {
  const q = await searchParams;
  const search = typeof q.search === 'string' ? q.search.slice(0, 120) : '';
  const category = typeof q.category === 'string' ? q.category.slice(0, 100) : '';
  const page = Math.max(1, Math.min(10000, Number(q.page) || 1));
  const params = new URLSearchParams({ search, category, page: String(page), limit: '12' });
  const [result, categories] = await Promise.all([
    api('/products?' + params),
    content('/categories'),
  ]);
  const link = (p) => '/products?' + new URLSearchParams({ search, category, page: String(p) });
  return (
    <>
      <PageHero
        eyebrow="THE PRODUCT PORTFOLIO"
        title="Protect. Present. Communicate."
        lead="Find the packaging and printed formats that suit your product and your business. Every enquiry starts with your requirements."
        crumbs={[{ label: 'Products' }]}
      />
      <section className="section">
        <div className="container">
          <form className="filter-bar" action="/products">
            <div>
              <label htmlFor="directory-search">Search products</label>
              <input
                id="directory-search"
                name="search"
                className="form-control"
                defaultValue={search}
                maxLength={120}
                placeholder="Product name"
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select name="category" id="category" className="form-select" defaultValue={category}>
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="button" type="submit">
              Find products
            </button>
            <Link href="/products" className="text-link">
              Clear filters
            </Link>
          </form>
          <p className="results-count">{result.meta.total} products</p>
          {result.data.length ? (
            <ProductGrid products={result.data} headingLevel="h2" />
          ) : (
            <EmptyState
              title="Let’s discuss a custom requirement."
              text="No products match this search. Clear the filters or contact us with your brief."
            />
          )}
          {result.meta.pages > 1 && (
            <nav className="pagination-nav" aria-label="Product pages">
              {page > 1 && <Link href={link(page - 1)}>Previous</Link>}
              <span>
                Page {page} of {result.meta.pages}
              </span>
              {page < result.meta.pages && <Link href={link(page + 1)}>Next</Link>}
            </nav>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
