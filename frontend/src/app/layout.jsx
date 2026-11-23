import { Manrope, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import RevealEffects from '@/components/RevealEffects';
import { content, siteUrl, jsonLd } from '@/lib/api';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import './globals.css';
const heading = Manrope({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
export const dynamic = 'force-dynamic';
export const metadata = {
  metadataBase: new URL(siteUrl()),
  icons: { icon: [{ url: '/assets/logo.png', type: 'image/png' }] },
  title: {
    default: 'Paras Prints Solutions | Packaging & Commercial Print',
    template: '%s | Paras Prints Solutions',
  },
  description:
    'Custom corrugated boxes, duplex cartons, paper bags and commercial printing from Paras Prints Solutions, Ghaziabad.',
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};
export default async function RootLayout({ children }) {
  const [settings, products, categories, industries] = await Promise.all([
    content('/settings/public'),
    content('/products?limit=100'),
    content('/categories'),
    content('/industries'),
  ]);
  const company = settings.company;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: siteUrl(),
    logo: siteUrl() + '/assets/logo.png',
    telephone: company.phone,
    email: company.email,
  };
  return (
    <html lang="en-IN" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header
          company={{ phone: company.phone, phoneHref: company.phoneHref }}
          products={products.map(({ slug, name, categorySlug, summary }) => ({
            slug,
            name,
            categorySlug,
            summary,
          }))}
          categories={categories.map(({ slug, name }) => ({ slug, name }))}
          industries={industries.map(({ slug, name }) => ({ slug, name }))}
        />
        <main id="main">{children}</main>
        <Footer company={company} products={products} industries={industries} />
        <Analytics />
        <RevealEffects />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      </body>
    </html>
  );
}
