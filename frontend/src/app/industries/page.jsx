import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { content } from '@/lib/api';
import { PageHero, CTA, SectionHeading } from '@/components/UI';
import Reveal from '@/components/Reveal';
export const metadata = {
  title: 'Industries | Packaging for Your Application',
  description:
    'Explore packaging and print applications for electronics, automotive, pharmaceuticals, food, FMCG, engineering, e-commerce and home appliances.',
  alternates: { canonical: '/industries' },
};
export default async function Industries() {
  const [items, settings] = await Promise.all([
    content('/industries'),
    content('/settings/public'),
  ]);
  return (
    <>
      <PageHero
        eyebrow="INDUSTRIES & APPLICATIONS"
        title="Start with the product. Understand the journey."
        lead="Different products have different packing, presentation and information needs. Explore the questions that help shape a useful specification."
        crumbs={[{ label: 'Industries' }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            {items.map((item) => (
              <div className="col-md-6 col-lg-4" key={item.slug}>
                <Reveal>
                  <article className="article-card">
                    <Link href={`/industries/${item.slug}`}>
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        sizes="(max-width:767px) 100vw,33vw"
                      />
                    </Link>
                    <h2 className="card-title">
                      <Link href={`/industries/${item.slug}`}>{item.name}</Link>
                    </h2>
                    <p>{item.summary}</p>
                    <Link className="text-link" href={`/industries/${item.slug}`}>
                      Explore the application <ArrowUpRight size={17} />
                    </Link>
                  </article>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
      {settings.additionalSectors?.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <SectionHeading
              eyebrow="ALSO IN THE PUBLISHED PORTFOLIO"
              title="More industries. More requirements to discuss."
              text="The source also lists these sectors. Contact the team to review your application; individual pages are added only when sufficient distinct information is available."
            />
            <div className="tag-links">
              {settings.additionalSectors.map((name) => (
                <Link href="/contact" key={name}>
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CTA />
    </>
  );
}
