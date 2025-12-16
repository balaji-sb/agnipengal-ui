import { cookies } from 'next/headers';

// Helper to get auth headers for Server Components
export const getAuthHeaders = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const adminToken = cookieStore.get('admin_token')?.value;
    
    const cookiesList = [];
    if (token) cookiesList.push(`token=${token}`);
    if (adminToken) cookiesList.push(`admin_token=${adminToken}`);
    
    return cookiesList.length > 0 ? { Cookie: cookiesList.join('; ') } : {};
};
