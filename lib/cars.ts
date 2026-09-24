import { createClient } from '@/lib/supabase/server';
import type { Brand, Car, Settings, Tag } from '@/lib/types';

/** Shape of a row in public.cars — snake_case, straight from Postgres. */
interface CarRow {
  id: string;
  slug: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  body: Car['body'];
  fuel: Car['fuel'];
  km_driven: number;
  owners: number;
  transmission: string;
  mileage: string | number | null;
  registration: string | null;
  tag: Tag | null;
  sold: boolean;
  photos: string[] | null;
  sort_order: number;
}

function toCar(r: CarRow): Car {
  const photos = r.photos ?? [];
  return {
    id: r.id,
    slug: r.slug,
    brand: r.brand,
    model: r.model,
    variant: r.variant,
    year: r.year,
    price: Number(r.price),
    body: r.body,
    fuel: r.fuel,
    kmDriven: r.km_driven,
    owners: r.owners,
    transmission: r.transmission,
    // numeric() comes back as a string from Postgres
    mileage: r.mileage === null ? null : Number(r.mileage),
    registration: r.registration,
    tag: r.tag ?? undefined,
    sold: r.sold,
    photos,
    image: photos[0],
  };
}

/** All cars still for sale, in the owner's chosen order. */
export async function getCars(): Promise<Car[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('sold', false)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[getCars]', error.message);
    return [];
  }
  return (data as CarRow[]).map(toCar);
}

/** Cars the dealer has already sold — social proof. */
export async function getSoldCars(): Promise<Car[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('sold', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[getSoldCars]', error.message);
    return [];
  }
  return (data as CarRow[]).map(toCar);
}

/** Every car, sold or not — the admin dashboard needs the full list. */
export async function getAllCars(): Promise<Car[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('sold', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[getAllCars]', error.message);
    return [];
  }
  return (data as CarRow[]).map(toCar);
}

/** One car by its uuid — used by the admin edit screen. */
export async function getCarById(id: string): Promise<Car | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return toCar(data as CarRow);
}

/** One car by its public slug — the /cars/[slug] page. */
export async function getCarBySlug(slug: string): Promise<Car | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return toCar(data as CarRow);
}

/**
 * Cars to show underneath a listing.
 *
 * Ranked by how a buyer actually substitutes: same body style first (someone
 * looking at an SUV will not settle for a hatchback), then a similar price,
 * then the same brand. Sold cars and the car itself never appear.
 */
export function pickSimilar(all: Car[], car: Car, limit = 3): Car[] {
  return all
    .filter((c) => c.id !== car.id && !c.sold)
    .map((c) => {
      let score = 0;
      if (c.body === car.body) score += 3;
      if (c.brand === car.brand) score += 1;
      // Within 25% of the price counts as the same shelf.
      const gap = Math.abs(c.price - car.price) / Math.max(car.price, 1);
      if (gap <= 0.25) score += 2;
      else if (gap <= 0.5) score += 1;
      if (c.fuel === car.fuel) score += 1;
      return { car: c, score, gap };
    })
    .sort((a, b) => b.score - a.score || a.gap - b.gap)
    .slice(0, limit)
    .map((x) => x.car);
}

/** Brands that actually have stock, in showroom order. */
export function brandsFrom(cars: Car[]): Brand[] {
  const seen = new Map<string, number>();
  for (const c of cars) seen.set(c.brand, (seen.get(c.brand) ?? 0) + 1);
  return [...seen.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => ({ name }));
}

export async function getSettings(): Promise<Settings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    console.error('[getSettings]', error?.message);
    return {
      businessName: 'Kushi Cars',
      phone: null,
      whatsapp: null,
      email: null,
      address: null,
      hours: null,
      mapUrl: null,
    };
  }

  return {
    businessName: data.business_name,
    phone: data.phone,
    whatsapp: data.whatsapp,
    email: data.email,
    address: data.address,
    hours: data.hours,
    mapUrl: data.map_url,
  };
}
