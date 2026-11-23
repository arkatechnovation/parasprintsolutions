import Link from 'next/link';
import { api, content } from '@/lib/api';
import { PageHero } from '@/components/UI';
import Gallery from '@/components/Gallery';
export const metadata = {
  title: 'Gallery | Products, Company Profile & Industry Visuals',
  description:
    'Browse all supplied product visuals, company profile pages, brand artwork and industry references.',
  alternates: { canonical: '/gallery' },
};
export default async function GalleryPage({ searchParams }) {
  const q = await searchParams;
  const category = typeof q.category === 'string' ? q.category.slice(0, 100) : '';
  const [result, categories] = await Promise.all([
    api('/gallery?' + new URLSearchParams({ category, limit: '100' })),
    content('/gallery/categories'),
  ]);
  return (
    <>
      <PageHero
        eyebrow="THE VISUAL LIBRARY"
        title="Packaging, print and the company portfolio."
        lead="All supplied assets, organised by purpose. Illustrative visuals are labelled separately from the original company profile and brand artwork."
        crumbs={[{ label: 'Gallery' }]}
      />
      <section className="section">
        <div className="container">
          <nav className="filter-chips" aria-label="Gallery categories">
            <Link href="/gallery" aria-current={!category ? 'page' : undefined}>
              All images
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={'/gallery?category=' + encodeURIComponent(c)}
                aria-current={category === c ? 'page' : undefined}
              >
                {c}
              </Link>
            ))}
          </nav>
          <p className="results-count">{result.meta.total} images</p>
          <Gallery items={result.data} />
        </div>
      </section>
    </>
  );
}
