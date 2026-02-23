'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Store } from 'lucide-react';

export default function SuccessPage() {
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const storedIds = sessionStorage.getItem('confirmedOrderIds');
    const storedCount = sessionStorage.getItem('confirmedOrderCount');
    if (storedIds) {
      try {
        const ids = JSON.parse(storedIds);
        setOrderIds(ids);
        setOrderCount(Number(storedCount) || ids.length);
      } catch {
        setOrderIds([]);
      }
      // Clear after reading
      sessionStorage.removeItem('confirmedOrderIds');
      sessionStorage.removeItem('confirmedOrderCount');
    }
  }, []);

  const isMultiOrder = orderIds.length > 1;

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-16'>
      <div className='max-w-lg w-full text-center'>
        {/* Animated checkmark */}
        <div className='relative inline-flex mb-8'>
          <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-14 h-14 text-green-500' />
          </div>
          <div className='absolute -top-1 -right-1 w-7 h-7 bg-pink-400 rounded-full flex items-center justify-center'>
            <span className='text-white text-xs font-bold'>✓</span>
          </div>
        </div>

        <h1 className='text-3xl font-extrabold text-gray-900 mb-3'>Order Confirmed! 🎉</h1>
        <p className='text-gray-500 mb-8 text-base leading-relaxed'>
          {isMultiOrder
            ? `Your cart has been split into ${orderCount} separate orders — one per vendor. Each will be fulfilled and shipped independently.`
            : 'Thank you for your purchase. Your order has been placed successfully and will be shipped soon.'}
        </p>

        {/* Per-vendor order pills */}
        {orderIds.length > 0 && (
          <div className={`mb-8 space-y-3 ${isMultiOrder ? 'text-left' : ''}`}>
            {isMultiOrder && (
              <div className='flex items-center gap-2 mb-4'>
                <Store className='w-4 h-4 text-pink-500' />
                <p className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>
                  Your {orderCount} Vendor Orders
                </p>
              </div>
            )}
            {orderIds.map((oid, idx) => (
              <Link
                key={oid}
                href={`/profile/orders/${oid}`}
                className='flex items-center justify-between bg-white border border-gray-100 shadow-sm rounded-xl px-5 py-4 hover:border-pink-200 hover:shadow-md transition group'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 bg-pink-50 rounded-full flex items-center justify-center group-hover:bg-pink-100 transition'>
                    <Package className='w-4 h-4 text-pink-500' />
                  </div>
                  <div className='text-left'>
                    <p className='font-semibold text-gray-900 text-sm'>
                      {isMultiOrder ? `Order ${idx + 1}` : 'Your Order'}
                    </p>
                    <p className='text-xs text-gray-400 font-mono'>
                      #{oid.toString().substring(0, 12)}…
                    </p>
                  </div>
                </div>
                <ArrowRight className='w-4 h-4 text-gray-400 group-hover:text-pink-500 transition' />
              </Link>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <Link
            href='/profile/orders'
            className='flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-700 transition shadow-md'
          >
            <Package className='w-4 h-4' />
            View All Orders
          </Link>
          <Link
            href='/'
            className='flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition'
          >
            <ShoppingBag className='w-4 h-4' />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
