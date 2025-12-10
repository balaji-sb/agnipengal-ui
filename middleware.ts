import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Protect /admin routes
  if (url.pathname.startsWith('/admin')) {
    // Allow public access to login page
    if (url.pathname === '/admin/login') {
        // Optional: Redirect to dashboard if already logged in? 
        // For now, let it be accessible.
        return NextResponse.next();
    }

    const token = req.cookies.get('token')?.value;

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
