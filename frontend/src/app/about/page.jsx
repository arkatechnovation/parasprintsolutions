import Image from 'next/image';
import { content, metadata } from '@/lib/api';
import { PageHero, ContentBlocks, CTA, SectionHeading, Button } from '@/components/UI';
import Gallery from '@/components/Gallery';
import Reveal from '@/components/Reveal';
export async function generateMetadata() {
  const p = await content('/pages/about');
  return metadata('About Us | Packaging & Print Since 1996', p.lead, '/about');
}
export default async function About() {
  const [page, settings, gallery] = await Promise.all([
    content('/pages/about'),
    content('/settings/public'),
    content('/gallery?category=Company%20profile&limit=100'),
  ]);
  return (
    <>
      <PageHero {...page} crumbs={[{ label: 'About us' }]} />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <Reveal>
                <ContentBlocks blocks={page.blocks} />
              </Reveal>
            </div>
            <div className="col-lg-5">
              <Reveal>
                <Image
                  className="rounded-media"
                  src="/assets/paras-products-collage.jpg"
                  alt="Representative packaging and print range"
                  width={1200}
                  height={896}
                  sizes="(max-width:991px) 100vw,40vw"
                />
                <div className="editorial-note">
                  <p className="eyebrow">A HOUSE OF TOTAL PRINT & PACKAGING SOLUTIONS</p>
                  <p>
                    Corrugated boxes, duplex cartons, paper bags and commercial literature,
                    developed around your requirements.
                  </p>
                  <Button href="/products" secondary>
                    Explore the portfolio
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
          <div className="about-highlights">
            {page.highlights.map((h) => (
              <Reveal key={h.title}>
                <h2>{h.title}</h2>
                <p>{h.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="THE COMPANY PROFILE"
            title="The original document, page by page."
            text="Reproduced from the supplied profile. Historical claims and contact details in the document should be confirmed with the company."
          />
          <Gallery items={gallery} />
        </div>
      </section>
      <CTA company={settings.company} />
    </>
  );
}
