import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';
import { jsonLd, siteUrl } from '@/lib/api';
export function Button({ href, children, secondary = false, className = '', ...props }) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? 'button--outline' : ''} ${className}`}
      {...props}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  text,
  href,
  label = 'Explore more',
  light = false,
}) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      <div>
        {text && <p>{text}</p>}
        {href && (
          <Link className="text-link" href={href}>
            {label}
            <ArrowRight size={17} />
          </Link>
        )}
      </div>
    </div>
  );
}
export function PageHero({ eyebrow, title, lead, crumbs = [], children }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl() },
      ...crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.label,
        ...(c.href ? { item: siteUrl() + c.href } : {}),
      })),
    ],
  };
  return (
    <section className="page-hero">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.label}>
                <ChevronRight size={12} />
                {c.href ? (
                  <Link href={c.href}>{c.label}</Link>
                ) : (
                  <span aria-current={i === crumbs.length - 1 ? 'page' : undefined}>{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
export function ProductCard({ product, index = 0, headingLevel = 'h3' }) {
  const Heading = headingLevel;
  return (
    <Reveal delay={(index % 3) * 0.06} className="h-100">
      <article className="product-card h-100">
        <Link href={`/products/${product.slug}`} className="product-card__image">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            width={product.images[0].width}
            height={product.images[0].height}
            sizes="(max-width:767px) 100vw,(max-width:1199px) 50vw,33vw"
          />
          <span className="image-arrow">
            <ArrowUpRight size={21} />
          </span>
        </Link>
        <div className="product-card__body">
          <p className="eyebrow">{product.categoryName}</p>
          <Heading>
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </Heading>
          <p>{product.summary}</p>
          <Link className="text-link" href={`/products/${product.slug}`}>
            Explore product <ArrowRight size={16} />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
export function ProductGrid({ products, headingLevel = 'h3' }) {
  return (
    <div className="row g-4">
      {products.map((p, i) => (
        <div className="col-md-6 col-xl-4" key={p.slug}>
          <ProductCard product={p} index={i} headingLevel={headingLevel} />
        </div>
      ))}
    </div>
  );
}
export function FAQ({ items = [] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question}>
          <summary>
            {item.question}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
export function CTA({
  title = 'Let’s find the right packaging for your product.',
  text = 'Share your brief. We’ll help you take the next step.',
  company,
}) {
  return (
    <section className="section cta-section">
      <div className="container">
        <Reveal>
          <div className="cta-layout">
            <div>
              <p className="eyebrow">START A CONVERSATION</p>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
            <div className="cta-actions">
              <Button href="/request-a-quote">Request a quote</Button>
              <Button secondary href="/contact">
                Contact the team
              </Button>
              {company?.whatsapp && (
                <a className="text-link" href={company.whatsapp} target="_blank" rel="noreferrer">
                  Talk on WhatsApp <ArrowUpRight size={17} />
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export function ContentBlocks({ blocks = [] }) {
  return (
    <div className="prose">
      {blocks.map((b, i) =>
        b.type === 'heading' ? (
          <h2 id={`section-${i}`} key={i}>
            {b.text}
          </h2>
        ) : b.type === 'list' ? (
          <ul key={i}>
            {b.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        ) : b.type === 'link' &&
          typeof b.href === 'string' &&
          !b.href.includes('\\') &&
          (/^https?:\/\//.test(b.href) || /^\/(?!\/)/.test(b.href)) ? (
          <p key={i}>
            <a className="text-link" href={b.href}>
              {b.text}
              <ArrowUpRight size={16} />
            </a>
          </p>
        ) : b.type === 'image' && b.image ? (
          <Image
            key={i}
            src={b.image.src}
            alt={b.image.alt}
            width={b.image.width || 1200}
            height={b.image.height || 800}
            sizes="(max-width:900px) 100vw,800px"
          />
        ) : (
          <p key={i}>{b.text}</p>
        ),
      )}
    </div>
  );
}
export function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <p className="eyebrow">LET’S TALK ABOUT YOUR REQUIREMENT</p>
      <h2>{title}</h2>
      <p>{text}</p>
      <Button href="/contact">Contact the team</Button>
    </div>
  );
}
export function ArticleCard({ article, type = 'blog', headingLevel = 'h3' }) {
  const Heading = headingLevel;
  const date = new Date(article.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  return (
    <article className="article-card">
      {article.featuredImage && (
        <Link href={`/${type}/${article.slug}`}>
          <Image
            {...{
              src: article.featuredImage.src,
              alt: article.featuredImage.alt,
              width: article.featuredImage.width,
              height: article.featuredImage.height,
            }}
            sizes="(max-width:767px) 100vw,33vw"
          />
        </Link>
      )}
      <p className="article-meta">
        {article.category} · <time dateTime={article.publishedAt}>{date}</time>
      </p>
      <Heading>
        <Link href={`/${type}/${article.slug}`}>{article.title}</Link>
      </Heading>
      <p>{article.excerpt}</p>
      <Link className="text-link" href={`/${type}/${article.slug}`}>
        Read <span className="visually-hidden">{article.title}</span> article{' '}
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
