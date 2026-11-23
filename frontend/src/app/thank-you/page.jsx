import { PageHero, Button } from '@/components/UI';
export const metadata = {
  title: 'Request Received',
  robots: { index: false, follow: false },
  alternates: { canonical: '/thank-you' },
};
export default async function ThankYou({ searchParams }) {
  const { reference } = await searchParams;
  const valid = typeof reference === 'string' && /^[a-f\d]{24}$/i.test(reference);
  return (
    <>
      <PageHero
        eyebrow={valid ? 'THANK YOU' : 'LET’S START A CONVERSATION'}
        title={valid ? 'Your request has been received.' : 'Ready to discuss your requirements?'}
        lead={
          valid
            ? 'The team will review the details you submitted. Pricing, specification and delivery are confirmed in a written quotation.'
            : 'Use a contact, quotation or calculator form to send your requirement to the team.'
        }
        crumbs={[{ label: 'Thank you' }]}
      />
      <section className="section">
        <div className="container">
          {valid && (
            <p className="reference-number">
              Your reference: <strong>{reference}</strong>
            </p>
          )}
          <div className="button-row">
            <Button href="/products">Explore our products</Button>
            <Button href="/contact" secondary>
              Contact the team
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
