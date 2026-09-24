/**
 * Loan maths, in one place.
 *
 * The finance calculator and the car detail page both quote a monthly figure.
 * They must agree — a customer who sees ₹18,400 on the listing and ₹19,100 in
 * the calculator stops trusting both numbers.
 */

/** What a used-car loan actually costs in Bengaluru today. Used as defaults. */
export const FINANCE_DEFAULTS = {
  downPct: 20,
  /** months */
  term: 60,
  /** annual reducing-balance rate, % */
  rate: 12.5,
} as const;

export interface EmiBreakdown {
  /** Rupees paid up front. */
  down: number;
  /** Amount financed. */
  principal: number;
  /** Rupees per month. */
  monthly: number;
  totalInterest: number;
  totalPayable: number;
  /** Share of everything you repay that is interest, as a percentage. */
  interestShare: number;
}

/**
 * Standard reducing-balance EMI:  P·r·(1+r)^n / ((1+r)^n − 1)
 *
 * @param price  on-road price in rupees
 * @param downPct  down payment as a percentage of price
 * @param term  tenure in months
 * @param rate  annual interest rate, percent
 */
export function calculateEmi(
  price: number,
  downPct: number = FINANCE_DEFAULTS.downPct,
  term: number = FINANCE_DEFAULTS.term,
  rate: number = FINANCE_DEFAULTS.rate,
): EmiBreakdown {
  const down = Math.round((price * downPct) / 100);
  const principal = Math.max(0, price - down);

  const r = rate / 100 / 12;
  let monthly: number;
  if (principal === 0) monthly = 0;
  else if (r === 0) monthly = principal / term;
  else monthly = (principal * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);

  const totalInterest = Math.max(0, monthly * term - principal);
  const totalPayable = principal + totalInterest;

  return {
    down,
    principal,
    monthly,
    totalInterest,
    totalPayable,
    interestShare: totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0,
  };
}

/** The headline "from ₹X/month" on a listing — house defaults, rounded. */
export const monthlyFrom = (price: number) =>
  Math.round(calculateEmi(price).monthly);
