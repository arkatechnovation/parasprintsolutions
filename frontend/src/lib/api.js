import { notFound } from 'next/navigation';
import { cache } from 'react';
import { createPublicContentReader } from './public-content.mjs';

const readPublicContent = createPublicContentReader();

// Memoize within a server render: public content is retrieved directly from hardcoded catalog data.
const requestApi = cache(async (path) => {
  return readPublicContent(path);
});
export async function api(path, { missingIs404 = false } = {}) {
  const response = await requestApi(path);
  if (response.status === 404 && missingIs404) notFound();
  if (!response.ok)
    throw new Error('Content is temporarily unavailable. Please try again shortly.');
  return response.json;
}
export async function content(path, options) {
  return (await api(path, options)).data;
}
export const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export function metadata(title, description, path, image) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      ...(image ? { images: [{ url: image.src, alt: image.alt }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image.src] } : {}),
    },
  };
}
export function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
