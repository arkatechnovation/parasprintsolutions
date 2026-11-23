import ResourceDetail from '@/components/ResourceDetail';
import { content, metadata } from '@/lib/api';
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await content('/case-studies/' + encodeURIComponent(slug), { missingIs404: true });
  return metadata(a.seo.title, a.seo.description, '/case-studies/' + a.slug, a.featuredImage);
}
export default async function Case({ params }) {
  const { slug } = await params;
  return <ResourceDetail type="case-studies" slug={slug} />;
}
