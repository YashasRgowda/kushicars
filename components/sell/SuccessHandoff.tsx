'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { MessageCircle } from 'lucide-react';
import type { Settings } from '@/lib/types';
import { emptySellForm, type SellFormValues } from '@/lib/sell';
import { buildSellMessage } from '@/lib/sell-message';
import { waLink } from '@/lib/whatsapp';
import { LAST_KEY, clearDraft } from './draft';

/**
 * The WhatsApp hand-off after a sell request is submitted.
 *
 * The lead is already safely in the database by the time this renders. This
 * button is what gets it onto the owner's phone in the next ten seconds,
 * formatted so he can read it at a glance — which, until the admin panel
 * exists, is the only way he sees a lead at all.
 *
 * The answers are read back from sessionStorage rather than the URL: a phone
 * number and a home locality have no business in a link that gets pasted,
 * logged and shared. If the tab was closed in between, we fall back to a
 * message that quotes the reference number.
 */
export default function SuccessHandoff({
  settings,
  reference,
}: {
  settings: Settings;
  reference: string;
}) {
  // sessionStorage is an external store, and it does not exist while this
  // renders on the server. useSyncExternalStore is the SSR-safe way to read
  // one: the server snapshot is null, the client's is the stored draft, and
  // React reconciles the two without a hydration mismatch. Nothing ever
  // changes it while this page is open, so subscribe is a no-op.
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

  const values = parseDraft(raw);

  // The lead is saved by the time this page renders, so the in-progress
  // draft has done its job. Clearing it here rather than at submit time is
  // what keeps a failed submission from emptying the form.
  useEffect(() => clearDraft(), []);

  const message = values
    ? buildSellMessage(values, reference, settings.businessName)
    : `Hi ${settings.businessName}, I have just submitted my car details on your website.\n\nRef: ${reference}\n\nPlease let me know the next step.`;

  const href = waLink(settings, message);
  if (!href) return null;

  return (
    <div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
        Send the details on WhatsApp
      </a>
      <p className="mt-4 max-w-md text-[13px] leading-relaxed text-slate-500">
        Optional, but it is the fastest route — the showroom sees it
        immediately and can reply without waiting for someone to check the
        system.
      </p>
    </div>
  );
}

function parseDraft(raw: string | null): SellFormValues | null {
  if (!raw) return null;
  try {
    return { ...emptySellForm(), ...(JSON.parse(raw) as Partial<SellFormValues>) };
  } catch {
    // A draft written by an older version of the form. Fall back to the
    // short message that quotes only the reference number.
    return null;
  }
}
