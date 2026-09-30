import { createClient } from '@/lib/supabase/server';

/**
 * The people who have written in.
 *
 * Two tables, two shapes: somebody selling us their car, and somebody
 * interested in buying one. Both are written by the public forms and read
 * back only here — the policies in supabase/002_leads.sql let anon insert
 * and nothing else, so a lead is invisible to the public once it is saved.
 */

export interface SellLead {
  id: string;
  ref: string;
  createdAt: string;

  // the car
  car: string;
  fuel: string;
  transmission: string;
  body: string | null;
  kmDriven: number;
  owners: number;
  rtoCode: string | null;
  regState: string | null;

  // condition
  accidentHistory: string;
  serviceHistory: string;
  knownIssues: string | null;

  // paperwork
  insuranceType: string;
  insuranceValidTill: string | null;
  rcStatus: string;
  loanStatus: string;
  keysCount: number;
  pendingChallans: boolean;

  // commercial
  expectedPrice: number | null;
  reasonForSelling: string | null;

  // the seller
  name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  locality: string | null;
  pincode: string | null;
  preferredSlot: string | null;

  /** Signed links to the private bucket. They expire; the page re-signs. */
  photoUrls: string[];
  /** Kept so the photographs can be removed when the lead is deleted. */
  photoPaths: string[];
}

export interface BuyerLead {
  id: string;
  ref: string;
  createdAt: string;
  kind: 'test_drive' | 'general' | 'callback';
  carLabel: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  preferredSlot: string | null;
}

/** An hour is plenty — the page is re-rendered on every visit. */
const PHOTO_TTL = 60 * 60;

export async function getSellLeads(): Promise<SellLead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sell_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getSellLeads]', error.message);
    return [];
  }

  const rows = data ?? [];

  // The seller photo bucket is private on purpose — somebody's number plate
  // and driveway have no business on an open CDN — so each one needs a
  // signed link before it can be shown.
  const allPaths = rows.flatMap((r) => (r.photos as string[] | null) ?? []);
  const signed = new Map<string, string>();

  if (allPaths.length > 0) {
    const { data: urls, error: signError } = await supabase.storage
      .from('sell-photos')
      .createSignedUrls(allPaths, PHOTO_TTL);
    if (signError) console.error('[getSellLeads] photos', signError.message);
    for (const u of urls ?? []) {
      if (u.path && u.signedUrl) signed.set(u.path, u.signedUrl);
    }
  }

  return rows.map((r): SellLead => {
    const paths = (r.photos as string[] | null) ?? [];
    return {
      id: r.id,
      ref: r.ref,
      createdAt: r.created_at,
      car: [r.year_mfg, r.brand, r.model, r.variant].filter(Boolean).join(' '),
      fuel: r.fuel,
      transmission: r.transmission,
      body: r.body,
      kmDriven: r.km_driven,
      owners: r.owners,
      rtoCode: r.rto_code,
      regState: r.reg_state,
      accidentHistory: r.accident_history,
      serviceHistory: r.service_history,
      knownIssues: r.known_issues,
      insuranceType: r.insurance_type,
      insuranceValidTill: r.insurance_valid_till,
      rcStatus: r.rc_status,
      loanStatus: r.loan_status,
      keysCount: r.keys_count,
      pendingChallans: r.pending_challans,
      expectedPrice: r.expected_price === null ? null : Number(r.expected_price),
      reasonForSelling: r.reason_for_selling,
      name: r.name,
      phone: r.phone,
      whatsapp: r.whatsapp_same ? r.phone : r.whatsapp,
      email: r.email,
      locality: r.locality,
      pincode: r.pincode,
      preferredSlot: r.preferred_slot,
      photoPaths: paths,
      photoUrls: paths.map((p) => signed.get(p)).filter((u): u is string => !!u),
    };
  });
}

export async function getBuyerLeads(): Promise<BuyerLead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getBuyerLeads]', error.message);
    return [];
  }

  return (data ?? []).map(
    (r): BuyerLead => ({
      id: r.id,
      ref: r.ref,
      createdAt: r.created_at,
      kind: r.kind,
      carLabel: r.car_label,
      name: r.name,
      phone: r.phone,
      email: r.email,
      message: r.message,
      preferredSlot: r.preferred_slot,
    }),
  );
}
