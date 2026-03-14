import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;
  const hostname = req.headers.get('host') || '';

  // ─── SUBDOMAIN ROUTING ──────────────────────────────────────────────────
  const isLocalhost = hostname.includes('localhost');
  const baseDomain = isLocalhost ? 'localhost:3000' : 'agnipengal.com';

  // Remove www. for consistent parsing
  const cleanHost = hostname.replace('www.', '');

  let subdomain = null;
  if (cleanHost.endsWith(baseDomain) && cleanHost !== baseDomain) {
    subdomain = cleanHost.replace(`.${baseDomain}`, '');
  }

  const reservedSubdomains = [
    'admin',
    'api',
    'help',
    'support',
    'mail',
    'blog',
    'shop',
    'vendor',
    'www',
  ];

  // If a valid custom subdomain is detected, rewrite the URL
  if (subdomain && !reservedSubdomains.includes(subdomain)) {
    // Only rewrite the root path to the vendor store.
    // If the path is /product, /category, /cart, etc., let it render normally
    // so the vendor's customers can view products without leaving the subdomain URL context.
    const sharedRoutesPatterns = [
      '^/products(/.*)?$',
      '^/product(/.*)?$',
      '^/category(/.*)?$',
      '^/deals/?$',
      '^/collections(/.*)?$',
      '^/cart/?$',
      '^/checkout/?$',
      '^/login/?$',
      '^/register/?$',
      '^/search/?$',
      '^/profile(/.*)?$',
      '^/refer-and-earn/?$',
      '^/partnership/?$',
      '^/pages(/.*)?$', // Dynamic CMS pages wildcard
      '^/faq/?$',
      '^/account/support/?$',
    ];

    const isSharedRoute = sharedRoutesPatterns.some((pattern) => new RegExp(pattern).test(path));

    if (path === '/' || (!isSharedRoute && !path.startsWith('/_next'))) {
      url.pathname = `/vendor-store/${subdomain}${path}`;
      return NextResponse.rewrite(url);
    } else if (isSharedRoute) {
      // For shared routes like /product, /category, we append the storeSlug as a query parameter
      // so the page can filter the data for this specific vendor while reusing the same UI.
      console.log(`[Middleware] Subdomain detected: ${subdomain} on route ${path}`);
      url.searchParams.set('storeSlug', subdomain);
      console.log(`[Middleware] Rewriting to: ${url.toString()}`);
      return NextResponse.rewrite(url);
    }
  }

  // ─── ROUTE PROTECTION (For base domain) ───────────────────────────────

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
    const vendorToken = req.cookies.get('vendor_token')?.value || req.cookies.get('vendorToken')?.value;

    if (!vendorToken) {
      return NextResponse.redirect(new URL('/vendor/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (client-side routing data)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images, icons, etc (public files)
     */
    '/((?!api|_next/static|_next/image|_next/data|images|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
