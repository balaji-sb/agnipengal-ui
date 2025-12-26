import { cookies } from 'next/headers';

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

// Helper to get auth headers for Server Components
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const adminToken = cookieStore.get('admin_token')?.value;
    
    const cookiesList = [];
    if (token) cookiesList.push(`token=${token}`);
    if (adminToken) cookiesList.push(`admin_token=${adminToken}`);
    
    return cookiesList.length > 0 ? { Cookie: cookiesList.join('; ') } : {};
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
