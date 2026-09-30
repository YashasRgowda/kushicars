import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';
import Wordmark from '@/components/Wordmark';

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
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-paper-100 px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] max-w-full -translate-x-1/2 rounded-full bg-accent/[0.035] blur-[150px]"
      />
      <div className="noise pointer-events-none absolute inset-0" />

      <div className="relative w-full max-w-[22rem]">
        <Wordmark variant="full" size="xl" />

        <h1 className="mt-12 font-display text-[2.4rem] font-600 leading-[1.05] text-ink-900">
          Sign in
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-stone-700">
          Your cars, your photos and your contact details — all in one place.
        </p>

        <LoginForm next={next ?? '/admin'} />

        <Link
          href="/"
          className="mt-10 block text-center text-[13px] text-muted transition-colors duration-300 hover:text-stone-800"
        >
          ← Back to the website
        </Link>
      </div>
    </main>
  );
}
