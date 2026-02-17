'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import OrderManager from '@/components/admin/OrderManager';
import { toast } from 'react-hot-toast';

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/vendor');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600'></div>
      </div>
    );
  }

  return (
    <div className='p-6 min-h-screen bg-gray-50'>
      {/* Reusing the Admin Order Manager Component */}
      {/* We pass isVendor=true to enable vendor specific tweaks if needed */}
      <OrderManager orders={orders} isVendor={true} />
    </div>
  );
}
