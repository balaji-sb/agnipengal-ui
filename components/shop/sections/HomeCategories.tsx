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

export default function HomeCategories({ categories, title = 'Shop by Category' }: HomeCategoriesProps) {
  return (
    <section className="container mx-auto px-4 py-20">
      <MotionSection>
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              {title}
            </h2>
            <div className="h-1 w-20 bg-pink-500 rounded-full" />
          </div>
          <Link href="/category" className="hidden md:flex items-center gap-2 group text-gray-500 hover:text-pink-600 font-medium transition-colors">
            View All Categories 
            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
               <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
        
        {categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat: any, index: number) => (
                <Link href={`/category/${cat.slug}`} key={cat._id} className="group block">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                        {/* Fallback image logic handled in CategoryCard usually, replicating for direct link if needed or wrapping CategoryCard. 
                            Let's rely on CategoryCard but style it up or inline it since CategoryCard is simple. 
                            Actually, using the detailed design from plan, let's inline a better card or custom wrap.
                        */}

                         {cat.image ? (
                                        <Image 
                                            src={cat.image} 
                                            alt={cat.name} 
                                            fill 
                                            className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                     ) : (
                                        <Image 
                                            src="/logo.jpg" 
                                            alt={cat.name} 
                                            fill 
                                            className="object-contain p-8 opacity-50 bg-white group-hover:grayscale-0 border border-gray-200 rounded-2xl group-hover:opacity-100 transition-all duration-500" 
                                        />
                                     )}
                         {/* <img 
                            src={cat.image || '/logo.jpg'} 
                            alt={cat.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        /> */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                         
                         {/* Floating Label */}
                         <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl text-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="text-sm font-bold text-gray-900 block truncate">{cat.name}</span>
                         </div>
                    </div>
                    <h3 className="text-lg font-bold text-center text-gray-900 group-hover:text-pink-600 transition-colors">{cat.name}</h3>
                </Link>
            ))}
            </div>
        ) : (
             <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Categories coming soon.</p>
             </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
            <Link href="/category" className="inline-flex items-center text-pink-600 font-bold hover:underline">
              View All Categories <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
        </div>
      </MotionSection>
    </section>
  );
}
