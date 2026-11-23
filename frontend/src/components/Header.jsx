'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, ArrowUpRight, Search, ArrowRight } from 'lucide-react';
const resources = [
  { name: 'Blog', href: '/blog' },
  { name: 'Case studies', href: '/case-studies' },
  { name: 'Downloads', href: '/downloads' },
  { name: 'FAQ', href: '/faq' },
];
export default function Header(props) {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} {...props} />;
}
function Navigation({ company, products, categories, industries, pathname }) {
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState('');
  const header = useRef(null);
  const mobile = useRef(null);
  const search = useRef(null);
  const searchInput = useRef(null);
  const close = () => {
    setOpen(null);
    mobile.current?.close();
    search.current?.close();
  };
  useEffect(() => {
    const pointer = (e) => {
      if (!header.current?.contains(e.target)) setOpen(null);
    };
    const key = (e) => {
      if (e.key === 'Escape') {
        const dropdown = document.activeElement?.closest('.nav-dropdown');
        if (dropdown) header.current?.querySelector(`[aria-controls="${dropdown.id}"]`)?.focus();
        setOpen(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        search.current.showModal();
        searchInput.current?.focus();
      }
    };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', pointer);
      document.removeEventListener('keydown', key);
    };
  }, []);
  const active = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const link = (name, href) => (
    <Link
      key={href}
      href={href}
      className={`nav-link-custom ${active(href) ? 'active' : ''}`}
      aria-current={active(href) ? 'page' : undefined}
      onClick={close}
    >
      {name}
    </Link>
  );
  const sectionActive = {
    Products: active('/products'),
    Industries: active('/industries'),
    Resources: resources.some((resource) => active(resource.href)),
  };
  const menu = (name, children) => (
    <div
      className={`nav-disclosure ${open === name ? 'is-open' : ''}`}
      onMouseEnter={() => setOpen(name)}
      onMouseLeave={() => setOpen(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(null);
      }}
    >
      <button
        className={`nav-link-custom ${open === name || sectionActive[name] ? 'active' : ''}`}
        aria-expanded={open === name}
        aria-controls={`menu-${name}`}
        onClick={() => setOpen(open === name ? null : name)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(name);
            requestAnimationFrame(() => document.querySelector(`#menu-${name} a`)?.focus());
          }
        }}
      >
        {name}
        <ChevronDown size={12} />
      </button>
      <div id={`menu-${name}`} className="nav-dropdown" hidden={open !== name}>
        {children}
      </div>
    </div>
  );
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>PACKAGING & COMMERCIAL PRINT · GHAZIABAD</span>
          <a href={company.phoneHref}>{company.phone}</a>
        </div>
      </div>
      <header className="site-header" ref={header}>
        <div className="header-shell">
          <Link className="brand" href="/" aria-label="Paras Prints Solutions home">
            <Image
              src="/assets/logo.png"
              alt="Paras Prints Solutions"
              width={1808}
              height={710}
              loading="eager"
              sizes="145px"
            />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {link('Home', '/')}
            {link('About us', '/about')}
            {menu(
              'Products',
              <>
                <div className="mega-columns">
                  {categories.map((c) => (
                    <div key={c.slug}>
                      <Link
                        className="menu-heading"
                        href={`/products?category=${c.slug}`}
                        onClick={close}
                      >
                        {c.name}
                      </Link>
                      {products
                        .filter((p) => p.categorySlug === c.slug)
                        .map((p) => (
                          <Link
                            key={p.slug}
                            href={`/products/${p.slug}`}
                            aria-current={pathname === `/products/${p.slug}` ? 'page' : undefined}
                            onClick={close}
                          >
                            {p.name}
                            <ArrowUpRight size={14} />
                          </Link>
                        ))}
                    </div>
                  ))}
                </div>
                <div className="menu-bottom">
                  <span>A considered specification for every requirement.</span>
                  <Link href="/products" onClick={close}>
                    Explore all products <ArrowRight size={16} />
                  </Link>
                </div>
              </>,
            )}
            {menu(
              'Industries',
              <div className="dropdown-grid">
                {industries.map((i) => (
                  <Link key={i.slug} href={`/industries/${i.slug}`} onClick={close}>
                    {i.name}
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </div>,
            )}
            {link('Manufacturing', '/manufacturing-process')}
            {link('Infrastructure', '/infrastructure')}
            {link('Quality', '/quality-assurance')}
            {menu(
              'Resources',
              <div className="dropdown-grid">
                {resources.map((r) => (
                  <Link href={r.href} key={r.href} onClick={close}>
                    {r.name}
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </div>,
            )}
            {link('Contact', '/contact')}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search products"
              onClick={() => {
                search.current.showModal();
                searchInput.current?.focus();
              }}
            >
              <Search size={19} />
            </button>
            <Link href="/request-a-quote" className="button header-quote">
              Request a quote <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-button mobile-toggle"
              aria-label="Open navigation"
              onClick={() => mobile.current.showModal()}
            >
              <Menu size={23} />
            </button>
          </div>
        </div>
      </header>
      <dialog className="mobile-menu" ref={mobile} aria-label="Site navigation" closedby="any">
        <div className="mobile-menu__inner">
          <div className="dialog-top">
            <strong>Explore Paras Prints</strong>
            <button
              className="icon-button"
              aria-label="Close navigation"
              onClick={() => mobile.current.close()}
            >
              <X />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {link('Home', '/')}
            {link('About us', '/about')}
            <details>
              <summary>
                Products <ChevronDown size={16} />
              </summary>
              <Link href="/products" onClick={close}>
                All products
              </Link>
              {categories.map((c) => (
                <div className="mobile-group" key={c.slug}>
                  <p>{c.name}</p>
                  {products
                    .filter((p) => p.categorySlug === c.slug)
                    .map((p) => (
                      <Link key={p.slug} href={`/products/${p.slug}`} onClick={close}>
                        {p.name}
                      </Link>
                    ))}
                </div>
              ))}
            </details>
            <details>
              <summary>
                Industries <ChevronDown size={16} />
              </summary>
              <Link href="/industries" onClick={close}>
                All industries
              </Link>
              {industries.map((i) => (
                <Link key={i.slug} href={`/industries/${i.slug}`} onClick={close}>
                  {i.name}
                </Link>
              ))}
            </details>
            {link('Manufacturing', '/manufacturing-process')}
            {link('Infrastructure', '/infrastructure')}
            {link('Quality', '/quality-assurance')}
            <details>
              <summary>
                Resources <ChevronDown size={16} />
              </summary>
              {resources.map((r) => (
                <Link key={r.href} href={r.href} onClick={close}>
                  {r.name}
                </Link>
              ))}
            </details>
            {link('Clients', '/clients')}
            {link('Gallery', '/gallery')}
            {link('Contact', '/contact')}
          </nav>
          <Link className="button" href="/request-a-quote" onClick={close}>
            Request a quote <ArrowUpRight size={16} />
          </Link>
          <a className="text-link" href={company.phoneHref}>
            {company.phone}
          </a>
        </div>
      </dialog>
      <dialog className="search-dialog" ref={search} aria-label="Search products" closedby="any">
        <div className="dialog-top">
          <h2>Find your product</h2>
          <button
            className="icon-button"
            aria-label="Close search"
            onClick={() => search.current.close()}
          >
            <X />
          </button>
        </div>
        <label className="sr-only" htmlFor="product-search">
          Product name
        </label>
        <input
          ref={searchInput}
          id="product-search"
          className="form-control"
          placeholder="Try corrugated, catalogue or paper bag"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="search-results">
          {products
            .filter((p) => (p.name + ' ' + p.summary).toLowerCase().includes(query.toLowerCase()))
            .map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} onClick={close}>
                {p.name}
                <ArrowUpRight size={17} />
              </Link>
            ))}
          {!products.some((p) =>
            (p.name + ' ' + p.summary).toLowerCase().includes(query.toLowerCase()),
          ) && (
            <p>
              No matching product.{' '}
              <Link href="/contact" onClick={close}>
                Discuss a custom requirement.
              </Link>
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
