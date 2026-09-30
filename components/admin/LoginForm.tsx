'use client';

import { useActionState } from 'react';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { signIn, type AuthState } from '@/app/admin/actions';
import { TextField } from '@/components/form/fields';

export default function LoginForm({ next = '/admin' }: { next?: string }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    {},
  );

  return (
    <form action={formAction} className="mt-10 space-y-5">
      <input type="hidden" name="next" value={next} />

      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        required
        placeholder="you@kushicars.in"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-danger-line bg-danger-wash px-4 py-3 text-[13px] leading-relaxed text-danger-ink"
        >
          <AlertCircle className="mt-px h-4 w-4 shrink-0" strokeWidth={1.8} />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-accent py-4 text-sm font-500 text-white shadow-lift-accent transition-transform duration-300 ease-premium disabled:cursor-wait disabled:opacity-60 disabled:shadow-none enabled:hover:scale-[1.02]"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
              strokeWidth={1.8}
            />
          </>
        )}
      </button>
    </form>
  );
}
