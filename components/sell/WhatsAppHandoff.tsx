'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS } from '@/lib/business';
import { emptySellForm, type SellFormValues } from '@/lib/sell';
import { buildSellMessage } from '@/lib/sell-message';
import { waTo } from '@/lib/whatsapp';
import { LAST_KEY, clearDraft } from './draft';

/**
 * The guaranteed way for the details to reach the phone.
 *
 * Pressing "Get my quote" already tries to open WhatsApp, and usually does.
 * But a browser is entitled to refuse any tab a script asks for, and when it
 * refuses it does so silently — the seller is told their request has gone,
 * the row is saved, and nothing arrives. That happened, which is why this
 * exists: one button, on the page they land on, that cannot be blocked
 * because they tap it themselves.
 *
 * Reads the answers back from sessionStorage rather than the URL: a phone
 * number and a home locality have no business in a link that gets pasted,
 * logged and shared. If the tab was closed in between, it falls back to a
 * short message and the owner rings them from the panel instead.
 */
export default function WhatsAppHandoff() {
  // sessionStorage is an external store and does not exist while this
  // renders on the server. useSyncExternalStore is the SSR-safe way to read
  // one: the server snapshot is null, the client's is the stored copy, and
  // React reconciles the two without a hydration mismatch.
  const raw = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return sessionStorage.getItem(LAST_KEY);
      } catch {
        return null;
      }
    },
    () => null,
  );

  // The lead is saved by the time this page renders, so the in-progress
  // draft has done its job.
  useEffect(() => clearDraft(), []);

  const values = parse(raw);
  const message = values
    ? buildSellMessage(values, null, BUSINESS.name)
    : `Hi ${BUSINESS.name}, I have just submitted my car details on your website.`;

  const href = waTo(BUSINESS.sellLeadsWhatsapp, message);
  if (!href) return null;

  return (
    <div className="mt-10 rounded-2xl border border-line bg-paper p-6 sm:p-7">
      <p className="text-[15px] leading-relaxed text-ink-900">
        WhatsApp should have opened with your details already.
      </p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-stone-700">
        If it did not, tap below — it takes a second and saves us a call.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
        Send on WhatsApp
      </a>
    </div>
  );
}

function parse(raw: string | null): SellFormValues | null {
  if (!raw) return null;
  try {
    return { ...emptySellForm(), ...(JSON.parse(raw) as Partial<SellFormValues>) };
  } catch {
    // Written by an older shape of the form. Fall back to the short message.
    return null;
  }
}
