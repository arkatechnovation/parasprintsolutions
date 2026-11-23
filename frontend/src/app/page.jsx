import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Box, Layers, Printer } from 'lucide-react';
import { content, jsonLd, siteUrl } from '@/lib/api';
import { Button, SectionHeading, ProductGrid, FAQ, CTA, ArticleCard } from '@/components/UI';
import HeroSlider from '@/components/HeroSlider';
import Reveal from '@/components/Reveal';
export const metadata = {
  title: 'Custom Packaging & Commercial Print Since 1996',
  description:
    'Explore corrugated boxes, duplex cartons, paper bags, brochures, catalogues and leaflets from Paras Prints Solutions in Ghaziabad.',
  alternates: { canonical: '/' },
};
export default async function HomePage() {
  const [settings, home, products, industries, process, machines, clients, articles, testimonials] =
    await Promise.all([
      content('/settings/public'),
      content('/pages/home'),
      content('/products?featured=true'),
      content('/industries'),
      content('/pages/manufacturing-process'),
      content('/machines'),
      content('/clients?limit=8'),
      content('/blogs?limit=3'),
      content('/testimonials'),
    ]);
  const company = settings.company;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: company.name,
            url: siteUrl(),
          }),
        }}
      />
      <section className="home-hero">
        <div className="container hero-layout">
          <Reveal className="hero-copy">
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>
              {home.title.split('. ')[0]}
              {home.title.includes('. ') && (
                <>
                  .<br />
                  <span>{home.title.split('. ').slice(1).join('. ')}</span>
                </>
              )}
            </h1>
            <p className="hero-lead">{home.lead}</p>
            <div className="button-row">
              <Button href="/products">Explore our products</Button>
              <Button href="/request-a-quote" secondary>
                Request a quote
              </Button>
            </div>
            <p className="hero-caption">
              <span /> Built around your product. Since {company.established}.
            </p>
          </Reveal>
          <HeroSlider slides={settings.home.slides} />
        </div>
      </section>
      <section className="trust-section">
        <div className="container">
          <Reveal>
            <div className="trust-grid">
              {settings.home.highlights.map((s, i) => (
                <div key={s.title}>
                  <span className="section-number">0{i + 1}</span>
                  <div>
                    <h2>{s.title}</h2>
                    <p>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <Reveal>
                <div className="editorial-image">
                  <Image
                    src="/assets/paras-products-collage.jpg"
                    alt="Representative packaging and printed product range"
                    width={1200}
                    height={896}
                    sizes="(max-width:991px) 100vw,50vw"
                  />
                  <span>PACKAGING. PRINT. POSSIBILITIES.</span>
                </div>
              </Reveal>
            </div>
            <div className="col-lg-6">
              <Reveal>
                <p className="eyebrow">MEET PARAS PRINTS SOLUTIONS</p>
                <h2>Good packaging starts with understanding your product.</h2>
                <p className="large-copy">
                  From the carton that protects it to the print that introduces it, every detail has
                  a job to do.
                </p>
                <p>
                  Since 1996, Paras Prints Solutions has worked across corrugated packaging, printed
                  cartons, paper bags and commercial literature. Bring us your dimensions, artwork
                  and intended use. We’ll help you build a clear specification.
                </p>
                <Button href="/about" secondary>
                  Get to know us
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="OUR PRODUCT PORTFOLIO"
              title="The right format. For every part of your business."
              text="Protect, present and communicate. Explore our core packaging and commercial print range."
              href="/products"
              label="All products"
            />
          </Reveal>
          <ProductGrid products={products} />
        </div>
      </section>
      <section className="section section--dark">
        <div className="container">
          <Reveal>
            <SectionHeading
              light
              eyebrow="CAPABILITIES THAT CONNECT"
              title="Packaging and print. Considered together."
              text="Bring structural requirements and printed presentation into the same conversation."
              href="/infrastructure"
              label="Explore infrastructure"
            />
          </Reveal>
          <div className="capability-grid">
            {[
              {
                icon: Box,
                title: 'Corrugated packaging',
                text: 'Shipping cartons, mailers and industrial packaging, reviewed against the packed product.',
              },
              {
                icon: Layers,
                title: 'Printed paperboard',
                text: 'Monocartons and presentation formats with artwork and finishing considered together.',
              },
              {
                icon: Printer,
                title: 'Commercial printing',
                text: 'Brochures, catalogues and product information to support your business.',
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <article>
                  <Icon size={30} strokeWidth={1.3} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="A PRACTICAL PARTNERSHIP"
              title="A clear brief. A considered solution."
              text="A useful packaging conversation starts with the product, its journey and the information it needs to carry."
            />
          </Reveal>
          <div className="benefits-grid">
            {settings.home.benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.04}>
                <article>
                  <span>0{i + 1}</span>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="FROM BRIEF TO DELIVERY"
              title="A process built around the specification."
              text="Explore the production stages described in the published company portfolio. The precise sequence is confirmed for your order."
              href="/manufacturing-process"
              label="See the full process"
            />
          </Reveal>
          <div className="process-preview">
            {process.steps
              .filter((_, i) => [0, 1, 2, 6, 7].includes(i))
              .map((s, i) => (
                <Reveal key={s.title} delay={i * 0.04}>
                  <div>
                    <span className="step-number">0{i + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </Reveal>
              ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="INDUSTRIES WE SERVE"
              title="Different products. Different demands."
              text="A useful starting point for packaging and print requirements across industrial, retail and distribution applications."
              href="/industries"
              label="Explore industries"
            />
          </Reveal>
          <div className="industry-grid">
            {industries.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 4) * 0.04}>
                <Link href={`/industries/${item.slug}`} className="industry-card">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    sizes="(max-width:575px) 100vw,(max-width:991px) 50vw,25vw"
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <ArrowUpRight size={20} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <Reveal>
                <p className="eyebrow">INFRASTRUCTURE & MACHINERY</p>
                <h2>Explore the setup behind the portfolio.</h2>
                <p>
                  The supplied company profile documents printing, conversion and laboratory
                  equipment. View the machinery pages and discuss the current production setup with
                  the team.
                </p>
                <ul className="clean-list">
                  {machines.slice(0, 3).map((m) => (
                    <li key={m.slug}>{m.name}</li>
                  ))}
                </ul>
                <Button href="/infrastructure" secondary>
                  View infrastructure
                </Button>
              </Reveal>
            </div>
            <div className="col-lg-7">
              <Reveal>
                <Link href="/infrastructure" className="document-preview">
                  <Image
                    src="/assets/Company%20Profile%20Paras_page-0008.jpg"
                    alt="Machinery setup page reproduced from the supplied company profile"
                    width={1241}
                    height={1754}
                    sizes="(max-width:991px) 100vw,50vw"
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="THE PUBLISHED CLIENT PORTFOLIO"
              title="Working across business sectors."
              text="Names reproduced from the existing company portfolio. Explore the full list and the sectors represented."
              href="/clients"
              label="View client portfolio"
            />
          </Reveal>
          <Reveal>
            <div className="client-grid">
              {clients.map((c) => (
                <div key={c.slug}>
                  <strong>{c.name}</strong>
                  <span>{c.sector}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section calculator-preview">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <Reveal>
                <p className="eyebrow">THE PACKAGING BRIEF BUILDER</p>
                <h2>Turn your requirements into a clear starting point.</h2>
                <p>
                  Choose a box style, add dimensions, select material and finish preferences, then
                  send your specifications for a reviewed quotation.
                </p>
                <p className="form-note">
                  No approved pricing data has been supplied. The calculator will prepare a
                  quotation brief rather than invent a price.
                </p>
                <Button href="/packaging-calculator">Build your packaging brief</Button>
              </Reveal>
            </div>
            <div className="col-lg-6">
              <Reveal>
                <div className="calculator-preview__sheet">
                  <div className="sheet-top">
                    <Box size={24} />
                    <span>YOUR NEXT PACKAGING PROJECT</span>
                  </div>
                  {[
                    ['01', 'Product & configuration'],
                    ['02', 'Dimensions & material'],
                    ['03', 'Printing, finish & quantity'],
                    ['04', 'Review & send to the team'],
                  ].map(([n, t]) => (
                    <div className="sheet-line" key={n}>
                      <span>{n}</span>
                      <strong>{t}</strong>
                      <ArrowRight size={17} />
                    </div>
                  ))}
                  <p>Less guesswork. A more useful brief.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="QUALITY IN THE DETAILS"
              title="Confirm the details that matter."
              text="A clear specification helps establish what needs to be checked, approved and delivered."
              href="/quality-assurance"
              label="Our quality approach"
            />
          </Reveal>
          <div className="quality-row">
            {[
              'Material selection',
              'Artwork approval',
              'Dimensional checks',
              'Finishing review',
              'Dispatch requirements',
            ].map((text, i) => (
              <Reveal key={text} delay={i * 0.04}>
                <div>
                  <span>0{i + 1}</span>
                  <h3>{text}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {testimonials.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <SectionHeading eyebrow="CUSTOMER PERSPECTIVES" title="In our customers’ words." />
            <div className="row g-4">
              {testimonials.map((t) => (
                <div className="col-md-6" key={t.slug}>
                  <blockquote className="testimonial">
                    <p>{t.quote}</p>
                    <cite>
                      {t.name} · {t.role}
                    </cite>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section section--soft">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="A LITTLE CLARITY"
              title="Questions before the first conversation?"
              text="These answers help you prepare a brief. Order-specific options, quantities and schedules are confirmed directly by the company."
              href="/faq"
              label="All questions"
            />
          </Reveal>
          <Reveal>
            <FAQ items={settings.faqs.slice(0, 6)} />
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="NOTES & RESOURCES"
              title="Prepare a better packaging brief."
              href="/blog"
              label="Explore the journal"
            />
          </Reveal>
          <div className="row g-4">
            {articles.map((a) => (
              <div className="col-md-6 col-lg-4" key={a.slug}>
                <Reveal>
                  <ArticleCard article={a} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA company={company} />
    </>
  );
}
