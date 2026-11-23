import { Download, ArrowUpRight } from 'lucide-react';
import { content } from '@/lib/api';
import { PageHero, CTA } from '@/components/UI';
export const metadata = {
  title: 'Downloads | Company Profile',
  description:
    'Download the company profile compiled from the supplied Paras Prints Solutions profile pages.',
  alternates: { canonical: '/downloads' },
};
export default async function Downloads() {
  const settings = await content('/settings/public');
  return (
    <>
      <PageHero
        eyebrow="THE RESOURCE LIBRARY"
        title="A closer look, to take with you."
        lead="Available company documents. Historical details and claims in the supplied profile should be confirmed with the team before placing an order."
        crumbs={[{ label: 'Downloads' }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            {settings.downloads.map((d) => (
              <div className="col-lg-6" key={d.url}>
                <article className="download-card">
                  <Download size={30} />
                  <p className="eyebrow">{d.type}</p>
                  <h2>{d.title}</h2>
                  <p>{d.description}</p>
                  <a className="button" href={d.url} download={d.filename}>
                    Download company profile <ArrowUpRight size={16} />
                  </a>
                </article>
              </div>
            ))}
          </div>
          <p className="form-note">
            No verified certificate copies or additional technical documents were supplied. Request
            current documentation directly from the company.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
