import React from 'react';
// import dbConnect from '@/lib/db';
// import OrderModel from '@/lib/models/Order';

export const dynamic = 'force-dynamic';

import api from '@/lib/api';
import { getAuthHeaders } from '@/lib/api-server';

// ...

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Orders</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th className="p-4 font-medium text-gray-500">Order ID</th>
                    <th className="p-4 font-medium text-gray-500">Customer</th>
                    <th className="p-4 font-medium text-gray-500">Date</th>
                    <th className="p-4 font-medium text-gray-500">Status</th>
                     <th className="p-4 font-medium text-gray-500">Total</th>
                    <th className="p-4 font-medium text-gray-500">Items</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                        <td className="p-4 text-sm font-mono text-gray-500">{order._id.substring(0, 8)}...</td>
                        <td className="p-4">
                            <p className="font-medium text-gray-900">{order.customer.name}</p>
                            <p className="text-sm text-gray-500">{order.customer.mobile}</p>
                        </td>
                         <td className="p-4 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {order.status}
                            </span>
                        </td>
                         <td className="p-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                        <td className="p-4 text-sm text-gray-500">
                            {order.items.length} items
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
}
