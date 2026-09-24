'use client';

import { useActionState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { signIn, type AuthState } from '@/app/admin/actions';

export default function LoginForm({ next = '/admin' }: { next?: string }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    {},
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-xs uppercase tracking-wider text-slate-400"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/40"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs uppercase tracking-wider text-slate-400"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-white outline-none transition-colors focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/40"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-glow"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-500 text-white shadow-glow transition-transform disabled:opacity-60 disabled:shadow-none enabled:hover:scale-[1.02]"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Sign in
          </>
        )}
      </button>
    </form>
  );
}
