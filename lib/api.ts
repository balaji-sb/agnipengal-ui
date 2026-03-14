import axios from 'axios';

// Base URL configuration
// In development, this points to the backend server directly
const API_BASE_URL =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies (if cross-origin or same-site strict)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get auth headers for Server Components moved to lib/api-server.ts

// Cross-Subdomain Authentication Helpers
export const setCrossDomainCookie = (name: string, value: string, days = 7) => {
  if (typeof window === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();

  // Apply cookie to base domain to make it accessible across all subdomains
  const hostname = window.location.hostname;
  // If we are on localhost (e.g., mvb.localhost), base domain is usually just localhost
  // If agnipengal.com, domain should be .agnipengal.com
  let domainStr = '';
  if (hostname.includes('localhost')) {
    domainStr = '; domain=localhost';
  } else if (hostname.includes('agnipengal.com')) {
    domainStr = '; domain=.agnipengal.com';
  }

  document.cookie = name + '=' + (value || '') + expires + '; path=/' + domainStr;
};

export const getCrossDomainCookie = (name: string) => {
  if (typeof window === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const removeCrossDomainCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  // Need to clear it with the identical domain string used to set it
  const hostname = window.location.hostname;
  let domainStr = '';
  if (hostname.includes('localhost')) {
    domainStr = '; domain=localhost';
  } else if (hostname.includes('agnipengal.com')) {
    domainStr = '; domain=.agnipengal.com';
  }
  document.cookie = name + '=; Max-Age=-99999999; path=/' + domainStr;
};

api.interceptors.request.use(
  async (config) => {
    // Check for tokens
    // We check for adminToken first if the request is for admin routes (optional optimization, but simplified here)
    // Actually, we usually don't know if it's an admin request easily, but we can check the URL or just send what we have.
    // Simpler approach: Store the active token in a specific key based on context,
    // BUT since we use the same axios instance, we need to be careful.
    // Let's decide: 'authToken' for users, 'adminToken' for admins.

    // If we are in the admin portal, we might want to prioritize adminToken?
    // Or we can just try to send the token that corresponds to the likely user.
    // Since this is a single instance, we can try to look for both? No, that sends multiple.

    // Default strategy: Check 'authToken'. If not found, check 'adminToken'?
    // Risky if a user is logged in as both.

    // Better strategy: The Contexts should manage when to set the token.
    // However, for this fix, we will assume 'authToken' is key for customer app and 'adminToken' for admin app.
    // Since they are separate apps (routes), usually one is active.

    // If the path starts with /admin or /mahisadminpanel (on frontend), use adminToken?
    // Frontend doesn't know backend paths easily in interceptor if we iterate based on window.location?

    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const isAdminSection = path.startsWith('/mahisadminpanel') || path.startsWith('/admin');

      // We must be careful here. The Next.js middleware rewrites subdomain paths to "/vendor-store/...".
      // Only the true vendor dashboard is exactly "/vendor/" or "/vendor".
      const isVendorSection = path === '/vendor' || path.startsWith('/vendor/');

      let token = null;

      if (isAdminSection) {
        // Use adminToken from localStorage
        token = localStorage.getItem('adminToken');
      } else if (isVendorSection) {
        // For vendor section, we rely on HttpOnly cookies set by the backend.
        // However, on mobile browsers this can be blocked, so we use vendorToken from localStorage as fallback.
        token = localStorage.getItem('vendorToken');
      } else {
        // Standard User Auth for Shop (works for root domain AND vendor subdomains)
        // Check cross-domain cookie FIRST, fallback to localStorage for backwards compatibility
        token = getCrossDomainCookie('authToken') || localStorage.getItem('authToken');
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
