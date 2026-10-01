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
  // The car is a 3.7:1 profile, so it fights a square: span the tile and it
  // is only about a quarter as tall as it is wide. Every size is therefore
  // the same render — the real artwork, gold trim and all, at 96% of the
  // tile — rather than a simplified mark below some threshold. An earlier
  // set flattened the small sizes to a cream silhouette on the theory that
  // the trim could not survive the downsample; what actually survived was
  // an unreadable blob, while the gold is the one thing that still reads at
  // 32px, because it is what separates the car from the ground it sits on.
  //
  // 32 is the size that matters most: a retina tab slot is 16 CSS pixels
  // and two device pixels to each of them.
  //
  // app/favicon.ico used to sit alongside this — the Next.js starter
  // triangle, committed on day one. The app-router icon convention OUTRANKS
  // public/, so it was quietly winning over everything declared here. It is
  // deleted; public/favicon.ico is now the only .ico and is listed below.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
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
  // Matches the page ground, so a phone's address bar and the iOS status
  // area blend into the top of the site instead of capping it with a bar.
  themeColor: '#f8f5ec',
  colorScheme: 'light',
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
