// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export const config = {
  matcher: ['/dashboard/:path*'],
};

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Redirect unauthenticated users
  if (!session?.user) {
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to correct role dashboard if needed
  const roleInPath = pathname.split('/')[2];
  if (roleInPath && roleInPath !== session.user.role) {
    return NextResponse.redirect(new URL(`/dashboard/${session.user.role}`, request.url));
  }

  return NextResponse.next();
}