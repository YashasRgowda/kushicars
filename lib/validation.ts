/**
 * Hand-rolled validators. No schema library — the rule set is small, it is
 * India-specific, and every message here is written to be read by a seller
 * standing in a forecourt, not by a developer.
 *
 * Used twice: once in the browser for instant feedback, and again inside the
 * server action, because the client can be bypassed.
 */

export type Errors<T> = Partial<Record<keyof T, string>>;

/** Indian mobile numbers start 6–9 and are ten digits. */
export const isMobile = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, ''));

/** Strips +91, spaces and dashes down to the ten digits we store. */
export const normaliseMobile = (v: string) => {
  const d = v.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) return d.slice(2);
  if (d.length === 11 && d.startsWith('0')) return d.slice(1);
  return d;
};

export const isPincode = (v: string) => /^[1-9]\d{5}$/.test(v.trim());

/** Deliberately loose — we are not the arbiter of what an email may look like. */
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/**
 * A whole number plate, not just the RTO code.
 *
 * Two shapes are on the road. The familiar one is state, district, series,
 * number — KA 05 MH 1234 — where the series can be one to three letters and
 * is sometimes missing on older plates. The other is the Bharat series,
 * 23 BH 1234 AA, which a car registered after 2021 may carry.
 *
 * Deliberately not stricter than that. A seller typing their own plate is
 * copying something they can see; the cost of rejecting a valid one is that
 * they give up on the form, and the cost of accepting an odd one is that we
 * read it back to them on the phone.
 */
export const normaliseRegNumber = (v: string) =>
  v.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

export const isRegNumber = (v: string) => {
  const s = normaliseRegNumber(v);
  return /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/.test(s) || /^\d{2}BH\d{4}[A-Z]{1,2}$/.test(s);
};

/** "ka05mh1234" -> "KA 05 MH 1234", so it reads back the way a plate looks. */
export const formatRegNumber = (v: string) => {
  const s = normaliseRegNumber(v);
  const m = s.match(/^([A-Z]{2})(\d{1,2})([A-Z]{0,3})(\d{4})$/);
  if (m) return [m[1], m[2], m[3], m[4]].filter(Boolean).join(' ');
  const bh = s.match(/^(\d{2})(BH)(\d{4})([A-Z]{1,2})$/);
  if (bh) return `${bh[1]} ${bh[2]} ${bh[3]} ${bh[4]}`;
  return s;
};

/** yyyy-mm, as produced by <input type="month">. */
export const isMonthString = (v: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(v);

/** "2027-03" -> "03/2027", which is how an Indian policy is actually read. */
export const formatMonth = (v: string) => {
  if (!isMonthString(v)) return v;
  const [y, m] = v.split('-');
  return `${m}/${y}`;
};

/** <input type="month"> wants a day; Postgres date wants one too. */
export const monthToDate = (v: string) => (isMonthString(v) ? `${v}-01` : null);

const CURRENT_YEAR = new Date().getFullYear();
/** Next year's plates are already on the road by December. */
export const MAX_YEAR = CURRENT_YEAR + 1;
export const MIN_YEAR = 1990;

export const isYear = (v: string) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= MIN_YEAR && n <= MAX_YEAR;
};

export const isPositiveInt = (v: string, max = Number.MAX_SAFE_INTEGER) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= max;
};

/** Digits only, for km and price inputs. Keeps the caret behaviour sane. */
export const digitsOnly = (v: string) => v.replace(/\D/g, '');

/** 1450000 -> "14,50,000" as the user types. */
export const groupIndian = (v: string) => {
  const d = digitsOnly(v);
  if (!d) return '';
  return new Intl.NumberFormat('en-IN').format(Number(d));
};
