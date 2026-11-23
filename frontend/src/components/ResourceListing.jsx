import Link from 'next/link';
import { api, content } from '@/lib/api';
import { PageHero, ArticleCard, EmptyState, CTA } from './UI';
export default async function ResourceListing({ type, searchParams }) {
  const cases = type === 'case-studies';
  const endpoint = cases ? '/case-studies' : '/blogs';
  const q = await searchParams;
  const search = typeof q.search === 'string' ? q.search.slice(0, 120) : '';
  const category = typeof q.category === 'string' ? q.category.slice(0, 100) : '';
  const page = Math.max(1, Math.min(10000, Number(q.page) || 1));
  const [result, all] = await Promise.all([
    api(endpoint + '?' + new URLSearchParams({ search, category, page: String(page), limit: '9' })),
    content(endpoint + '?limit=100'),
  ]);
  const categories = [...new Set(all.map((a) => a.category).filter(Boolean))];
  const href = (p) => `/${type}?` + new URLSearchParams({ search, category, page: String(p) });
  return (
    <>
      <PageHero
        eyebrow={cases ? 'PROJECTS & APPLICATIONS' : 'THE PACKAGING JOURNAL'}
        title={
          cases
            ? 'Documented work. Practical insight.'
            : 'A useful starting point for your next brief.'
        }
        lead={
          cases
            ? 'Case studies are published when the project information and results are documented and approved.'
            : 'Original planning guides to help you describe packaging, artwork and commercial print requirements. These are editorial resources, not company performance claims.'
        }
        crumbs={[{ label: cases ? 'Case studies' : 'Blog' }]}
      />
      <section className="section">
        <div className="container">
          {all.length > 0 && (
            <form className="filter-bar" action={`/${type}`}>
              <div>
                <label htmlFor="resource-search">
                  Search {cases ? 'case studies' : 'articles'}
                </label>
                <input
                  id="resource-search"
                  className="form-control"
                  name="search"
                  defaultValue={search}
                  maxLength={120}
                />
              </div>
              <div>
                <label htmlFor="resource-category">Category</label>
                <select
                  id="resource-category"
                  className="form-select"
                  name="category"
                  defaultValue={category}
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button className="button">Search</button>
              <Link className="text-link" href={`/${type}`}>
                Clear
              </Link>
            </form>
          )}
          {result.data.length > 0 ? (
            <>
              <div className="row g-5">
                {result.data.map((article, i) => (
                  <div
                    key={article.slug}
                    className={
                      i === 0 && page === 1 && !search && !category
                        ? 'col-12 featured-article'
                        : 'col-md-6 col-lg-4'
                    }
                  >
                    <ArticleCard article={article} type={type} headingLevel="h2" />
                  </div>
                ))}
              </div>
              {result.meta.pages > 1 && (
                <nav className="pagination-nav" aria-label="Resource pages">
                  {page > 1 && <Link href={href(page - 1)}>Previous</Link>}
                  <span>
                    Page {page} of {result.meta.pages}
                  </span>
                  {page < result.meta.pages && <Link href={href(page + 1)}>Next</Link>}
                </nav>
              )}
            </>
          ) : (
            <EmptyState
              title={
                cases
                  ? 'Your project could be the next conversation.'
                  : 'No articles match your search.'
              }
              text={
                cases
                  ? 'No approved case studies have been supplied. Talk to us about your packaging or printing requirement; no client projects or outcomes are invented here.'
                  : 'Clear the search filters or contact us for help with your requirements.'
              }
            />
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
