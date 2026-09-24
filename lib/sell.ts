/**
 * The "sell your car" domain model.
 *
 * The field set is deliberately closer to what a dealer asks on the phone than
 * to a generic contact form. Four things decide whether a used-car deal in
 * India actually closes at handover, and all four are asked here up front:
 *
 *   1. RC status       — a duplicate RC or one sitting with a financier adds
 *                        weeks, and the seller usually doesn't mention it.
 *   2. Loan / hypothecation — an unremoved HP endorsement blocks transfer even
 *                        when the loan was cleared years ago.
 *   3. Insurance       — validity and type drive both the price and whether the
 *                        car can be driven away on the day.
 *   4. Accident history — the single largest correction to a quote after age
 *                        and kilometres.
 *
 * Labels are what the seller reads; values are what goes in the database and
 * must match the check constraints in supabase/002_leads.sql.
 */

import {
  isMobile,
  isMonthString,
  isPincode,
  isEmail,
  isRtoCode,
  isYear,
  MIN_YEAR,
  MAX_YEAR,
  type Errors,
} from '@/lib/validation';


export type Fuel = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid' | 'LPG';
export type Transmission = 'Manual' | 'Automatic';
export type SellBody = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Coupe' | 'Other';
export type AccidentHistory = 'none' | 'minor' | 'major';
export type ServiceHistory = 'authorised' | 'local' | 'none';
export type InsuranceType = 'comprehensive' | 'third_party' | 'expired' | 'none';
export type RcStatus = 'original' | 'duplicate' | 'with_financier';
export type LoanStatus = 'none' | 'running' | 'closed_hp_not_removed';

export interface Option<T extends string> {
  value: T;
  label: string;
  /** One line under the label. Plain language — sellers are not dealers. */
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

export const BODIES: Option<SellBody>[] = [
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'MUV', label: 'MUV' },
  { value: 'Coupe', label: 'Coupe' },
  { value: 'Other', label: 'Other' },
];

export const ACCIDENT_OPTIONS: Option<AccidentHistory>[] = [
  {
    value: 'none',
    label: 'Never been in an accident',
    hint: 'No panel replaced, no claim made.',
  },
  {
    value: 'minor',
    label: 'Minor — panel or bumper work',
    hint: 'Cosmetic repairs, dents, a repainted panel. Chassis untouched.',
  },
  {
    value: 'major',
    label: 'Major — structural repair',
    hint: 'Chassis, pillar or airbag work, or a total-loss claim.',
  },
];

export const SERVICE_OPTIONS: Option<ServiceHistory>[] = [
  {
    value: 'authorised',
    label: 'Authorised service centre',
    hint: 'Full stamped service book. Adds the most to your quote.',
  },
  { value: 'local', label: 'Local garage', hint: 'Serviced regularly, outside the network.' },
  { value: 'none', label: 'No records', hint: 'Bills or history not available.' },
];

export const INSURANCE_OPTIONS: Option<InsuranceType>[] = [
  { value: 'comprehensive', label: 'Comprehensive', hint: 'Own-damage plus third party.' },
  { value: 'third_party', label: 'Third party only', hint: 'The legal minimum.' },
  { value: 'expired', label: 'Expired', hint: 'Lapsed and not yet renewed.' },
  { value: 'none', label: 'No insurance', hint: "Never taken, or I don't have the papers." },
];

export const RC_OPTIONS: Option<RcStatus>[] = [
  { value: 'original', label: 'Original RC in hand', hint: 'The smart card is with me.' },
  { value: 'duplicate', label: 'Duplicate / RC lost', hint: 'Applied for or already issued.' },
  {
    value: 'with_financier',
    label: 'With the bank or financier',
    hint: 'Held against a loan that is still open.',
  },
];

export const LOAN_OPTIONS: Option<LoanStatus>[] = [
  { value: 'none', label: 'No loan on the car', hint: 'Bought outright, or fully closed and cleared.' },
  { value: 'running', label: 'Loan still running', hint: 'EMIs are ongoing. We can settle it directly.' },
  {
    value: 'closed_hp_not_removed',
    label: 'Loan closed, HP not removed',
    hint: 'The bank still shows on the RC. Very common — we handle it.',
  },
];

/** What we ask the seller to pick so we can send the right person out. */
export const SLOT_OPTIONS = [
  'Weekday morning',
  'Weekday evening',
  'Saturday morning',
  'Saturday evening',
  'Sunday',
  'Any time — just call me',
] as const;

/** Every form field, before it becomes a database row. All strings: this is
 *  what the inputs hold, and the server action is what coerces and re-checks. */
export interface SellFormValues {
  // 1 — the car
  brand: string;
  model: string;
  variant: string;
  yearMfg: string;
  yearReg: string;
  fuel: Fuel | '';
  transmission: Transmission | '';
  body: SellBody | '';

  // 2 — usage & condition
  kmDriven: string;
  owners: string;
  rtoCode: string;
  regState: string;
  accidentHistory: AccidentHistory | '';
  serviceHistory: ServiceHistory | '';
  knownIssues: string;

  // 3 — paperwork
  insuranceType: InsuranceType | '';
  insuranceValidTill: string; // yyyy-mm
  rcStatus: RcStatus | '';
  loanStatus: LoanStatus | '';
  keysCount: string;
  pendingChallans: boolean;
  cngEndorsedOnRc: boolean;

  // 4 — price & seller
  expectedPrice: string;
  reasonForSelling: string;
  photos: string[];
  name: string;
  phone: string;
  whatsappSame: boolean;
  whatsapp: string;
  email: string;
  locality: string;
  pincode: string;
  preferredSlot: string;
  consent: boolean;

  /** Honeypot. Humans never see it, bots fill it, we drop those. */
  website: string;
}

export const emptySellForm = (): SellFormValues => ({
  brand: '',
  model: '',
  variant: '',
  yearMfg: '',
  yearReg: '',
  fuel: '',
  transmission: '',
  body: '',
  kmDriven: '',
  owners: '1',
  rtoCode: '',
  regState: 'Karnataka',
  accidentHistory: '',
  serviceHistory: '',
  knownIssues: '',
  insuranceType: '',
  insuranceValidTill: '',
  rcStatus: '',
  loanStatus: '',
  keysCount: '2',
  pendingChallans: false,
  cngEndorsedOnRc: false,
  expectedPrice: '',
  reasonForSelling: '',
  photos: [],
  name: '',
  phone: '',
  whatsappSame: true,
  whatsapp: '',
  email: '',
  locality: '',
  pincode: '',
  preferredSlot: '',
  consent: false,
  website: '',
});

/* ------------------------------------------------------------------
   Label lookups — used by the WhatsApp summary and the review screen.
   ------------------------------------------------------------------ */

const labelOf = <T extends string>(opts: Option<T>[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

export const accidentLabel = (v: string) => labelOf(ACCIDENT_OPTIONS, v);
export const serviceLabel = (v: string) => labelOf(SERVICE_OPTIONS, v);
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

   Runs per step in the browser so nobody reaches step 4 before finding
   out that step 1 was wrong, and runs again in full inside the server
   action, because the client can be bypassed.
   ================================================================== */

export type SellErrors = Errors<SellFormValues>;

export const SELL_STEPS = [
  { id: 1, title: 'Your car', blurb: 'What you are selling' },
  { id: 2, title: 'Condition', blurb: 'How it has been used' },
  { id: 3, title: 'Paperwork', blurb: 'RC, insurance and loan' },
  { id: 4, title: 'Your details', blurb: 'Price and how to reach you' },
] as const;

export function validateStep(step: number, v: SellFormValues): SellErrors {
  const e: SellErrors = {};

  if (step === 1) {
    if (!v.brand.trim()) e.brand = 'Pick the brand.';
    if (!v.model.trim()) e.model = 'Tell us the model — Swift, Creta, Nexon.';
    if (!v.yearMfg) e.yearMfg = 'Which year was it made?';
    else if (!isYear(v.yearMfg)) e.yearMfg = `Enter a year between ${MIN_YEAR} and ${MAX_YEAR}.`;
    if (v.yearReg && !isYear(v.yearReg))
      e.yearReg = `Enter a year between ${MIN_YEAR} and ${MAX_YEAR}.`;
    if (v.yearReg && v.yearMfg && Number(v.yearReg) < Number(v.yearMfg))
      e.yearReg = 'Registration cannot be before manufacture.';
    if (!v.fuel) e.fuel = 'Pick the fuel type.';
    if (!v.transmission) e.transmission = 'Manual or automatic?';
  }

  if (step === 2) {
    const km = Number(v.kmDriven);
    if (!v.kmDriven) e.kmDriven = 'How many kilometres has it done?';
    else if (!Number.isFinite(km) || km < 0 || km > 1000000)
      e.kmDriven = 'Enter the reading on the odometer.';
    const owners = Number(v.owners);
    if (!Number.isInteger(owners) || owners < 1 || owners > 10)
      e.owners = 'Between 1 and 10.';
    if (v.rtoCode && !isRtoCode(v.rtoCode))
      e.rtoCode = 'Something like KA-05.';
    if (!v.accidentHistory) e.accidentHistory = 'This one matters — please pick an option.';
    if (!v.serviceHistory) e.serviceHistory = 'Where has it been serviced?';
    if (v.knownIssues.length > 1200) e.knownIssues = 'Keep it under 1200 characters.';
  }

  if (step === 3) {
    if (!v.insuranceType) e.insuranceType = 'Pick the insurance status.';
    const needsDate = v.insuranceType === 'comprehensive' || v.insuranceType === 'third_party';
    if (needsDate && !v.insuranceValidTill)
      e.insuranceValidTill = 'When does the policy run out?';
    else if (v.insuranceValidTill && !isMonthString(v.insuranceValidTill))
      e.insuranceValidTill = 'Pick a month and year.';
    if (!v.rcStatus) e.rcStatus = 'Where is the RC right now?';
    if (!v.loanStatus) e.loanStatus = 'Is there a loan on the car?';
    const keys = Number(v.keysCount);
    if (!Number.isInteger(keys) || keys < 0 || keys > 4) e.keysCount = 'Between 0 and 4.';
  }

  if (step === 4) {
    if (v.expectedPrice) {
      const p = Number(v.expectedPrice);
      if (!Number.isFinite(p) || p < 10000 || p > 100000000)
        e.expectedPrice = 'Enter a realistic figure in rupees.';
    }
    if (!v.name.trim()) e.name = 'Your name, please.';
    else if (v.name.trim().length < 2) e.name = 'That looks too short.';
    if (!v.phone) e.phone = 'We need a number to call you on.';
    else if (!isMobile(v.phone)) e.phone = 'Enter a 10-digit mobile number.';
    if (!v.whatsappSame && v.whatsapp && !isMobile(v.whatsapp))
      e.whatsapp = 'Enter a 10-digit WhatsApp number.';
    if (v.email && !isEmail(v.email)) e.email = 'Check the email address.';
    if (v.pincode && !isPincode(v.pincode)) e.pincode = 'Six digits, like 560072.';
    if (!v.preferredSlot) e.preferredSlot = 'When suits you for the inspection?';
    if (!v.consent) e.consent = 'Please tick this so we may contact you.';
  }

  return e;
}

/** Every step at once — what the server action runs before it writes a row. */
export function validateAll(v: SellFormValues): SellErrors {
  return {
    ...validateStep(1, v),
    ...validateStep(2, v),
    ...validateStep(3, v),
    ...validateStep(4, v),
  };
}
