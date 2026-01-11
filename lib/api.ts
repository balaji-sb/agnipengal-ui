import axios from 'axios';

// Base URL configuration
// In development, this points to the backend server directly
const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies (if cross-origin or same-site strict)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get auth headers for Server Components moved to lib/api-server.ts

api.interceptors.request.use(async (config) => {
    // Check for tokens in localStorage
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
        const isAdminSection = path.startsWith('/mahisadminpanel');
        let token = null;

        if (isAdminSection) {
            // Only load NextAuth session if we are in admin section
            const { getSession } = await import('next-auth/react');
            const session = await getSession();
            if (session?.user?.token) {
                token = session.user.token;
            }
        } else {
            // Standard User Auth for Shop
            token = localStorage.getItem('authToken');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
