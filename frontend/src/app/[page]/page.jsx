import { notFound } from 'next/navigation';
import { content, metadata } from '@/lib/api';
import { PageHero, FAQ, ContentBlocks, CTA } from '@/components/UI';
const allowed = ['faq', 'privacy-policy', 'terms-and-conditions'];
export async function generateMetadata({ params }) {
  const { page } = await params;
  if (!allowed.includes(page)) return { title: 'Page not found', robots: { index: false } };
  const p = await content('/pages/' + page, { missingIs404: true });
  return metadata(page === 'faq' ? 'Frequently Asked Questions' : p.title, p.lead, '/' + page);
}
export default async function TextPage({ params }) {
  const { page } = await params;
  if (!allowed.includes(page)) notFound();
  const p = await content('/pages/' + page, { missingIs404: true });
  const categories = [...new Set(p.faqs.map((f) => f.category))];
  return (
    <>
      <PageHero {...p} crumbs={[{ label: page === 'faq' ? 'FAQ' : p.title }]} />
      <section className="section">
        <div className="container narrow-content">
          <ContentBlocks blocks={p.blocks} />
          {page === 'faq' ? (
            categories.map((category) => (
              <section className="faq-category" key={category}>
                <h2>{category}</h2>
                <FAQ items={p.faqs.filter((f) => f.category === category)} />
              </section>
            ))
          ) : (
            <FAQ items={p.faqs} />
          )}
        </div>
      </section>
      {page === 'faq' && <CTA />}
    </>
  );
}
