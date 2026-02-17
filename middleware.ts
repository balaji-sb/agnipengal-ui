import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect functionality under /mahisadminpanel, excluding /login
  if (path.startsWith('/mahisadminpanel') && !path.startsWith('/mahisadminpanel/login')) {
    // Check for admin_auth_token cookie
    const adminToken =
      req.cookies.get('admin_auth_token')?.value ||
      req.cookies.get('adminToken')?.value ||
      req.cookies.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL('/mahisadminpanel/login', req.url));
    }
  }

  // Protect /vendor routes
  if (path.startsWith('/vendor') && !path.startsWith('/vendor/login')) {
    const vendorToken = req.cookies.get('vendor_token')?.value;

    if (!vendorToken) {
      return NextResponse.redirect(new URL('/vendor/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mahisadminpanel/:path*', '/vendor/:path*'],
};
