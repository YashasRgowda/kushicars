import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The panel and the post-submission page have nothing to index, and
      // the latter carries a customer's reference number.
      disallow: ['/admin', '/admin/', '/sell/success'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
