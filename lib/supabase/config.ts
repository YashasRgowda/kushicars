/**
 * Where the Supabase connection details come from.
 *
 * Both values are PUBLIC by design. Next.js inlines anything prefixed
 * NEXT_PUBLIC_ into the JavaScript it sends to the browser, so the anon key
 * is visible to every visitor whatever we do here — it is an identifier, not
 * a password. What actually protects the data is Row Level Security: the
 * anon role may read cars and settings, may insert a lead, and may do
 * nothing else. See supabase/002_leads.sql.
 *
 * The service role key is the one that must never appear in this repo.
 *
 * Environment variables still win, so a different deployment (or the new
 * owner's own Supabase project) can override these without touching code.
 * The literals below are the fallback, and exist because a missing or
 * misnamed variable on the host produced a site that loaded perfectly and
 * silently showed no cars — the worst possible failure, since nothing looks
 * broken. A wrong key now fails loudly instead of quietly.
 */
/**
 * `??` is not enough here. A host can define a variable with an EMPTY value
 * — which is exactly what happened on Vercel — and an empty string is not
 * null, so `??` happily keeps the blank and every database request is
 * rejected with no visible error. Anything blank counts as absent.
 */
const orFallback = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

export const SUPABASE_URL = orFallback(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'https://jutnmcixfxfpzswsedvt.supabase.co',
);

export const SUPABASE_ANON_KEY = orFallback(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1dG5tY2l4ZnhmcHpzd3NlZHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxODczOTYsImV4cCI6MjEwNTc2MzM5Nn0.yHlm_91rhQAlUcIlCkO0b00E49QpvINyUU6UXlj-uj8',
);
