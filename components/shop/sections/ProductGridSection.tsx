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
    viewAllText = 'View Collection'
}: ProductGridSectionProps) {
  
  return (
    <section className="container mx-auto px-4 py-0">
      <MotionSection>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pt-16">
          <div>
             <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                {title}
             </h2>
             <div className="h-1 w-20 bg-pink-500 rounded-full" />
          </div>
          
           <Link href={link} className="inline-flex items-center px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 font-bold hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all text-sm group">
            {viewAllText} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">{emptyMessage}</p>
             </div>
        )}
      </MotionSection>
    </section>
  );
}
