import { cookies } from 'next/headers';

// Helper to get auth headers for Server Components
export const getAuthHeaders = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    return token ? { Cookie: `token=${token}` } : {};
};
