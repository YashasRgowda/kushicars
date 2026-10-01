'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { makeRef } from '@/lib/ref';
import { monthToDate, normaliseMobile, normaliseRegNumber } from '@/lib/validation';
import { emptySellForm, slotText, validateAll, type SellFormValues } from '@/lib/sell';

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
    redirect('/sell/success');
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
    fuel: v.fuel,
    transmission: v.transmission,

    km_driven: Number(v.kmDriven),
    owners: Number(v.owners),
    // The whole plate, normalised to KA05MH1234. It lives in rto_code —
    // the column that used to hold just the district code — because the
    // check there allows 12 characters and a plate never exceeds 11, so
    // widening the form did not need a migration. The admin panel reads it
    // back as "Car number".
    rto_code: normaliseRegNumber(v.regNumber),

    known_issues: v.knownIssues.trim() || null,

    // accident_history, service_history, keys_count and pending_challans are
    // no longer asked — the inspection establishes all four better than a
    // seller typing on a phone does. Each is NOT NULL with a default in
    // supabase/002_leads.sql, so leaving them out is what fills them in.
    insurance_type: v.insuranceType,
    insurance_valid_till: monthToDate(v.insuranceValidTill),
    rc_status: v.rcStatus,
    loan_status: v.loanStatus,
    // Only meaningful on a CNG car; null everywhere else keeps the column honest.
    cng_endorsed_on_rc: v.fuel === 'CNG' ? v.cngEndorsedOnRc : null,

    expected_price: v.expectedPrice ? Number(v.expectedPrice) : null,

    name: v.name.trim(),
    phone,
    whatsapp_same: v.whatsappSame,
    whatsapp: whatsapp || null,
    locality: v.locality.trim() || null,
    pincode: v.pincode.trim() || null,

    preferred_slot: slotText(v.slot, v.slotDays) || null,
    photos: v.photos,
  });

  if (error) {
    console.error('[submitSellRequest]', error.message);
    return {
      error:
        'We could not save that just now. Please call or WhatsApp us instead — we will take the details down ourselves.',
    };
  }

  // The reference still goes in the row — it is how the owner refers to a
  // lead — but the seller is not shown one. By the time they land here the
  // details are already open in their WhatsApp.
  redirect('/sell/success');
}
