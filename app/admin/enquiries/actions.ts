'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

/**
 * Removing a lead once it has been dealt with.
 *
 * Same rule as a car: delete means gone. The row is erased, and a seller's
 * photographs go with it rather than sitting in the bucket forever.
 */

export async function deleteSellLead(id: string) {
  await requireUser();
  const supabase = await createClient();

  const { data: doomed } = await supabase
    .from('sell_requests')
    .select('photos')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase.from('sell_requests').delete().eq('id', id);
  if (error) throw new Error(error.message);

  const paths = ((doomed?.photos as string[] | null) ?? []).filter(Boolean);
  if (paths.length > 0) {
    const { error: photoError } = await supabase.storage
      .from('sell-photos')
      .remove(paths);
    if (photoError) console.error('[deleteSellLead] photos', photoError.message);
  }

  revalidatePath('/admin/enquiries');
}

export async function deleteBuyerLead(id: string) {
  await requireUser();
  const supabase = await createClient();

  const { error } = await supabase.from('enquiries').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/enquiries');
}
