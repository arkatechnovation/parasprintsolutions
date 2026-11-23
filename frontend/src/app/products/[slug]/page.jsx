import Image from 'next/image';
import Link from 'next/link';
import { content, metadata, jsonLd, siteUrl } from '@/lib/api';
import { PageHero, Button, SectionHeading, ProductGrid, FAQ, CTA } from '@/components/UI';
import LeadForm from '@/components/LeadForm';
import Reveal from '@/components/Reveal';
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await content(`/products/${encodeURIComponent(slug)}`, { missingIs404: true });
  return metadata(p.seo.title, p.seo.description, `/products/${p.slug}`, p.images[0]);
}
export default async function Product({ params }) {
  const { slug } = await params;
  const p = await content(`/products/${encodeURIComponent(slug)}`, { missingIs404: true });
  const [products, industries] = await Promise.all([
    content('/products?limit=100'),
    content('/industries'),
  ]);
  const related = products.filter((item) => p.relatedSlugs.includes(item.slug));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.images.map((i) => siteUrl() + i.src),
    url: `${siteUrl()}/products/${p.slug}`,
    brand: { '@type': 'Brand', name: 'Paras Prints Solutions' },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <PageHero
        eyebrow={p.categoryName}
        title={p.name}
        lead={p.summary}
        crumbs={[{ label: 'Products', href: '/products' }, { label: p.name }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-6">
              <Reveal>
                <div className="product-detail-image">
                  <Image
                    src={p.images[0].src}
                    alt={p.images[0].alt}
                    width={p.images[0].width}
                    height={p.images[0].height}
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width:991px) 100vw,50vw"
                  />
                </div>
                <p className="image-note">
                  Representative product visual. Final construction and artwork are agreed for your
                  order.
                </p>
              </Reveal>
            </div>
            <div className="col-lg-6">
              <Reveal>
                <p className="eyebrow">A CLOSER LOOK</p>
                <h2>{p.name}, made around your brief.</h2>
                <p className="large-copy">{p.description}</p>
                <dl className="spec-list">
                  {p.specifications.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="form-note">{p.sourceNote}</p>
                <Button href={`/request-a-quote?product=${p.slug}`}>
                  Request a {p.name.toLowerCase()} quote
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="BUILD THE SPECIFICATION"
            title="Choose the details that matter."
            text="The options below come from the published portfolio. Ask the team to confirm combinations, availability and suitability."
          />
          <div className="row g-4">
            {[
              ['Materials', p.materials],
              ['Printing', p.printingOptions],
              ['Finishing', p.finishingOptions],
            ].map(([title, items]) => (
              <div className="col-md-4" key={title}>
                <Reveal className="detail-panel h-100">
                  <h3>{title}</h3>
                  {items.length ? (
                    <ul className="clean-list">
                      {items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      Discuss the available options with the team for your intended application.
                    </p>
                  )}
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <p className="eyebrow">APPLICATIONS</p>
              <h2>A useful format for the right job.</h2>
              <ul className="clean-list">
                {p.applications.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <div className="tag-links">
                {industries
                  .filter((i) => p.industrySlugs.includes(i.slug))
                  .map((i) => (
                    <Link key={i.slug} href={`/industries/${i.slug}`}>
                      {i.name}
                    </Link>
                  ))}
              </div>
            </div>
            <div className="col-lg-6">
              <FAQ items={p.faqs} />
            </div>
          </div>
        </div>
      </section>
      <section className="section section--soft" id="product-enquiry">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <p className="eyebrow">YOUR PRODUCT ENQUIRY</p>
              <h2>Let’s work through the details.</h2>
              <p>
                Send the specification, quantity and artwork for {p.name.toLowerCase()}. The team
                will review your requirements before confirming pricing and production.
              </p>
            </div>
            <div className="col-lg-8">
              <LeadForm type="quotation" products={products} preselected={p.slug} />
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="EXPLORE THE RANGE" title="Related products." />
            <ProductGrid products={related} />
          </div>
        </section>
      )}
      <CTA />
    </>
  );
}
