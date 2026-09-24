/**
 * Facts about the business that are not editable from the admin panel —
 * either because Google owns them (rating, review count, map coordinates) or
 * because they are structural (the legal name, the founding year).
 *
 * Anything the owner might want to change on a Tuesday afternoon lives in the
 * `settings` table instead. See lib/cars.ts -> getSettings().
 *
 * Source: the Kushi Cars Google Business Profile, Nagarbhavi, Bengaluru.
 */
export const BUSINESS = {
  name: 'Kushi Cars',
  legalName: 'Kushi Cars',
  tagline: 'Pre-owned cars, honestly sold.',

  /** Shown wherever we cite Google. Keep in step with the live profile. */
  rating: 4.8,
  reviewCount: 44,
  googleReviewsUrl: 'https://www.google.com/maps/place/Kushi+Cars',

  locality: 'Nagarbhavi',
  city: 'Bengaluru',
  state: 'Karnataka',
  postalCode: '560072',
  street: '19/1, Near BDA Complex, Marilingappa Extension, 2nd Stage',
  /** Google plus code XGG6+H8 — the lot, not the street centroid. */
  geo: { lat: 12.9764039, lng: 77.5081834 },

  /** Structured for schema.org. The human-readable string lives in settings. */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:30', closes: '20:00' },
  ],

  /** Used in "serving X since" copy and in the About page timeline. */
  servingAreas: [
    'Nagarbhavi',
    'Vijayanagar',
    'Rajajinagar',
    'Kengeri',
    'Magadi Road',
    'Mysore Road',
    'Jnanabharathi',
    'RR Nagar',
  ],
} as const;

/** "19/1, ... , Nagarbhavi, Bengaluru, Karnataka 560072" */
export const fullAddress = () =>
  `${BUSINESS.street}, ${BUSINESS.locality}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.postalCode}`;
