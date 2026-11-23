import { content, metadata } from '@/lib/api';
import { PageHero, ContentBlocks, CTA, SectionHeading } from '@/components/UI';
import Gallery from '@/components/Gallery';
import Reveal from '@/components/Reveal';
export async function generateMetadata() {
  const p = await content('/pages/quality-assurance');
  return metadata('Quality Assurance', p.lead, '/quality-assurance');
}
export default async function Quality() {
  const [p, gallery, certs] = await Promise.all([
    content('/pages/quality-assurance'),
    content('/gallery?category=Company%20profile&limit=100'),
    content('/certifications'),
  ]);
  return (
    <>
      <PageHero {...p} crumbs={[{ label: 'Quality assurance' }]} />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            {p.highlights.map((h, i) => (
              <div className="col-md-6 col-lg-4" key={h.title}>
                <Reveal className="detail-panel h-100">
                  <p className="eyebrow">0{i + 1}</p>
                  <h2 className="card-title">{h.title}</h2>
                  <p>{h.text}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading eyebrow="THE SUPPLIED COMPANY PROFILE" title="Laboratory equipment." />
          <ContentBlocks blocks={p.blocks} />
          <Gallery items={gallery.filter((g) => g.image.src.includes('page-0012'))} />
          {certs.length > 0 && (
            <div className="row g-4">
              {certs.map((c) => (
                <div className="col-md-6" key={c.slug}>
                  <h3>{c.name}</h3>
                  <p>{c.certificateNumber}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <CTA
        title="Tell us what your specification needs to demonstrate."
        text="Discuss testing, samples and documentation with the team before approving production."
      />
    </>
  );
}
