import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
export default function Footer({ company, products, industries }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <Link href="/" className="footer-brand">
              <Image
                src="/assets/logo.png"
                alt="Paras Prints Solutions"
                width={1808}
                height={710}
                sizes="165px"
              />
            </Link>
            <p className="footer-intro">{company.intro}</p>
            <Link href="/request-a-quote" className="text-link">
              Let’s talk about your next project <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="col-6 col-lg-2">
            <h2>Explore</h2>
            <ul>
              {[
                ['About us', '/about'],
                ['Manufacturing', '/manufacturing-process'],
                ['Infrastructure', '/infrastructure'],
                ['Quality', '/quality-assurance'],
                ['Clients', '/clients'],
                ['Gallery', '/gallery'],
                ['Blog', '/blog'],
                ['Case studies', '/case-studies'],
                ['Downloads', '/downloads'],
                ['FAQ', '/faq'],
              ].map(([name, href]) => (
                <li key={href}>
                  <Link href={href}>{name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-lg-3">
            <h2>Products</h2>
            <ul>
              {products
                .filter((p) => p.primary)
                .map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  </li>
                ))}
            </ul>
            <h2 className="footer-subhead">Industries</h2>
            <ul>
              {industries.slice(0, 4).map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}`}>{i.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-3">
            <h2>Get in touch</h2>
            <address>
              <a href={company.phoneHref}>{company.phone}</a>
              <a href={company.emailHref}>{company.email}</a>
              <p>{company.address}</p>
            </address>
            <p className="footer-note">{company.addressNote}</p>
            <a href={company.whatsapp} target="_blank" rel="noreferrer" className="text-link">
              WhatsApp <ArrowUpRight size={16} />
            </a>
            {company.socialLinks?.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            ©{' '}
            {new Intl.DateTimeFormat('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' }).format(
              new Date(),
            )}{' '}
            Paras Prints Solutions
          </span>
          <div>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms-and-conditions">Terms & conditions</Link>
            <button type="button" className="analytics-preferences" data-analytics-preferences>
              Analytics preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
