import React from 'react';

export const dynamic = 'force-dynamic';

import api from '@/lib/api';
import { getAuthHeaders } from '@/lib/api-server';
import OrderManager from '@/components/admin/OrderManager';

async function getOrders(page = 1) {
  try {
      const headers = await getAuthHeaders();
      const res = await api.get(`/orders?page=${page}&limit=10`, { headers });
      console.log(res.data);
      return { 
          orders: res.data.data || [], 
          pagination: res.data.pagination || { total: 0, pages: 1, page: 1, limit: 10 } 
      };
  } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
      }
      return { orders: [], pagination: { total: 0, pages: 1, page: 1, limit: 10 } };
  }
}

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;
    const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
    const { orders, pagination } = await getOrders(page);

    return <OrderManager orders={orders} pagination={pagination} />;
}
