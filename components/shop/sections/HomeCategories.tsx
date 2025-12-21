'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CategoryCard from '@/components/shop/CategoryCard';

interface HomeCategoriesProps {
  categories: any[];
  title?: string;
}

export default function HomeCategories({ categories, title = 'Shop by Category' }: HomeCategoriesProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          {title}
        </h2>
        <Link href="/category" className="flex items-center text-pink-600 font-medium hover:text-pink-700 transition">
          View All <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
      
      {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat: any) => (
              <CategoryCard key={cat._id} category={cat} />
          ))}
          </div>
      ) : (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">Categories coming soon.</p>
           </div>
      )}
    </section>
  );
}
