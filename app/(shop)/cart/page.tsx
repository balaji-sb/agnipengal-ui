'use client';

import React from 'react';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  const handleRemove = (productId: string, variantId?: string, productName?: string) => {
    const confirmed = window.confirm(`Remove "${productName || 'this item'}" from your cart?`);
    if (confirmed) {
      removeItem(productId, variantId);
    }
  };

  if (items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-20 text-center'>
        <h2 className='text-3xl font-bold mb-4'>Your Cart is Empty</h2>
        <p className='text-gray-500 mb-8'>Looks like you haven't added anything yet.</p>
        <Link
          href='/products'
          className='inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition'
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold mb-8'>Shopping Cart</h1>

      <div className='flex flex-col lg:flex-row gap-12'>
        {/* Cart Items */}
        <div className='flex-1 space-y-6'>
          {items.map((item) => {
            const compositeKey = item.variant
              ? `${item.product._id}-${item.variant._id}`
              : item.product._id;
            const displayPrice = item.variant
              ? item.variant.price
              : item.product.offerPrice > 0
                ? item.product.offerPrice
                : item.product.price;

            return (
              <div
                key={compositeKey}
                className='flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100'
              >
                <div className='relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0'>
                  <Image
                    src={(item.variant?.image || item.product.images?.[0]) ?? '/logo.jpg'}
                    alt={item.product.name}
                    fill
                    className='object-cover'
                  />
                </div>

                <div className='flex-1 text-center sm:text-left'>
                  <h3 className='text-lg font-semibold text-gray-900'>{item.product.name}</h3>
                  {item.variant && (
                    <p className='text-sm text-pink-600 font-medium mt-0.5'>{item.variant.name}</p>
                  )}
                  <p className='text-gray-500 text-sm'>{item.product.category?.name}</p>
                  <p className='text-pink-600 font-bold mt-1'>₹{displayPrice}</p>
                  {item.variant?.sku && (
                    <p className='text-xs text-gray-400 font-mono mt-0.5'>
                      SKU: {item.variant.sku}
                    </p>
                  )}
                </div>

                <div className='flex items-center border border-gray-300 rounded-lg'>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className='p-2 hover:bg-gray-50 transition'
                  >
                    <Minus className='w-4 h-4' />
                  </button>
                  <span className='w-10 text-center font-medium'>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className='p-2 hover:bg-gray-50 transition'
                    disabled={
                      item.quantity >= (item.variant ? item.variant.stock : item.product.stock)
                    }
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleRemove(
                      item.product._id,
                      item.variant?._id,
                      item.product.name + (item.variant ? ` (${item.variant.name})` : ''),
                    )
                  }
                  className='p-2 text-gray-400 hover:text-red-500 transition'
                  title='Remove item'
                >
                  <Trash2 className='w-5 h-5' />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className='w-full lg:w-96 flex-shrink-0'>
          <div className='bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-24'>
            <h2 className='text-xl font-bold mb-6'>Order Summary</h2>

            <div className='space-y-4 mb-6'>
              <div className='flex justify-between text-gray-600'>
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className='border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900'>
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              href='/checkout'
              className='block w-full py-4 text-center bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
            >
              Proceed to Checkout <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
