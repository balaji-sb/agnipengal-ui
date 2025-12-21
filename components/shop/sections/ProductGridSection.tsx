'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

interface ProductGridSectionProps {
  title: string;
  products: any[];
  link: string;
  emptyMessage?: string;
  viewAllText?: string;
}

export default function ProductGridSection({ 
    title, 
    products, 
    link, 
    emptyMessage = 'No products found.',
    viewAllText = 'View All'
}: ProductGridSectionProps) {
  
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          {title}
        </h2>
         <Link href={link} className="flex items-center text-pink-600 font-medium hover:text-pink-700 transition">
          {viewAllText} <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>

      {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
          ))}
          </div>
      ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">{emptyMessage}</p>
           </div>
      )}
    </section>
  );
}
