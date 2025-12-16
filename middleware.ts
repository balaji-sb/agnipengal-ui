import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Protect /admin routes
  if (url.pathname.startsWith('/admin')) {
    // For now, let it be accessible to avoid redirect loops on login page if context isn't perfectly synced,
    // BUT we need to protect dashboard.
    // The login page is /admin/login.
    
    if (url.pathname === '/admin/login') {
        return NextResponse.next();
    }

    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
