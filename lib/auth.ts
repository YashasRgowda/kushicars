import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

/**
 * Data Access Layer for auth.
 *
 * Every admin page and every server action calls requireUser() before it
 * touches data. This — not proxy.ts, and not the admin layout — is the real
 * security boundary:
 *
 *  - proxy.ts only checks that a cookie exists, which can be forged.
 *  - Layouts do not re-run on every navigation, so they cannot be relied on.
 *
 * getUser() revalidates the token with Supabase on every call. React's cache()
 * dedupes it within a single render, so calling it in several places in one
 * page costs one round trip.
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Returns the signed-in user, or redirects to the login page. */
export const requireUser = cache(async (): Promise<User> => {
  const user = await getUser();
  if (!user) redirect('/admin/login');
  return user;
});
