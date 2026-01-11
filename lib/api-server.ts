import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';


export const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const session = await getServerSession(authOptions);
    const headers: Record<string, string> = {};

    if (session?.user?.token) {
        headers['Authorization'] = `Bearer ${session.user.token}`;
    } else {
        console.warn('No active session found in server component request.');
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
