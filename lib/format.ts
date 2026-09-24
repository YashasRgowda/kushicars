const LAKH = 100000;
const CRORE = 10000000;

/**
 * Indian buyers read prices in lakhs and crores, not raw rupees.
 * 1350000 → "₹13.50 Lakh"   |   12500000 → "₹1.25 Crore"
 */
export const formatPrice = (value: number) => {
  if (value >= CRORE) {
    const cr = value / CRORE;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Crore`;
  }
  if (value >= LAKH) {
    const l = value / LAKH;
    return `₹${l.toFixed(2)} Lakh`;
  }
  return `₹${new Intl.NumberFormat('en-IN').format(value)}`;
};

/** Compact form for tight spaces: 1350000 → "₹13.5L" */
export const formatPriceShort = (value: number) => {
  if (value >= CRORE) return `₹${(value / CRORE).toFixed(2)}Cr`;
  if (value >= LAKH) return `₹${(value / LAKH).toFixed(1)}L`;
  return `₹${new Intl.NumberFormat('en-IN').format(value)}`;
};

/** Indian digit grouping: 145000 → "1,45,000" */
export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-IN').format(value);

export const formatKm = (value: number) =>
  `${new Intl.NumberFormat('en-IN').format(value)} km`;

export const formatOwners = (n: number) =>
  n === 1 ? '1st owner' : n === 2 ? '2nd owner' : n === 3 ? '3rd owner' : `${n}th owner`;
