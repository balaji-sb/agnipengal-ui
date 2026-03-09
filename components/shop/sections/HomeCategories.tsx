'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CategoryCard from '@/components/shop/CategoryCard';
import MotionSection from '@/components/shop/MotionSection';
import Image from 'next/image';

interface HomeCategoriesProps {
  categories: any[];
  title?: string;
}

export default function HomeCategories({
  categories,
  title = 'Shop by Category',
}: HomeCategoriesProps) {
  return (
    <section className='container mx-auto px-4 py-10'>
      <MotionSection>
        <div className='flex items-center justify-between mb-8 md:mb-12 gap-2'>
          <div className='space-y-1 md:space-y-2'>
            <h2 className='text-xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight'>
              {title}
            </h2>
            <div className='h-1 w-12 md:h-1.5 md:w-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full' />
          </div>
          <Link
            href='/category'
            className='flex items-center gap-2 group text-gray-500 hover:text-red-700 font-bold transition-colors'
          >
            <span className='hidden sm:inline text-sm md:text-base'>View All Categories</span>
            <span className='sm:hidden text-xs'>View All</span>
            <span className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center group-hover:bg-red-50 group-hover:border-red-100 transition-all shrink-0'>
              <ArrowRight className='w-3 h-3 md:w-4 md:h-4 text-gray-600 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all outline-none' />
            </span>
          </Link>
        </div>

        {categories && categories.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8'>
            {categories.map((cat: any, index: number) => (
              <Link
                href={`/category/${cat.slug}`}
                key={cat._id}
                className='group flex flex-col items-center'
              >
                <div className='relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden mb-5 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-4 ring-white group-hover:ring-red-100 group-hover:shadow-[0_8px_30px_rgb(220,38,38,0.15)] transition-all duration-500'>
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:scale-110'
                    />
                  ) : (
                    <Image
                      src='/logo.jpg'
                      alt={cat.name}
                      fill
                      className='object-contain p-8 opacity-50 bg-white group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500'
                    />
                  )}
                  <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/30 group-hover:to-red-900/40 transition-colors duration-500' />
                </div>
                <h3 className='text-[15px] font-bold text-center text-gray-900 group-hover:text-red-700 transition-colors px-2'>
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200'>
            <p className='text-gray-400 font-medium'>Categories coming soon.</p>
          </div>
        )}
      </MotionSection>
    </section>
  );
}
