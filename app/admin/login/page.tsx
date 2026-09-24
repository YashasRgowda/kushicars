import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // The REAL check — same one requireUser() uses. Doing this here instead of
  // in proxy.ts is what prevents the redirect loop: a stale cookie fails this
  // check, so we simply render the form rather than bouncing to /admin.
  const user = await getUser();
  if (user) redirect('/admin');

  return (
    <main className="grid min-h-dvh place-items-center bg-ink-950 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-white shadow-glow">
            <span className="font-display text-base font-700 leading-none tracking-tight">
              K
            </span>
          </span>
          <span className="font-display text-xl font-600 tracking-wide text-white">
            Kushi Cars<span className="text-accent">.</span>
          </span>
        </div>

        <h1 className="font-display text-3xl font-600 leading-tight text-white">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage your cars and contact details.
        </p>

        <LoginForm next={next ?? '/admin'} />

        <Link
          href="/"
          className="mt-8 block text-center text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          ← Back to the website
        </Link>
      </div>
    </main>
  );
}
