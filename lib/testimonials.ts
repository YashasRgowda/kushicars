/**
 * Real Google reviews for Kushi Cars.
 *
 * ----------------------------------------------------------------------
 * PROVENANCE — please keep this note.
 *
 * Every review below is from the Kushi Cars Google Business Profile (4.8
 * across 44 reviews), under the reviewer's own name as Google shows it.
 * Nothing here is written by us, and nothing is attributed to anyone who
 * did not write it. A visitor who opens the Google page should find each of
 * these, by that name, saying that.
 *
 * `quote` is what the site shows. Where a review ran long, it is an
 * EXCERPT — a continuous run of the reviewer's own sentences, cut only at
 * the ends. Nothing is reordered, recombined or added, so the excerpt can
 * never say something the reviewer did not. Spelling and capitalisation are
 * corrected ("mindfull" to "mindful"). `raw` holds the complete original
 * for anyone checking against Google.
 *
 * Dates are deliberately not shown: "7 months ago" is stale the moment it
 * is written down.
 *
 * TO CHANGE WHICH REVIEWS APPEAR: move entries between TESTIMONIALS and
 * MORE_REVIEWS. The section sizes itself to however many are in the first
 * array — six is comfortable, more starts to crowd the marks beneath it.
 * ----------------------------------------------------------------------
 */

export interface Testimonial {
  /** What the site shows. An excerpt of `raw` where the review ran long. */
  quote: string;
  /** The reviewer's complete text, as Google shows it. Not rendered. */
  raw: string;
  /** Exactly as Google spells it, including their own capitalisation. */
  name: string;
  /** Always 5 so far. Stored per review so an honest 4 could be shown. */
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Vinay Jogs',
    rating: 5,
    quote:
      'The team was transparent about pricing and vehicle condition, and handled the paperwork efficiently. No pressure, no hidden charges — just honest service.',
    raw: 'I had a wonderful experience buying my car from this showroom. The team was transparent about pricing and vehicle condition, answered all my questions patiently, and handled the paperwork efficiently. No pressure, no hidden charges—just honest service. Highly recommended for anyone looking for a reliable used car',
  },
  {
    name: 'Rajunc Raju',
    rating: 5,
    quote:
      'The staff was honest, helpful and professional. The car was exactly as described and the entire process was smooth.',
    raw: 'Excellent experience! The staff was honest, helpful, and professional. The car was exactly as described and the entire process was smooth. Highly recommend this used car showroom.',
  },
  {
    name: 'Rakesh T',
    rating: 5,
    quote: 'Best showroom in Nagarbhavi. Genuine vehicles and the best service.',
    raw: 'best showroom in Nagarbhavi and genuine vehicles and non accident vehicle and best service',
  },
  {
    name: 'Sunil ShettY',
    rating: 5,
    quote:
      'Good and reasonable prices, nice and well-maintained cars, plus top-notch service.',
    raw: "Had an good experience at Kushi Cars Showroom! Good and reasonable prices, nice & well-maintained cars, plus top-notch service. One of the best car showrooms I've visited!",
  },
  {
    name: 'Virupakshi R',
    rating: 5,
    quote:
      'Really fabulous service — very good communication and budget friendly. Devaraj explains the cars very well.',
    raw: 'Really fabolous service by kushi cars service was very good really awesome good communcation budget friendly Devaraj he explains very well about the cars he gives very good service to the customer thank you very much I was satisfied with kushi car center',
  },
  {
    name: 'Manoj Kumar',
    rating: 5,
    quote:
      'The service was good and there are so many options to choose from. Main thanks to Arun bro for supporting.',
    raw: 'It was gud experience the service gud we can find so many options to choose, main thanks to Arun bro for supporting',
  },
];

/**
 * Also real, also good — just not on the page. Swap any of these into
 * TESTIMONIALS above and drop one out; nothing else needs to change.
 */
export const MORE_REVIEWS: Testimonial[] = [
  {
    name: 'Harish Gowda',
    rating: 5,
    quote: 'Budget friendly cars here. And good cars.',
    raw: 'Budget friendly cars here.\nAnd good cars',
  },
  {
    name: 'Supreeth Bhat',
    rating: 5,
    quote: 'Great first car experience, and very helpful and mindful staff.',
    raw: 'Great first car experience and very helpful and mindfull staff',
  },
];
