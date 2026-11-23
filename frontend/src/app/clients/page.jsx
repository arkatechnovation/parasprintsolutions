import { content } from '@/lib/api';
import { PageHero, CTA } from '@/components/UI';
export const metadata = {
  title: 'Clients & Industry Relationships',
  description:
    'Explore client names and sectors published in the Paras Prints Solutions company portfolio.',
  alternates: { canonical: '/clients' },
};
export default async function Clients() {
  const clients = await content('/clients?limit=100');
  return (
    <>
      <PageHero
        eyebrow="THE CLIENT PORTFOLIO"
        title="A portfolio across business sectors."
        lead="Client names and sectors reproduced from the existing company website. No unpublished logos, relationship claims or numerical performance results have been added."
        crumbs={[{ label: 'Clients' }]}
      />
      <section className="section">
        <div className="container">
          <div className="client-grid">
            {clients.map((c) => (
              <div key={c.slug}>
                <strong>{c.name}</strong>
                <span>{c.sector}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
