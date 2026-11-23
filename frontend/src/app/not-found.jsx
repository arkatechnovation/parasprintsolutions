import { PageHero, Button } from '@/components/UI';
export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404 · PAGE NOT FOUND"
        title="Let’s get you back to the right place."
        lead="The page you’re looking for isn’t available. Explore the product range or contact us with your requirement."
        crumbs={[{ label: 'Page not found' }]}
      />
      <section className="section">
        <div className="container button-row">
          <Button href="/">Back to home</Button>
          <Button href="/products" secondary>
            Explore products
          </Button>
        </div>
      </section>
    </>
  );
}
