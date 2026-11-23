import ResourceListing from '@/components/ResourceListing';
export const metadata = {
  title: 'Case Studies | Approved Packaging Projects',
  description:
    'Documented and approved packaging and print case studies. Contact Paras Prints Solutions to discuss your project.',
  alternates: { canonical: '/case-studies' },
};
export default function Cases(props) {
  return <ResourceListing type="case-studies" {...props} />;
}
