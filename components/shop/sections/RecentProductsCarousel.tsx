'use client';

import React, { useRef } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import MotionSection from '@/components/shop/MotionSection';

interface RecentProductsCarouselProps {
  products: any[];
}

export default function RecentProductsCarousel({ products }: RecentProductsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className='container mx-auto px-4 py-8 relative z-10'>
      <MotionSection>
        <div className='flex items-center justify-between mb-6 md:mb-8'>
          <div className='flex items-center gap-3'>
            <div className='bg-pink-100 p-2.5 rounded-2xl'>
              <Zap className='w-6 h-6 text-pink-600' />
            </div>
            <div>
              <h2 className='text-xl md:text-3xl font-black text-gray-900 tracking-tight'>
                Recently Added
              </h2>
              <div className='h-1 w-12 md:h-1.5 md:w-20 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full mt-1' />
            </div>
          </div>
          
          <div className='hidden md:flex gap-3'>
            <button 
              onClick={scrollLeft}
              className='p-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-pink-300 hover:text-pink-600 text-gray-600 transition-all shadow-sm'
              aria-label="Scroll left"
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
            <button 
              onClick={scrollRight}
              className='p-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-pink-300 hover:text-pink-600 text-gray-600 transition-all shadow-sm'
              aria-label="Scroll right"
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='relative -mx-4 px-4 md:mx-0 md:px-0'>
          <div 
            ref={scrollContainerRef}
            className='flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-2 snap-x snap-mandatory scrollbar-hide'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product._id} className='snap-start shrink-0 w-[240px] md:w-[280px] lg:w-[320px]'>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </MotionSection>
    </section>
  );
}
