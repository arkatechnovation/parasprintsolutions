import ResourceDetail from '@/components/ResourceDetail';
import { content, metadata } from '@/lib/api';
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await content('/blogs/' + encodeURIComponent(slug), { missingIs404: true });
  return metadata(a.seo.title, a.seo.description, '/blog/' + a.slug, a.featuredImage);
}
export default async function Article({ params }) {
  const { slug } = await params;
  return <ResourceDetail type="blog" slug={slug} />;
}
