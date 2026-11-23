import { content } from '@/lib/api';
import { PageHero, FAQ } from '@/components/UI';
import LeadForm from '@/components/LeadForm';
export const metadata = {
  title: 'Request a Quote | Packaging & Print',
  description:
    'Send product specifications, quantity, dimensions and artwork for a reviewed packaging or commercial print quotation.',
  alternates: { canonical: '/request-a-quote' },
};
export default async function Quote({ searchParams }) {
  const q = await searchParams;
  const [products, settings] = await Promise.all([
    content('/products?limit=100'),
    content('/settings/public'),
  ]);
  const preselected = products.some((p) => p.slug === q.product) ? q.product : '';
  const initial = {
    quantity: typeof q.quantity === 'string' && /^\d{1,8}$/.test(q.quantity) ? q.quantity : '',
    dimensions: typeof q.dimensions === 'string' ? q.dimensions.slice(0, 300) : '',
  };
  return (
    <>
      <PageHero
        eyebrow="START WITH YOUR REQUIREMENT"
        title="Let’s put the right details on paper."
        lead="Share your product, quantity, dimensions and artwork. The team will review your brief and confirm the specification, pricing and production requirements."
        crumbs={[{ label: 'Request a quote' }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="quote-sidebar">
                <p className="eyebrow">A USEFUL QUOTATION BRIEF</p>
                <h2>Every detail helps.</h2>
                <ul className="clean-list">
                  <li>Product type and intended use</li>
                  <li>Dimensions, clearly labelled with units</li>
                  <li>Quantity and delivery destination</li>
                  <li>Material, print and finish preferences</li>
                  <li>Artwork or a reference, if available</li>
                </ul>
                <p>
                  Not sure about a specification? Describe the product and ask for a recommendation.
                </p>
                <a className="text-link" href={settings.company.phoneHref}>
                  {settings.company.phone}
                </a>
                <FAQ
                  items={settings.faqs.filter((f) => ['Orders', 'Artwork'].includes(f.category))}
                />
              </div>
            </div>
            <div className="col-lg-8">
              <LeadForm
                type="quotation"
                products={products}
                preselected={preselected}
                initial={initial}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
