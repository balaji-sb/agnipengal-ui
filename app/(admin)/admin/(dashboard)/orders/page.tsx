import React from 'react';

export const dynamic = 'force-dynamic';

import api from '@/lib/api';
import { getAuthHeaders } from '@/lib/api-server';
import OrderManager from '@/components/admin/OrderManager';

async function getOrders() {
  try {
      const headers = await getAuthHeaders();
      const res = await api.get('/orders', { headers });
      return res.data.data || [];
  } catch (error) {
      return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return <OrderManager orders={orders} />;
}
