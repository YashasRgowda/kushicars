import { NextResponse, type NextRequest } from 'next/server';

/**
 * Next.js 16 renamed Middleware to Proxy. The file MUST be named proxy.ts
 * and export `proxy` — a middleware.ts here is silently ignored.
 *
 * This is an OPTIMISTIC check only: it looks for the presence of a Supabase
 * session cookie and nothing more. Proxy runs on every request, including
 * prefetches, so no network or database calls belong here.
 *
 * The real verification lives in lib/auth.ts (requireUser), which every
 * admin page and server action calls. A cookie can be forged; that check
 * cannot be bypassed.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';

  const hasSessionCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith('sb-') && c.name.includes('auth-token'));

  if (!hasSessionCookie && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // NOTE: do NOT redirect away from the login page here.
  //
  // This check is optimistic — it only sees that a cookie exists, not whether
  // its token is still valid. requireUser() does the real check. When a cookie
  // is present but expired the two disagree, and bouncing from /admin/login to
  // /admin here produced an infinite ERR_TOO_MANY_REDIRECTS loop.
  //
  // The "already signed in, skip the login form" redirect now lives in
  // app/admin/login/page.tsx, which uses the same real check.

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
