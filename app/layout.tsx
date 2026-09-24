import type { Metadata, Viewport } from 'next';
import { siteUrl } from '@/lib/site';
import { BUSINESS } from '@/lib/business';
import './globals.css';

const title = 'Kushi Cars — Quality Pre-Owned Cars in Nagarbhavi, Bengaluru';
const description =
  'Hand-picked pre-owned cars in Nagarbhavi, Bengaluru. Every car inspected before it reaches the floor, RC transfer handled end to end, and finance arranged the same day. We buy cars too.';

export const metadata: Metadata = {
  // Absolute URLs for OG/Twitter images and canonicals. Vercel supplies
  // VERCEL_URL on every deployment; set NEXT_PUBLIC_SITE_URL once the custom
  // domain is live. See lib/site.ts.
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    // Interior pages set only their own title; this frames it.
    template: `%s — ${BUSINESS.name}`,
  },
  description,
  applicationName: BUSINESS.name,
  keywords: [
    'used cars Nagarbhavi',
    'second hand cars Bengaluru',
    'pre-owned cars Bangalore',
    'sell my car Bengaluru',
    'used car finance Bengaluru',
    'Kushi Cars',
  ],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'en_IN',
    siteName: BUSINESS.name,
    images: [{ url: '/hero-poster.jpg', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/hero-poster.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#08090c',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
