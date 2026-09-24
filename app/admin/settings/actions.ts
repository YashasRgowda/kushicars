'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export interface SettingsState {
  error?: string;
  ok?: boolean;
}

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireUser();

  const str = (k: string) => {
    const v = String(formData.get(k) ?? '').trim();
    return v === '' ? null : v;
  };

  const businessName = str('business_name');
  if (!businessName) return { error: 'Business name is required.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('settings')
    .update({
      business_name: businessName,
      phone: str('phone'),
      whatsapp: str('whatsapp'),
      email: str('email'),
      address: str('address'),
      hours: str('hours'),
      map_url: str('map_url'),
    })
    .eq('id', 1);

  if (error) return { error: error.message };

  // The footer and navbar read these, so refresh the whole site.
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
  return { ok: true };
}
