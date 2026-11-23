import { content, metadata } from '@/lib/api';
import { PageHero, ContentBlocks, FAQ, CTA, SectionHeading } from '@/components/UI';
import Gallery from '@/components/Gallery';
import Reveal from '@/components/Reveal';
export async function generateMetadata() {
  const p = await content('/pages/infrastructure');
  return metadata('Infrastructure & Machinery', p.lead, '/infrastructure');
}
export default async function Infrastructure() {
  const [p, machines, gallery] = await Promise.all([
    content('/pages/infrastructure'),
    content('/machines'),
    content('/gallery?category=Company%20profile&limit=100'),
  ]);
  const documents = gallery.filter((g) => /page-000[89]|page-0010/.test(g.image.src));
  return (
    <>
      <PageHero {...p} crumbs={[{ label: 'Infrastructure' }]} />
      <section className="section">
        <div className="container">
          <ContentBlocks blocks={p.blocks} />
          <Gallery items={documents} />
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="THE PUBLISHED EQUIPMENT PORTFOLIO"
            title="Printing, conversion and finishing."
            text="Equipment descriptions reproduced from the existing source. Contact the company to confirm current availability and project suitability."
          />
          <div className="row g-4">
            {machines.map((m, i) => (
              <div className="col-md-6" key={m.slug}>
                <Reveal className="detail-panel h-100">
                  <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
                  <h3>{m.name}</h3>
                  <p>{m.description}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="BEFORE YOUR VISIT" title="A closer look at the setup." />
          <FAQ items={p.faqs} />
        </div>
      </section>
      <CTA />
    </>
  );
}
