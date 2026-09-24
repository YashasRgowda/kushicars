'use client';

import { emptySellForm, type SellFormValues } from '@/lib/sell';

/**
 * The in-progress answers, kept in sessionStorage.
 *
 * sessionStorage rather than localStorage: a half-finished form holds a phone
 * number and a home locality, and it has no business outliving the tab.
 *
 * The read is a one-shot, cached at module level. That matters because the
 * wizard reads it through useSyncExternalStore — the SSR-safe way to read an
 * external store — and a snapshot that changed on every call would spin.
 * Nothing but this tab's own wizard ever writes it, and the wizard already
 * holds the newer value in React state, so re-reading would tell us nothing.
 */
export const DRAFT_KEY = 'kushi:sell:draft';
export const LAST_KEY = 'kushi:sell:last';

let snapshot: string | null = null;
let read = false;

export function subscribe(): () => void {
  // Nothing outside this tab changes the draft, so there is nothing to
  // subscribe to. The unsubscribe is what React expects back.
  return () => {};
}

export function getSnapshot(): string | null {
  if (!read) {
    read = true;
    try {
      snapshot = sessionStorage.getItem(DRAFT_KEY);
    } catch {
      snapshot = null; // Private mode, or storage disabled.
    }
  }
  return snapshot;
}

/** No storage on the server — the wizard renders empty, then fills on mount. */
export const getServerSnapshot = (): string | null => null;

export function parseDraft(raw: string | null): Partial<SellFormValues> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<SellFormValues>;
  } catch {
    return {}; // Written by an older shape of the form. Start clean.
  }
}

export function writeDraft(payload: string) {
  try {
    sessionStorage.setItem(DRAFT_KEY, payload);
    snapshot = payload;
  } catch {
    // The form still works; it just will not survive a refresh.
  }
}

/**
 * Hands the answers to the success page.
 *
 * It deliberately does NOT clear the draft. The wizard's answers are derived
 * from the draft, so wiping it here would empty the form the instant Submit
 * was pressed — and if the request then failed, the seller would be staring
 * at a blank step 1 with everything they typed gone. The draft is cleared on
 * the success page instead, which only renders once a row actually landed.
 */
export function completeDraft(payload: string) {
  try {
    sessionStorage.setItem(LAST_KEY, payload);
  } catch {
    // The reference number on the success page still works without it.
  }
}

/** Called from the success page, once the lead is safely saved. */
export function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to do. A stale draft is harmless — the next submission
    // overwrites it.
  }
}

export const withDraft = (
  draft: Partial<SellFormValues>,
  edits: Partial<SellFormValues>,
): SellFormValues => ({ ...emptySellForm(), ...draft, ...edits });
