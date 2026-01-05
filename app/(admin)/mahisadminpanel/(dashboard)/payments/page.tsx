import React from 'react';
import api from '@/lib/api';
import { getAuthHeaders } from '@/lib/api-server';
import PaymentManager from '@/components/admin/PaymentManager';

export const dynamic = 'force-dynamic';

async function getPayments(page = 1, search = '') {
    try {
        const headers = await getAuthHeaders();
        const res = await api.get(`/payments?page=${page}&limit=10&search=${search}`, { headers });
        return {
            payments: res.data.data || [],
            stats: res.data.stats || [],
            pagination: res.data.pagination || { total: 0, pages: 1, page: 1, limit: 10 }
        };
    } catch (error) {
        return { payments: [], stats: [], pagination: { total: 0, pages: 1, page: 1, limit: 10 } };
    }
}

export default async function AdminPaymentsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;
    const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
    const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
    const { payments, stats, pagination } = await getPayments(page, search);

    return <PaymentManager payments={payments} stats={stats} pagination={pagination} search={search} />;
}
