/**
 * The site's own absolute URL.
 *
 * Needed by canonical links, Open Graph images and every structured-data
 * block. Vercel supplies VERCEL_URL on each deployment; set
 * NEXT_PUBLIC_SITE_URL once the custom domain is live so preview builds stop
 * claiming to be the production site.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
