'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { makeRef } from '@/lib/ref';
import { formatRtoCode, monthToDate, normaliseMobile } from '@/lib/validation';
import { emptySellForm, validateAll, type SellFormValues } from '@/lib/sell';

/**
 * Receives a completed sell request.
 *
 * The wizard validates every step in the browser, but that is a courtesy to
 * the seller, not a control — the whole form is re-validated here before
 * anything is written. Anon may INSERT into sell_requests and do nothing
 * else (supabase/002_leads.sql), so a lead cannot be read back publicly.
 *
 * On success we redirect to /sell/success?ref=…, which is where the seller is
 * offered the pre-filled WhatsApp hand-off to the showroom.
 */

export interface SellState {
  error?: string;
  /** Field-level errors, so the wizard can jump back to the offending step. */
  fieldErrors?: Record<string, string>;
}

export async function submitSellRequest(
  _prev: SellState,
  formData: FormData,
): Promise<SellState> {
  const raw = String(formData.get('payload') ?? '');

  // Honeypot — invisible to people, irresistible to bots. We answer as though
  // it worked rather than telling the bot it was caught.
  if (String(formData.get('website') ?? '').trim() !== '') {
    redirect(`/sell/success?ref=${makeRef()}`);
  }

  let v: SellFormValues;
  try {
    v = { ...emptySellForm(), ...(JSON.parse(raw) as Partial<SellFormValues>) };
  } catch {
    return { error: 'We could not read that submission. Please try again.' };
  }

  const errors = validateAll(v);
  if (Object.keys(errors).length > 0) {
    return {
      error: 'Some answers need another look.',
      fieldErrors: errors as Record<string, string>,
    };
  }

  const phone = normaliseMobile(v.phone);
  const whatsapp = v.whatsappSame ? phone : normaliseMobile(v.whatsapp);

  const supabase = await createClient();
  const ref = makeRef();

  const { error } = await supabase.from('sell_requests').insert({
    ref,

    brand: v.brand.trim(),
    model: v.model.trim(),
    variant: v.variant.trim(),
    year_mfg: Number(v.yearMfg),
    year_reg: v.yearReg ? Number(v.yearReg) : null,
    fuel: v.fuel,
    transmission: v.transmission,
    body: v.body || null,

    km_driven: Number(v.kmDriven),
    owners: Number(v.owners),
    rto_code: v.rtoCode ? formatRtoCode(v.rtoCode) : null,
    reg_state: v.regState.trim() || null,

    accident_history: v.accidentHistory,
    service_history: v.serviceHistory,
    known_issues: v.knownIssues.trim() || null,

    insurance_type: v.insuranceType,
    insurance_valid_till: monthToDate(v.insuranceValidTill),
    rc_status: v.rcStatus,
    loan_status: v.loanStatus,
    keys_count: Number(v.keysCount),
    pending_challans: v.pendingChallans,
    // Only meaningful on a CNG car; null everywhere else keeps the column honest.
    cng_endorsed_on_rc: v.fuel === 'CNG' ? v.cngEndorsedOnRc : null,

    expected_price: v.expectedPrice ? Number(v.expectedPrice) : null,
    reason_for_selling: v.reasonForSelling.trim() || null,

    name: v.name.trim(),
    phone,
    whatsapp_same: v.whatsappSame,
    whatsapp: whatsapp || null,
    email: v.email.trim() || null,
    locality: v.locality.trim() || null,
    pincode: v.pincode.trim() || null,

    preferred_slot: v.preferredSlot || null,
    photos: v.photos,
  });

  if (error) {
    console.error('[submitSellRequest]', error.message);
    return {
      error:
        'We could not save that just now. Please call or WhatsApp us instead — we will take the details down ourselves.',
    };
  }

  redirect(`/sell/success?ref=${ref}`);
}
