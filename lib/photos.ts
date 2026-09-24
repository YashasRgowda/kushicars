/**
 * Car photographs — the rules, in one place.
 *
 * The admin uploader, the server action that saves a car and the public
 * gallery all read from here, so the limit can never be enforced in one of
 * them and forgotten in another.
 */

/**
 * The most photos one listing may carry.
 *
 * Six, not four: a buyer wants the front, the rear, a side, the interior,
 * the boot, and the dashboard with the odometer lit. At four, the owner has
 * to choose which of those to leave out, and it is usually the odometer —
 * the single most trust-building photo on a used-car listing. Beyond six
 * the gallery stops being a showcase and becomes a camera roll.
 *
 * Change this one number to change the limit everywhere.
 */
export const MAX_PHOTOS = 6;

/**
 * Photos are resized in the browser before upload. A phone camera produces
 * 4–8 MB at 4000px; nobody's screen needs more than 2000px, and the car page
 * loads roughly ten times faster for it.
 */
export const UPLOAD_MAX_EDGE = 2000;
export const UPLOAD_QUALITY = 0.86;

/** Hard ceiling on what we will even try to resize. */
export const UPLOAD_MAX_MB = 25;

/**
 * Whether next/image can optimise this source. Local files and our own
 * Supabase storage are allowed in next.config.ts; anything else would make
 * next/image throw, so it is served as-is instead.
 */
export function canOptimize(src: string): boolean {
  if (src.startsWith('/')) return true;
  try {
    const u = new URL(src);
    return (
      u.protocol === 'https:' &&
      u.hostname.endsWith('.supabase.co') &&
      u.pathname.startsWith('/storage/v1/object/public/')
    );
  } catch {
    return false;
  }
}
