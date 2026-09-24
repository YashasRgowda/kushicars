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

/** KA05, KA-05, MH12 — RTO codes are two letters then one or two digits. */
export const isRtoCode = (v: string) =>
  /^[A-Za-z]{2}[\s-]?\d{1,2}$/.test(v.trim());

export const formatRtoCode = (v: string) => {
  const m = v.trim().toUpperCase().match(/^([A-Z]{2})[\s-]?(\d{1,2})$/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}` : v.trim().toUpperCase();
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
