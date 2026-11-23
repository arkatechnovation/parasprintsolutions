import Image from 'next/image';
import { content, metadata } from '@/lib/api';
import { PageHero, SectionHeading, ProductGrid, FAQ, CTA, Button } from '@/components/UI';
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const i = await content('/industries/' + encodeURIComponent(slug), { missingIs404: true });
  return metadata(i.seo.title, i.seo.description, '/industries/' + i.slug, i.image);
}
export default async function Industry({ params }) {
  const { slug } = await params;
  const i = await content('/industries/' + encodeURIComponent(slug), { missingIs404: true });
  const all = await content('/products?limit=100');
  return (
    <>
      <PageHero
        eyebrow="INDUSTRY APPLICATIONS"
        title={i.name}
        lead={i.summary}
        crumbs={[{ label: 'Industries', href: '/industries' }, { label: i.name }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <Image
                className="rounded-media"
                src={i.image.src}
                alt={i.image.alt}
                width={i.image.width}
                height={i.image.height}
                sizes="(max-width:991px) 100vw,50vw"
                loading="eager"
                fetchPriority="high"
              />
              <p className="image-note">Illustrative industry visual.</p>
            </div>
            <div className="col-lg-6">
              <h2>Build the brief around the application.</h2>
              <p className="large-copy">{i.description}</p>
              <Button href="/request-a-quote">Discuss your requirement</Button>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <p className="eyebrow">REQUIREMENTS TO REVIEW</p>
              <h2>What should the pack do?</h2>
              <ul className="clean-list">
                {i.requirements.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6">
              <p className="eyebrow">QUALITY & CUSTOMISATION</p>
              <h2>Details to confirm.</h2>
              <ul className="clean-list">
                {i.considerations.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="RELEVANT FORMATS" title="Products to start the conversation." />
          <ProductGrid products={all.filter((p) => i.productSlugs.includes(p.slug))} />
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="YOUR QUESTIONS"
            title={`Planning ${i.name.toLowerCase()} packaging.`}
          />
          <FAQ items={i.faqs} />
        </div>
      </section>
      <CTA />
    </>
  );
}
