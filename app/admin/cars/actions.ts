'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';
import { MAX_PHOTOS } from '@/lib/photos';

export interface CarFormState {
  error?: string;
}

/** "Maruti Suzuki", "Swift", "ZXi+", 2022 -> "maruti-suzuki-swift-zxi-2022" */
function slugify(...parts: (string | number | null | undefined)[]) {
  return parts
    .filter((p) => p !== null && p !== undefined && p !== '')
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function readForm(formData: FormData) {
  const num = (k: string) => {
    const v = String(formData.get(k) ?? '').trim();
    return v === '' ? null : Number(v);
  };
  const str = (k: string) => String(formData.get(k) ?? '').trim();

  return {
    brand: str('brand'),
    model: str('model'),
    variant: str('variant'),
    year: num('year'),
    price: num('price'),
    body: str('body'),
    fuel: str('fuel'),
    km_driven: num('km_driven'),
    owners: num('owners') ?? 1,
    transmission: str('transmission'),
    mileage: num('mileage'),
    registration: str('registration') || null,
    tag: str('tag') || null,
    sold: formData.get('sold') === 'on',
    photos: JSON.parse(String(formData.get('photos') || '[]')) as string[],
    sort_order: num('sort_order') ?? 0,
  };
}

function validate(v: ReturnType<typeof readForm>): string | null {
  if (!v.brand) return 'Brand is required.';
  if (!v.model) return 'Model is required.';
  if (!v.transmission) return 'Transmission is required.';
  if (v.year === null) return 'Year is required.';
  if (v.year < 1990 || v.year > 2100) return 'Enter a realistic year.';
  if (v.price === null || v.price < 0) return 'Enter a valid price in rupees.';
  if (v.km_driven === null || v.km_driven < 0) return 'Enter the km driven.';
  if (v.owners < 1 || v.owners > 10) return 'Owners must be between 1 and 10.';
  // The uploader already stops at the limit; this is the check that cannot
  // be bypassed by editing the hidden input.
  if (v.photos.length > MAX_PHOTOS)
    return `A car can have at most ${MAX_PHOTOS} photos. Remove ${v.photos.length - MAX_PHOTOS} and save again.`;
  return null;
}

export async function createCar(
  _prev: CarFormState,
  formData: FormData,
): Promise<CarFormState> {
  await requireUser();

  const v = readForm(formData);
  const invalid = validate(v);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.from('cars').insert({
    ...v,
    slug: slugify(v.brand, v.model, v.variant, v.year, Date.now() % 10000),
  });

  if (error) return { error: error.message };

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}

export async function updateCar(
  id: string,
  _prev: CarFormState,
  formData: FormData,
): Promise<CarFormState> {
  await requireUser();

  const v = readForm(formData);
  const invalid = validate(v);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.from('cars').update(v).eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}

export async function deleteCar(id: string) {
  await requireUser();

  const supabase = await createClient();
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}
