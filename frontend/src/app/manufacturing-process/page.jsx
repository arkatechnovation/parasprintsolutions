import { content, metadata } from '@/lib/api';
import { PageHero, CTA, ContentBlocks } from '@/components/UI';
import Reveal from '@/components/Reveal';
export async function generateMetadata() {
  const p = await content('/pages/manufacturing-process');
  return metadata('Manufacturing Process', p.lead, '/manufacturing-process');
}
export default async function Manufacturing() {
  const page = await content('/pages/manufacturing-process');
  return (
    <>
      <PageHero {...page} crumbs={[{ label: 'Manufacturing process' }]} />
      <section className="section">
        <div className="container">
          <ContentBlocks blocks={page.blocks} />
          <div className="process-timeline">
            {page.steps.map((step, i) => (
              <Reveal key={step.title}>
                <article>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{step.title}</h2>
                    <p>{step.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="form-note">
            Equipment availability, sampling commitments and inspection requirements should be
            confirmed against the current production setup and your quotation.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
