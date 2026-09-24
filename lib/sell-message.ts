import { formatNumber, formatPrice } from '@/lib/format';
import { formatMonth, formatRtoCode } from '@/lib/validation';
import {
  accidentLabel,
  insuranceLabel,
  loanLabel,
  rcLabel,
  serviceLabel,
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
export function buildSellMessage(v: SellFormValues, ref: string, business: string): string {
  const L: string[] = [];
  const push = (label: string, ...parts: (string | null | undefined | false)[]) => {
    const body = parts.filter(Boolean).join(' · ');
    if (body) L.push(`*${label}:* ${body}`);
  };

  L.push(`*New car to sell — ${business}*`);
  L.push(`Ref: ${ref}`);
  L.push('');

  const carLine = [v.yearMfg, v.brand, v.model, v.variant].filter(Boolean).join(' ');
  push('Car', carLine, v.fuel || null, v.transmission || null, v.body || null);

  push(
    'Run',
    v.kmDriven ? `${formatNumber(Number(v.kmDriven))} km` : null,
    ownerText(Number(v.owners)),
    v.rtoCode ? formatRtoCode(v.rtoCode) : null,
    v.yearReg && v.yearReg !== v.yearMfg ? `Reg ${v.yearReg}` : null,
  );

  push(
    'Papers',
    insuranceText(v),
    rcLabel(v.rcStatus),
    loanLabel(v.loanStatus),
    `${v.keysCount} ${Number(v.keysCount) === 1 ? 'key' : 'keys'}`,
    v.pendingChallans ? 'Challans pending' : null,
    v.fuel === 'CNG' ? (v.cngEndorsedOnRc ? 'CNG on RC' : 'CNG NOT on RC') : null,
  );

  push('History', accidentLabel(v.accidentHistory), serviceLabel(v.serviceHistory));

  if (v.knownIssues.trim()) push('Issues', v.knownIssues.trim());

  if (v.expectedPrice) push('Expects', formatPrice(Number(v.expectedPrice)));
  if (v.reasonForSelling.trim()) push('Selling because', v.reasonForSelling.trim());

  L.push('');
  push(
    'Seller',
    v.name.trim(),
    v.phone,
    !v.whatsappSame && v.whatsapp ? `WA ${v.whatsapp}` : null,
    v.email.trim() || null,
  );
  push('Location', v.locality.trim() || null, v.pincode || null);
  push('Prefers', v.preferredSlot);
  if (v.photos.length) push('Photos', `${v.photos.length} uploaded on the website`);

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
