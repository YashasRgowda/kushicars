import type { MetadataRoute } from 'next';
import { getCars } from '@/lib/cars';
import { siteUrl } from '@/lib/site';

/**
 * Every public page, plus one entry per car in stock.
 *
 * The car pages are the point: for a dealer whose customers search
 * "used Creta Bangalore", an indexed page per listing is the whole game.
 * They drop out automatically when a car is marked sold, because getCars()
 * only returns what is still for sale.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await getCars();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/cars`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/sell`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  return [
    ...staticRoutes,
    ...cars.map((car) => ({
      url: `${siteUrl}/cars/${car.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
