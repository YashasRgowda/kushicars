'use server';

import { createClient } from '@/lib/supabase/server';
import { makeRef } from '@/lib/ref';
import { isEmail, isMobile, normaliseMobile } from '@/lib/validation';
import type { EnquiryKind } from '@/lib/types';

/**
 * Buyer-side leads: a test drive request from a listing, or the contact form.
 *
 * Writes through the anon key, which is all the public has. The RLS policy in
 * supabase/002_leads.sql lets anon INSERT and nothing else, so a lead cannot
 * be read back from the browser once it is written.
 */

export interface EnquiryState {
  ok?: boolean;
  ref?: string;
  error?: string;
  /**
   * What was submitted, echoed back.
   *
   * The footer's callback form offers a WhatsApp hand-off after it saves the
   * lead, and it needs the answers to write that message. Reading them back
   * out of the form element after React has reset it does not work; carrying
   * them on the result does.
   */
  submitted?: { name: string; phone: string; message: string };
}

const KINDS: EnquiryKind[] = ['test_drive', 'general', 'callback'];

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot. A real visitor never sees this field, so anything in it is a bot.
  // Answer as if it worked — a bot that knows it failed just tries again.
  if (String(formData.get('website') ?? '').trim() !== '') {
    return { ok: true, ref: makeRef() };
  }

  const str = (k: string) => String(formData.get(k) ?? '').trim();

  const kindRaw = str('kind') as EnquiryKind;
  const kind: EnquiryKind = KINDS.includes(kindRaw) ? kindRaw : 'general';

  const name = str('name');
  const phone = normaliseMobile(str('phone'));
  const email = str('email');
  const message = str('message');
  const preferredSlot = str('preferred_slot');
  const carId = str('car_id');
  const carLabel = str('car_label');

  if (name.length < 2) return { error: 'Please tell us your name.' };
  if (name.length > 80) return { error: 'That name is too long.' };
  if (!isMobile(phone)) return { error: 'Enter a 10-digit mobile number.' };
  if (email && !isEmail(email)) return { error: 'Check the email address.' };
  if (message.length > 1200) return { error: 'Please keep the message shorter.' };

  const supabase = await createClient();
  const ref = makeRef();

  const { error } = await supabase.from('enquiries').insert({
    ref,
    kind,
    car_id: carId || null,
    car_label: carLabel || null,
    name,
    phone,
    email: email || null,
    message: message || null,
    preferred_slot: preferredSlot || null,
  });

  if (error) {
    console.error('[submitEnquiry]', error.message);
    return {
      error:
        'Something went wrong saving that. Please call or WhatsApp us instead — we will pick up.',
    };
  }

  return { ok: true, ref, submitted: { name, phone, message } };
}
