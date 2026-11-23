import Image from 'next/image';
import { content, jsonLd, siteUrl } from '@/lib/api';
import { PageHero, ContentBlocks, CTA, ArticleCard, FAQ } from './UI';
import ShareButtons from './ShareButtons';
export default async function ResourceDetail({ type, slug }) {
  const cases = type === 'case-studies';
  const endpoint = cases ? '/case-studies' : '/blogs';
  const a = await content(endpoint + '/' + encodeURIComponent(slug), { missingIs404: true });
  const all = await content(endpoint + '?limit=4');
  const words = a.content.reduce((sum, b) => sum + (b.text || '').split(/\s+/).length, 0);
  const minutes = Math.max(1, Math.ceil(words / 200));
  const date = new Date(a.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    author: { '@type': 'Organization', name: 'Paras Prints Solutions' },
    publisher: { '@type': 'Organization', name: 'Paras Prints Solutions' },
    mainEntityOfPage: siteUrl() + `/${type}/${a.slug}`,
    ...(a.featuredImage ? { image: siteUrl() + a.featuredImage.src } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <PageHero
        eyebrow={a.category || 'CASE STUDY'}
        title={a.title}
        lead={a.excerpt}
        crumbs={[{ label: cases ? 'Case studies' : 'Blog', href: `/${type}` }, { label: a.title }]}
      />
      <article className="section">
        <div className="container">
          <div className="article-meta">
            <span>{a.author}</span>
            <time dateTime={a.publishedAt}>{date}</time>
            <span>{minutes} min read</span>
            {a.updatedAt && (
              <span>
                Updated{' '}
                {new Date(a.updatedAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </span>
            )}
          </div>
          {a.featuredImage && (
            <Image
              className="article-cover"
              src={a.featuredImage.src}
              alt={a.featuredImage.alt}
              width={a.featuredImage.width}
              height={a.featuredImage.height}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width:991px) 100vw,1100px"
            />
          )}
          <div className="article-layout">
            <aside>
              <h2>In this article</h2>
              <nav aria-label="Article contents">
                {a.content.map((b, i) =>
                  b.type === 'heading' ? (
                    <a key={i} href={`#section-${i}`}>
                      {b.text}
                    </a>
                  ) : null,
                )}
              </nav>
              <ShareButtons title={a.title} />
            </aside>
            <div>
              <ContentBlocks blocks={a.content} />
              {cases && (
                <div className="prose">
                  {a.clientPermission && a.clientName && <p>Client: {a.clientName}</p>}
                  {[
                    ['The challenge', a.challenge],
                    ['The solution', a.solution],
                    ['Documented results', a.results],
                  ]
                    .filter(([, text]) => text)
                    .map(([heading, text]) => (
                      <section key={heading}>
                        <h2>{heading}</h2>
                        <p>{text}</p>
                      </section>
                    ))}
                </div>
              )}
              <FAQ items={a.faqs} />
            </div>
          </div>
          {all.some((item) => item.slug !== a.slug) && (
            <section className="related-articles">
              <h2>Keep exploring.</h2>
              <div className="row g-4">
                {all
                  .filter((item) => item.slug !== a.slug)
                  .slice(0, 3)
                  .map((item) => (
                    <div className="col-md-6 col-lg-4" key={item.slug}>
                      <ArticleCard article={item} type={type} />
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </article>
      <CTA />
    </>
  );
}
