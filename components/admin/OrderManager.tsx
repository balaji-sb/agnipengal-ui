'use client';

import React, { useState } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import OrderRow from './OrderRow';
import ExportOrdersButton from './ExportOrdersButton';

interface OrderManagerProps {
  orders: any[];
  pagination?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
  isVendor?: boolean;
}

export default function OrderManager({ orders, pagination, isVendor = false }: OrderManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('ALL');
  const [orderStatus, setOrderStatus] = useState('ALL');

  const filteredOrders = orders.filter((order) => {
    const term = query.toLowerCase();
    const matchesSearch =
      (order.orderId && order.orderId.toLowerCase().includes(term)) ||
      (order._id && order._id.toLowerCase().includes(term)) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(term)) ||
      (order.customer?.email && order.customer.email.toLowerCase().includes(term));

    const matchesPayment = paymentStatus === 'ALL' || order.status === paymentStatus;

    // Some orders might not have orderStatus set yet, handle gracefully if needed or assume string match
    const matchesOrder = orderStatus === 'ALL' || (order.orderStatus || 'PENDING') === orderStatus;

    return matchesSearch && matchesPayment && matchesOrder;
  });

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
        <h1 className='text-3xl font-bold text-gray-800'>Orders</h1>
        <div className='flex flex-col gap-4 w-full md:w-auto'>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Local Search Input */}
            <div className='relative w-full md:w-64'>
              <input
                type='text'
                placeholder='Search orders...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition'
              />
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
              {query && (
                <button
                  type='button'
                  onClick={() => setQuery('')}
                  className='absolute right-3 top-2.5 text-gray-400 hover:text-gray-600'
                >
                  <X className='h-5 w-5' />
                </button>
              )}
            </div>

            {/* Filters */}
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className='py-2 px-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white'
            >
              <option value='ALL'>All Payments</option>
              <option value='PAID'>Paid</option>
              <option value='PENDING'>Pending</option>
              <option value='FAILED'>Failed</option>
            </select>

            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className='py-2 px-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white'
            >
              <option value='ALL'>All Statuses</option>
              <option value='PENDING'>Pending</option>
              <option value='PROCESSING'>Processing</option>
              <option value='SHIPPED'>Shipped</option>
              <option value='DELIVERED'>Delivered</option>
              <option value='CANCELLED'>Cancelled</option>
            </select>

            <ExportOrdersButton orders={filteredOrders} />
          </div>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-left'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='p-4 font-medium text-gray-500'>Order ID</th>
              <th className='p-4 font-medium text-gray-500'>Customer</th>
              <th className='p-4 font-medium text-gray-500'>Products</th>
              <th className='p-4 font-medium text-gray-500'>Date</th>
              <th className='p-4 font-medium text-gray-500'>Payment</th>
              <th className='p-4 font-medium text-gray-500'>Order Status</th>
              <th className='p-4 font-medium text-gray-500'>Total</th>
              <th className='p-4 font-medium text-gray-500'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {filteredOrders.map((order: any) => (
              <OrderRow key={order._id} order={order} isVendor={isVendor} />
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className='p-8 text-center text-gray-500'>
            {query ? 'No orders match your search.' : 'No orders found.'}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className='mt-6 flex justify-center items-center gap-2'>
          <button
            disabled={pagination.page <= 1}
            onClick={() => router.push(`/mahisadminpanel/orders?page=${pagination.page - 1}`)}
            className='p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>
          <span className='text-sm text-gray-600 font-medium'>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => router.push(`/mahisadminpanel/orders?page=${pagination.page + 1}`)}
            className='p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition'
          >
            <ChevronRight className='w-5 h-5' />
          </button>
        </div>
      )}
    </div>
  );
}
