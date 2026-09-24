import { BUSINESS } from '@/lib/business';
import type { Car, Settings } from '@/lib/types';

/**
 * Structured data.
 *
 * For a dealership whose entire funnel is "used cars near me", the knowledge
 * panel is worth more than any amount of on-page copy. These blocks are what
 * put the rating, the hours and the individual cars into it.
 *
 * Everything asserted here must be true on the live Google profile — a
 * mismatch is worse than saying nothing.
 */

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // The payload is our own object, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd({
  settings,
  siteUrl,
}: {
  settings: Settings;
  siteUrl: string;
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'AutoDealer',
        '@id': `${siteUrl}/#dealer`,
        name: settings.businessName,
        description:
          'Hand-picked pre-owned cars in Nagarbhavi, Bengaluru. Every car inspected before it reaches the floor, RC transfer handled end to end, and finance arranged the same day.',
        url: siteUrl,
        telephone: settings.phone ?? undefined,
        email: settings.email ?? undefined,
        image: `${siteUrl}/hero-poster.jpg`,
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: BUSINESS.street,
          addressLocality: `${BUSINESS.locality}, ${BUSINESS.city}`,
          addressRegion: BUSINESS.state,
          postalCode: BUSINESS.postalCode,
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: BUSINESS.geo.lat,
          longitude: BUSINESS.geo.lng,
        },
        openingHoursSpecification: BUSINESS.openingHours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: BUSINESS.rating,
          reviewCount: BUSINESS.reviewCount,
          bestRating: 5,
        },
        areaServed: BUSINESS.servingAreas.map((a) => ({
          '@type': 'Place',
          name: `${a}, ${BUSINESS.city}`,
        })),
        sameAs: [BUSINESS.googleReviewsUrl],
      }}
    />
  );
}

export function CarJsonLd({
  car,
  settings,
  siteUrl,
}: {
  car: Car;
  settings: Settings;
  siteUrl: string;
}) {
  const url = `${siteUrl}/cars/${car.slug}`;
  const name = `${car.year} ${car.brand} ${car.model} ${car.variant}`.trim();

  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'Car',
        name,
        url,
        brand: { '@type': 'Brand', name: car.brand },
        model: car.model,
        vehicleConfiguration: car.variant || undefined,
        productionDate: String(car.year),
        vehicleModelDate: String(car.year),
        bodyType: car.body,
        fuelType: car.fuel,
        vehicleTransmission: car.transmission,
        numberOfPreviousOwners: car.owners,
        mileageFromOdometer: {
          '@type': 'QuantitativeValue',
          value: car.kmDriven,
          unitCode: 'KMT',
        },
        ...(car.mileage
          ? {
              fuelEfficiency: {
                '@type': 'QuantitativeValue',
                value: car.mileage,
                unitText: 'kmpl',
              },
            }
          : {}),
        image: car.photos.length ? car.photos : undefined,
        itemCondition: 'https://schema.org/UsedCondition',
        offers: {
          '@type': 'Offer',
          price: car.price,
          priceCurrency: 'INR',
          availability: car.sold
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/InStock',
          url,
          seller: { '@type': 'AutoDealer', name: settings.businessName },
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
  siteUrl,
}: {
  items: { name: string; path: string }[];
  siteUrl: string;
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: it.name,
          item: `${siteUrl}${it.path}`,
        })),
      }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }}
    />
  );
}
