import Image from 'next/image';
import { content, metadata } from '@/lib/api';
import { PageHero, CTA, SectionHeading, Button } from '@/components/UI';
import CompanyTimeline from '@/components/CompanyTimeline';
import Reveal from '@/components/Reveal';
export async function generateMetadata() {
  const p = await content('/pages/about');
  return metadata('About Us | Packaging & Print Since 1996', p.lead, '/about');
}
export default async function About() {
  const [page, settings] = await Promise.all([
    content('/pages/about'),
    content('/settings/public'),
  ]);
  return (
    <>
      <PageHero {...page} crumbs={[{ label: 'About us' }]} />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-7">
              <Reveal>
                <div className="prose">
                  <p className="eyebrow">ABOUT US</p>
                  <h2>Experience in every box. Care in every detail.</h2>
                  <p>
                    Since 1996, Paras Prints Solutions has built extensive expertise in
                    manufacturing corrugated boxes, duplex boxes, gift boxes and monocartons.
                    Located at B-8, B.S. Road Industrial Area, Ghaziabad, Uttar Pradesh, we supply
                    corrugated boxes, monocartons, gift boxes and paper bags in bulk, with a focus
                    on quality products and service.
                  </p>
                  <p>
                    At our production house, products are manufactured in line with international
                    standards, with attention to quality at every stage. Our experts work to
                    understand the diverse requirements of our clients and provide a complete range
                    of solutions to meet them.
                  </p>
                  <p>
                    Our experienced team and machinery support the entire process, from design to
                    the finished product. With machinery for every stage of manufacturing in-house,
                    we bring packaging development and production together under one roof.
                  </p>
                  <p>
                    Our range covers packaging boxes and office stationery, bringing quality and
                    practical functionality to every order.
                  </p>
                </div>
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
                <p>
                  {h.title === 'Since 1996'
                    ? 'Three decades of experience in packaging and print.'
                    : h.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="OUR JOURNEY · 1996–2026"
            title="From screen printing to complete packaging solutions."
            text="Three decades of new capabilities, growing facilities and investment in print and packaging. Follow the milestones that shaped Paras Prints Solutions."
          />
          <CompanyTimeline />
        </div>
      </section>
      <CTA company={settings.company} />
    </>
  );
}
