/**
 * The "sell your car" domain model.
 *
 * The field set is what a dealer asks on the phone, and no more than that.
 * It was longer: body style, registration year, RTO code and state, accident
 * history, service history, key count, pending challans, reason for selling
 * and an email address all came out, because every one of them is a question
 * the inspection answers better than a stranger typing on a phone does. What
 * is left is the set that decides whether a deal closes at handover:
 *
 *   1. RC status       — a duplicate RC adds weeks, and sellers rarely
 *                        mention it unprompted.
 *   2. Loan            — an unremoved HP endorsement blocks transfer even
 *                        when the loan was cleared years ago.
 *   3. Insurance       — validity drives both the price and whether the car
 *                        can be driven away on the day.
 *
 * Every label is written to be read by somebody standing next to their own
 * car, not by a dealer. No word here needs explaining.
 *
 * Labels are what the seller reads; values are what goes in the database and
 * must match the check constraints in supabase/002_leads.sql.
 */

import {
  isMobile,
  isMonthString,
  isPincode,
  isRegNumber,
  isYear,
  MIN_YEAR,
  MAX_YEAR,
  type Errors,
} from '@/lib/validation';

export type Fuel = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid' | 'LPG';
export type Transmission = 'Manual' | 'Automatic';
export type InsuranceType = 'comprehensive' | 'third_party' | 'expired' | 'none';
export type RcStatus = 'original' | 'duplicate';
export type LoanStatus = 'none' | 'running' | 'closed_hp_not_removed';

export interface Option<T extends string> {
  value: T;
  label: string;
  /** One line under the label, only where the label cannot carry it alone. */
  hint?: string;
}

export const FUELS: Option<Fuel>[] = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'CNG', label: 'CNG' },
  { value: 'LPG', label: 'LPG' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Electric', label: 'Electric' },
];

export const TRANSMISSIONS: Option<Transmission>[] = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
];

export const INSURANCE_OPTIONS: Option<InsuranceType>[] = [
  { value: 'comprehensive', label: 'Full cover' },
  { value: 'third_party', label: 'Third party only' },
  { value: 'expired', label: 'Expired' },
  { value: 'none', label: 'No insurance' },
];

export const RC_OPTIONS: Option<RcStatus>[] = [
  { value: 'original', label: 'I have the original RC' },
  { value: 'duplicate', label: 'RC lost, or a duplicate' },
];

export const LOAN_OPTIONS: Option<LoanStatus>[] = [
  { value: 'none', label: 'No loan' },
  { value: 'running', label: 'Loan still running', hint: 'EMIs going on. We can close it for you.' },
  {
    value: 'closed_hp_not_removed',
    label: 'Loan closed, bank still on the RC',
    hint: 'Very common. We handle it.',
  },
];

/* ------------------------------------------------------------------
   When we can come and look at it
   ------------------------------------------------------------------ */

export type SlotChoice = 'this_week' | 'this_month' | 'days';

export const SLOT_OPTIONS: Option<SlotChoice>[] = [
  { value: 'this_week', label: 'Within this week' },
  { value: 'this_month', label: 'Within this month' },
  { value: 'days', label: 'In ____ days' },
];

/** What gets written to the row, and read out on the owner's phone. */
export const slotText = (slot: SlotChoice | '', days: string) => {
  if (slot === 'this_week') return 'Within this week';
  if (slot === 'this_month') return 'Within this month';
  if (slot === 'days' && days) return `In ${Number(days)} days`;
  return '';
};

/** Every form field, before it becomes a database row. All strings: this is
 *  what the inputs hold, and the server action is what coerces and re-checks. */
export interface SellFormValues {
  // 1 — you
  name: string;
  phone: string;
  whatsappSame: boolean;
  whatsapp: string;
  locality: string;
  pincode: string;

  // 2 — the car
  brand: string;
  model: string;
  variant: string;
  yearMfg: string;
  fuel: Fuel | '';
  transmission: Transmission | '';
  kmDriven: string;
  owners: string;
  regNumber: string;
  knownIssues: string;

  // 3 — papers, price, when
  insuranceType: InsuranceType | '';
  insuranceValidTill: string; // yyyy-mm
  rcStatus: RcStatus | '';
  loanStatus: LoanStatus | '';
  cngEndorsedOnRc: boolean;
  expectedPrice: string;
  photos: string[];
  slot: SlotChoice | '';
  slotDays: string;
  consent: boolean;

  /** Honeypot. Humans never see it, bots fill it, we drop those. */
  website: string;
}

export const emptySellForm = (): SellFormValues => ({
  name: '',
  phone: '',
  whatsappSame: true,
  whatsapp: '',
  locality: '',
  pincode: '',

  brand: '',
  model: '',
  variant: '',
  yearMfg: '',
  fuel: '',
  transmission: '',
  kmDriven: '',
  owners: '1',
  regNumber: '',
  knownIssues: '',

  insuranceType: '',
  insuranceValidTill: '',
  rcStatus: '',
  loanStatus: '',
  cngEndorsedOnRc: false,
  expectedPrice: '',
  photos: [],
  slot: '',
  slotDays: '',
  consent: false,

  website: '',
});

/* ------------------------------------------------------------------
   Label lookups — used by the WhatsApp summary and the admin panel.
   ------------------------------------------------------------------ */

const labelOf = <T extends string>(opts: Option<T>[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

export const insuranceLabel = (v: string) => labelOf(INSURANCE_OPTIONS, v);
export const rcLabel = (v: string) => labelOf(RC_OPTIONS, v);
export const loanLabel = (v: string) => labelOf(LOAN_OPTIONS, v);

/** The brands that actually turn up on a Bengaluru forecourt, in that order. */
export const COMMON_BRANDS = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata',
  'Mahindra',
  'Honda',
  'Toyota',
  'Kia',
  'Renault',
  'Volkswagen',
  'Skoda',
  'Ford',
  'MG',
  'Nissan',
  'Datsun',
  'Chevrolet',
  'Jeep',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Other',
] as const;

/* ==================================================================
   Validation

   Runs per step in the browser so nobody reaches the last screen before
   finding out the first one was wrong, and runs again in full inside the
   server action, because the client can be bypassed.
   ================================================================== */

export type SellErrors = Errors<SellFormValues>;

export const SELL_STEPS = [
  { id: 1, title: 'You', blurb: 'Name and number' },
  { id: 2, title: 'Your car', blurb: 'What you are selling' },
  { id: 3, title: 'Price', blurb: 'Papers, price and when to come' },
] as const;

export function validateStep(step: number, v: SellFormValues): SellErrors {
  const e: SellErrors = {};

  if (step === 1) {
    if (!v.name.trim()) e.name = 'Your name, please.';
    else if (v.name.trim().length < 2) e.name = 'That looks too short.';
    if (!v.phone) e.phone = 'We need a number to call you on.';
    else if (!isMobile(v.phone)) e.phone = 'Enter a 10-digit mobile number.';
    if (!v.whatsappSame && v.whatsapp && !isMobile(v.whatsapp))
      e.whatsapp = 'Enter a 10-digit WhatsApp number.';
    if (v.pincode && !isPincode(v.pincode)) e.pincode = 'Six digits, like 560072.';
  }

  if (step === 2) {
    if (!v.brand.trim()) e.brand = 'Pick the brand.';
    if (!v.model.trim()) e.model = 'Tell us the model — Swift, Creta, Nexon.';
    if (!v.yearMfg) e.yearMfg = 'Which year was it made?';
    else if (!isYear(v.yearMfg)) e.yearMfg = `Enter a year between ${MIN_YEAR} and ${MAX_YEAR}.`;
    if (!v.fuel) e.fuel = 'Pick the fuel.';
    if (!v.transmission) e.transmission = 'Manual or automatic?';

    const km = Number(v.kmDriven);
    if (!v.kmDriven) e.kmDriven = 'How many kilometres has it done?';
    else if (!Number.isFinite(km) || km < 0 || km > 1000000)
      e.kmDriven = 'Enter the reading on the odometer.';

    const owners = Number(v.owners);
    if (!Number.isInteger(owners) || owners < 1 || owners > 10)
      e.owners = 'Between 1 and 10.';

    if (!v.regNumber.trim()) e.regNumber = 'Enter the car number.';
    else if (!isRegNumber(v.regNumber)) e.regNumber = 'Something like KA 05 MH 1234.';

    if (v.knownIssues.length > 1200) e.knownIssues = 'Keep it under 1200 characters.';
  }

  if (step === 3) {
    if (!v.insuranceType) e.insuranceType = 'Pick one.';
    const needsDate = v.insuranceType === 'comprehensive' || v.insuranceType === 'third_party';
    if (needsDate && !v.insuranceValidTill)
      e.insuranceValidTill = 'When does it run out?';
    else if (v.insuranceValidTill && !isMonthString(v.insuranceValidTill))
      e.insuranceValidTill = 'Pick a month and year.';

    if (!v.rcStatus) e.rcStatus = 'Where is the RC?';
    if (!v.loanStatus) e.loanStatus = 'Is there a loan on it?';

    if (v.expectedPrice) {
      const p = Number(v.expectedPrice);
      if (!Number.isFinite(p) || p < 10000 || p > 100000000)
        e.expectedPrice = 'Enter a realistic figure in rupees.';
    }

    if (!v.slot) e.slot = 'When can we come?';
    else if (v.slot === 'days') {
      const d = Number(v.slotDays);
      if (!v.slotDays) e.slotDays = 'How many days?';
      else if (!Number.isInteger(d) || d < 1 || d > 365) e.slotDays = 'Between 1 and 365.';
    }

    if (!v.consent) e.consent = 'Please tick this so we may call you.';
  }

  return e;
}

/** Every step at once — what the server action runs before it writes a row. */
export function validateAll(v: SellFormValues): SellErrors {
  return {
    ...validateStep(1, v),
    ...validateStep(2, v),
    ...validateStep(3, v),
  };
}
