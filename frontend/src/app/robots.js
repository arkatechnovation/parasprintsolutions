import { siteUrl } from '@/lib/api';
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/thank-you'] },
    sitemap: siteUrl() + '/sitemap.xml',
  };
}
