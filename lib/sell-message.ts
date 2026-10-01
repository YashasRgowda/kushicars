import { formatNumber, formatPrice } from '@/lib/format';
import { formatMonth, formatRegNumber } from '@/lib/validation';
import {
  insuranceLabel,
  loanLabel,
  rcLabel,
  slotText,
  type SellFormValues,
} from '@/lib/sell';

/**
 * Turns a submitted sell request into the message that lands on the owner's
 * phone.
 *
 * It is written to be *scanned*, not read: the owner is usually on the
 * forecourt with one hand free. WhatsApp renders *text* bold, so each line
 * leads with a bold label and the facts follow on one line. Anything the
 * seller left blank is dropped rather than printed as "N/A", which would
 * push the useful lines off the first screen.
 */
export function buildSellMessage(v: SellFormValues, ref: string | null, business: string): string {
  const L: string[] = [];
  const push = (label: string, ...parts: (string | null | undefined | false)[]) => {
    const body = parts.filter(Boolean).join(' · ');
    if (body) L.push(`*${label}:* ${body}`);
  };

  L.push(`*New car to sell — ${business}*`);
  // The message is built in the browser, at the moment of the press, so the
  // row's reference does not exist yet. The owner matches a message to a row
  // by the seller's number, which is right there on the next line.
  if (ref) L.push(`Ref: ${ref}`);
  L.push('');

  push('Seller', v.name.trim(), v.phone, !v.whatsappSame && v.whatsapp ? `WA ${v.whatsapp}` : null);
  push('Where', v.locality.trim() || null, v.pincode || null);

  L.push('');

  const carLine = [v.yearMfg, v.brand, v.model, v.variant].filter(Boolean).join(' ');
  push('Car', carLine, v.fuel || null, v.transmission || null);
  push('Number', v.regNumber ? formatRegNumber(v.regNumber) : null);
  push(
    'Run',
    v.kmDriven ? `${formatNumber(Number(v.kmDriven))} km` : null,
    ownerText(Number(v.owners)),
  );

  push(
    'Papers',
    insuranceText(v),
    rcLabel(v.rcStatus),
    loanLabel(v.loanStatus),
    v.fuel === 'CNG' ? (v.cngEndorsedOnRc ? 'CNG on RC' : 'CNG NOT on RC') : null,
  );

  if (v.knownIssues.trim()) push('Issues', v.knownIssues.trim());
  if (v.expectedPrice) push('Wants', formatPrice(Number(v.expectedPrice)));

  L.push('');
  push('Free', slotText(v.slot, v.slotDays));
  // Photographs are deliberately not mentioned. They go to the panel, where
  // they can be opened full size; a line about them here is one more thing
  // to read on a phone and cannot show the pictures anyway.

  return L.join('\n');
}

const ownerText = (n: number) =>
  !Number.isFinite(n) || n < 1
    ? null
    : n === 1
      ? '1st owner'
      : n === 2
        ? '2nd owner'
        : n === 3
          ? '3rd owner'
          : `${n}th owner`;

function insuranceText(v: SellFormValues) {
  const base = insuranceLabel(v.insuranceType);
  if (v.insuranceValidTill && (v.insuranceType === 'comprehensive' || v.insuranceType === 'third_party')) {
    return `${base} to ${formatMonth(v.insuranceValidTill)}`;
  }
  return base;
}
