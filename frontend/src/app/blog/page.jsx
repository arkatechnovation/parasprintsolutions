import ResourceListing from '@/components/ResourceListing';
export const metadata = {
  title: 'Packaging & Printing Journal',
  description:
    'Practical guides to preparing packaging quotations, planning brochures and catalogues, and briefing e-commerce packaging.',
  alternates: { canonical: '/blog' },
};
export default function Blog(props) {
  return <ResourceListing type="blog" {...props} />;
}
