import { content } from '@/lib/api';
import { PageHero } from '@/components/UI';
import CalculatorWizard from '@/components/CalculatorWizard';
export const metadata = {
  title: 'Packaging Calculator | Build a Quotation Brief',
  description:
    'Select a box style, enter dimensions, specify material, printing and finishing, and send your packaging requirements for a reviewed quotation.',
  alternates: { canonical: '/packaging-calculator' },
};
export default async function Calculator() {
  const [settings, products] = await Promise.all([
    content('/calculator/settings'),
    content('/products?limit=100'),
  ]);
  return (
    <>
      <PageHero
        eyebrow="THE PACKAGING BRIEF BUILDER"
        title="From a few details to a clearer quotation."
        lead="Build a specification for corrugated or duplex boxes. Approved pricing has not been supplied, so this tool prepares a quotation request instead of displaying an invented cost."
        crumbs={[{ label: 'Packaging calculator' }]}
      />
      <section className="section">
        <div className="container">
          <CalculatorWizard settings={settings} products={products} />
        </div>
      </section>
    </>
  );
}
