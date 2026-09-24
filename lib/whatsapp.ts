import type { Settings } from '@/lib/types';

/**
 * Every WhatsApp hand-off on the site goes through here.
 *
 * Five components used to hand-roll their own wa.me URL, each with a slightly
 * different idea of how to strip the number — which is how you end up with one
 * broken link nobody notices for a month.
 */

/**
 * wa.me wants a bare international number: no +, no spaces, no dashes.
 * Indian mobiles are stored locally ("96863 35559" or "+91 96863 35559"), so
 * anything that comes back as 10 digits gets a 91 in front of it.
 */
export function toIntl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  return digits || null;
}

/** The number we hand customers — WhatsApp line first, landline as fallback. */
export const dealerNumber = (settings: Settings) =>
  toIntl(settings.whatsapp ?? settings.phone);

/** A tel: href that dialers actually accept. */
export const telHref = (raw: string | null | undefined) =>
  raw ? `tel:${raw.replace(/[^+\d]/g, '')}` : undefined;

/**
 * Builds the full deep link. Returns null when no number is configured, so
 * callers can hide the button instead of rendering a dead one.
 */
export function waLink(settings: Settings, message: string): string | null {
  const number = dealerNumber(settings);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/* ------------------------------------------------------------------
   Message templates.

   WhatsApp renders *text* as bold. Keeping the shape consistent means the
   owner can scan a message on his phone without reading it word by word.
   ------------------------------------------------------------------ */

export const messages = {
  general: (business: string) =>
    `Hi ${business}, I saw your website and would like to know more about the cars you have in stock.`,

  car: (business: string, label: string, price: string) =>
    `Hi ${business}, I'm interested in the ${label} listed at ${price}. Is it still available?`,

  testDrive: (business: string, label: string) =>
    `Hi ${business}, I'd like to book a test drive for the ${label}. When would be a good time?`,

  callback: (business: string, name: string, phone: string) =>
    `Hi ${business}, please call me back.\n\nName: ${name}\nPhone: ${phone}`,
};
