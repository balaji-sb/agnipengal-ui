import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  
  // Protect /mahisadminpanel routes
  if (url.pathname.startsWith('/mahisadminpanel')) {
    // For now, let it be accessible to avoid redirect loops on login page if context isn't perfectly synced,
    // BUT we need to protect dashboard.
    // The login page is /mahisadminpanel/login.
    
    if (url.pathname === '/mahisadminpanel/login') {
        return NextResponse.next();
    }

    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/mahisadminpanel/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mahisadminpanel/:path*'],
};
