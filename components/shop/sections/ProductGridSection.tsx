'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import MotionSection from '@/components/shop/MotionSection';

interface ProductGridSectionProps {
  title: string;
  products: any[];
  link: string;
  emptyMessage?: string;
  viewAllText?: string;
}

// ... (props interface)

// ... (props interface)

export default function ProductGridSection({
  title,
  products,
  link,
  emptyMessage = 'No products found.',
  viewAllText = 'View Collection',
}: ProductGridSectionProps) {
  return (
    <section className='container mx-auto px-4 py-0'>
      <MotionSection>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pt-4'>
          <div className='space-y-2'>
            <h2 className='text-3xl md:text-4xl font-black text-gray-900 tracking-tight'>
              {title}
            </h2>
            <div className='h-1.5 w-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full' />
          </div>

          <Link
            href={link}
            className='inline-flex items-center px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 font-bold bg-white shadow-sm hover:border-red-200 hover:text-red-700 transition-all text-[13px] uppercase tracking-wider group'
          >
            {viewAllText}{' '}
            <ArrowRight className='ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform' />
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className='text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200'>
            <p className='text-gray-400 font-medium'>{emptyMessage}</p>
          </div>
        )}
      </MotionSection>
    </section>
  );
}
