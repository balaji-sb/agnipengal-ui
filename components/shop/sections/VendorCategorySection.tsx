'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface VendorCategory {
  _id: string;
  name: string;
  image?: string;
  description?: string;
}

interface VendorCategorySectionProps {
  categories: VendorCategory[];
  title?: string;
}

export default function VendorCategorySection({
  categories,
  title = 'Shop by Category',
}: VendorCategorySectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className='py-12 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-end mb-8'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>{title}</h2>
            <p className='text-gray-600'>Find the perfect shop for your needs</p>
          </div>
          <Link
            href='/shops'
            className='text-pink-600 font-semibold hover:text-pink-700 flex items-center transition'
          >
            View All Shops <ArrowRight className='w-4 h-4 ml-1' />
          </Link>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/shops?category=${category._id}`}
              className='group block'
            >
              <div className='bg-gray-50 rounded-2xl p-4 text-center hover:shadow-md transition-all duration-300 border border-transparent hover:border-pink-100 h-full flex flex-col items-center'>
                <div className='w-24 h-24 mb-3 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform p-3'>
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={80}
                      height={80}
                      className='object-contain'
                    />
                  ) : (
                    <div className='text-2xl font-bold text-pink-600'>
                      {category.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className='font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1'>
                  {category.name}
                </h3>
                {category.description && (
                  <p className='text-xs text-gray-500 mt-1 line-clamp-1'>{category.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
