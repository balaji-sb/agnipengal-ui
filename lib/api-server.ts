import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';


import { cookies } from 'next/headers';

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken')?.value || cookieStore.get('admin_auth_token')?.value || cookieStore.get('admin_token')?.value;

    const headers: Record<string, string> = {};

    if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
        return headers;
    }

    const session = await getServerSession(authOptions);
    if (session?.user?.token) {
        headers['Authorization'] = `Bearer ${session.user.token}`;
    } else {
        // console.warn('No active session found in server component request.');
    }

    return headers;
};

const api = {
    get: async (url: string) => {
        const fullUrl = `${API_BASE_URL}${url}`;
        const headers = await getAuthHeaders();
        const res = await fetch(fullUrl, {
            headers: { 
                ...headers, 
                'Content-Type': 'application/json' 
            },
            cache: 'no-store'
        });
        return {
            data: await res.json()
        };
    }
}

export default api;
