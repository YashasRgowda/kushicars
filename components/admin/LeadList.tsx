'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MessageCircle, Phone, Trash2 } from 'lucide-react';
import type { BuyerLead, SellLead } from '@/lib/leads';
import type { Settings } from '@/lib/types';
import { formatNumber, formatPrice } from '@/lib/format';
import { formatMonth, formatRegNumber } from '@/lib/validation';
import { insuranceLabel, loanLabel, rcLabel } from '@/lib/sell';
import { messages, telHref, waTo } from '@/lib/whatsapp';
import { EASE } from '@/components/ui/motion';

/**
 * Who has written in.
 *
 * A row per person, closed. Name, number, what it is about — which is all
 * the owner needs to decide whether to ring them. Open one and the whole
 * answer set is there, photographs and all.
 *
 * Two buttons, and they are the two things he ever does: message them, or
 * get rid of it. No statuses, no stages, no pipeline.
 */
type Tab = 'buying' | 'selling';

export default function LeadList({
  sellers,
  buyers,
  settings,
  onDeleteSeller,
  onDeleteBuyer,
}: {
  sellers: SellLead[];
  buyers: BuyerLead[];
  settings: Settings;
  onDeleteSeller: (id: string) => Promise<void>;
  onDeleteBuyer: (id: string) => Promise<void>;
}) {
  /**
   * Two kinds of enquiry, and they are not the same job.
   *
   * Somebody buying wants a call about a car on the floor; somebody selling
   * wants an inspection booked. They used to sit in one scroll, one list
   * under the other, which meant the owner read past every seller to reach
   * the buyers. Splitting them is what makes this a work queue rather than
   * a feed.
   *
   * Buying opens first — it is the one with a car waiting on an answer.
   */
  const [tab, setTab] = useState<Tab>(buyers.length === 0 && sellers.length > 0 ? 'selling' : 'buying');

  if (sellers.length === 0 && buyers.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-line px-8 py-20 text-center">
        <p className="font-display text-2xl font-600 text-ink-900">Nothing yet</p>
        <p className="mx-auto mt-3 max-w-sm text-pretty text-[15px] leading-relaxed text-stone-700">
          When somebody fills in a form on the website — asking about a car,
          or selling theirs — it lands here.
        </p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'buying', label: 'Buying a car', count: buyers.length },
    { id: 'selling', label: 'Selling their car', count: sellers.length },
  ];

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Enquiry type"
        className="inline-flex rounded-full border border-line bg-paper-200 p-1"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition-colors duration-300 sm:px-5 ${
                active ? 'bg-accent text-white shadow-card' : 'text-stone-700 hover:text-ink-900'
              }`}
            >
              {t.label}
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 font-mono text-[10px] tabular-nums ${
                  active ? 'bg-white/20 text-white' : 'bg-paper text-stone-700'
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {tab === 'buying' ? (
          buyers.length === 0 ? (
            <EmptyTab what="No one has asked about a car yet." />
          ) : (
            <ul className="space-y-2.5">
              {buyers.map((lead) => (
                <li key={lead.id}>
                  <BuyerRow lead={lead} settings={settings} onDelete={onDeleteBuyer} />
                </li>
              ))}
            </ul>
          )
        ) : sellers.length === 0 ? (
          <EmptyTab what="Nobody has offered us a car yet." />
        ) : (
          <ul className="space-y-2.5">
            {sellers.map((lead) => (
              <li key={lead.id}>
                <SellerRow lead={lead} settings={settings} onDelete={onDeleteSeller} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EmptyTab({ what }: { what: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-8 py-14 text-center">
      <p className="text-[15px] text-stone-700">{what}</p>
    </div>
  );
}

/* ==================================================================
   Shared furniture
   ================================================================== */

function Shell({
  title,
  subtitle,
  chip,
  when,
  open,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  chip?: string;
  when: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-paper transition-colors duration-300 ${
        open ? 'border-line-strong' : 'border-line-soft hover:border-line'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-display text-lg font-600 leading-tight text-ink-900">
              {title}
            </span>
            {chip && (
              <span className="rounded-full bg-paper-200 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-stone-800">
                {chip}
              </span>
            )}
          </span>
          <span className="mt-1.5 block truncate text-[13px] text-stone-700">
            {subtitle}
          </span>
        </span>

        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:block">
          {when}
        </span>
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 shrink-0 text-stone-600 transition-transform duration-300 ease-premium ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-line-soft p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Actions({
  wa,
  phone,
  onDelete,
  what,
}: {
  wa: string | null;
  phone: string;
  onDelete: () => void;
  what: string;
}) {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-line-soft pt-5">
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-[13px] font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium hover:scale-[1.03]"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
          WhatsApp them
        </a>
      )}
      <a
        href={telHref(phone)}
        className="flex items-center gap-2 rounded-full border border-line px-5 py-3 text-[13px] text-stone-800 transition-colors duration-300 hover:border-line-strong hover:text-ink-900"
      >
        <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
        <span className="tabular-nums">{phone}</span>
      </a>
      <button
        type="button"
        onClick={() => {
          if (
            window.confirm(
              `Delete ${what}? This cannot be undone — the details and any photographs go for good.`,
            )
          ) {
            onDelete();
          }
        }}
        className="ml-auto flex items-center gap-2 rounded-full px-4 py-3 text-[13px] text-stone-600 transition-colors duration-300 hover:bg-danger-wash hover:text-danger-ink"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
        Delete
      </button>
    </div>
  );
}

function Facts({ rows }: { rows: [string, string | null | undefined][] }) {
  const shown = rows.filter(([, v]) => v);
  if (shown.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
      {shown.map(([label, value]) => (
        <div key={label}>
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-stone-600">
            {label}
          </dt>
          <dd className="mt-1.5 text-[14px] leading-snug text-ink-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** "Today", "Yesterday", "3 Feb" — enough to know if it is warm or cold. */
function when(iso: string): string {
  const then = new Date(iso);
  const days = Math.floor((Date.now() - then.getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ==================================================================
   Somebody selling us their car
   ================================================================== */

function SellerRow({
  lead,
  settings,
  onDelete,
}: {
  lead: SellLead;
  settings: Settings;
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  const wa = waTo(
    lead.whatsapp ?? lead.phone,
    messages.toSeller(settings.businessName, lead.name, lead.car),
  );

  return (
    <Shell
      title={lead.name}
      subtitle={`${lead.car} · ${formatNumber(lead.kmDriven)} km`}
      chip={lead.ref}
      when={when(lead.createdAt)}
      open={open}
      onToggle={() => setOpen((v) => !v)}
    >
      <Facts
        rows={[
          ['The car', lead.car],
          ['Run', `${formatNumber(lead.kmDriven)} km`],
          ['Owners', String(lead.owners)],
          ['Fuel', lead.fuel],
          ['Gearbox', lead.transmission],
          ['Body', lead.body],
          ['Car number', lead.regNumber ? formatRegNumber(lead.regNumber) : null],
          ['Registered in', lead.regState],
          [
            'Insurance',
            lead.insuranceValidTill
              ? `${insuranceLabel(lead.insuranceType)} to ${formatMonth(
                  lead.insuranceValidTill.slice(0, 7),
                )}`
              : insuranceLabel(lead.insuranceType),
          ],
          ['RC', rcLabel(lead.rcStatus)],
          ['Loan', loanLabel(lead.loanStatus)],
          [
            'Wants',
            lead.expectedPrice ? formatPrice(lead.expectedPrice) : null,
          ],
          ['Free for', lead.preferredSlot],
          [
            'Where',
            [lead.locality, lead.pincode].filter(Boolean).join(' · ') || null,
          ],
          ['Email', lead.email],
        ]}
      />

      {lead.knownIssues && (
        <div className="mt-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-stone-600">
            They mentioned
          </p>
          <p className="mt-2 text-pretty text-[14px] leading-relaxed text-stone-800">
            {lead.knownIssues}
          </p>
        </div>
      )}

      {lead.reasonForSelling && (
        <div className="mt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-stone-600">
            Selling because
          </p>
          <p className="mt-2 text-pretty text-[14px] leading-relaxed text-stone-800">
            {lead.reasonForSelling}
          </p>
        </div>
      )}

      {lead.photoUrls.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-stone-600">
            Their photos · {lead.photoUrls.length}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {lead.photoUrls.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-xl border border-line bg-paper-300 transition-colors hover:border-line-strong"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      <Actions
        wa={wa}
        phone={lead.phone}
        what={`${lead.name}'s ${lead.car}`}
        onDelete={() => onDelete(lead.id)}
      />
    </Shell>
  );
}

/* ==================================================================
   Somebody interested in buying
   ================================================================== */

const KIND_LABEL: Record<BuyerLead['kind'], string> = {
  test_drive: 'Test drive',
  callback: 'Callback',
  general: 'Message',
};

function BuyerRow({
  lead,
  settings,
  onDelete,
}: {
  lead: BuyerLead;
  settings: Settings;
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  const wa = waTo(
    lead.phone,
    messages.toBuyer(settings.businessName, lead.name, lead.carLabel),
  );

  return (
    <Shell
      title={lead.name}
      subtitle={lead.carLabel ?? lead.message ?? 'No particular car'}
      chip={KIND_LABEL[lead.kind]}
      when={when(lead.createdAt)}
      open={open}
      onToggle={() => setOpen((v) => !v)}
    >
      <Facts
        rows={[
          ['About', lead.carLabel],
          ['Asked for', KIND_LABEL[lead.kind]],
          ['Free for', lead.preferredSlot],
          ['Email', lead.email],
          ['Reference', lead.ref],
        ]}
      />

      {lead.message && (
        <div className="mt-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-stone-600">
            They wrote
          </p>
          <p className="mt-2 text-pretty text-[14px] leading-relaxed text-stone-800">
            {lead.message}
          </p>
        </div>
      )}

      <Actions
        wa={wa}
        phone={lead.phone}
        what={`the enquiry from ${lead.name}`}
        onDelete={() => onDelete(lead.id)}
      />
    </Shell>
  );
}
