'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Timer, ArrowRight, Sparkles } from 'lucide-react';

interface DealCardProps {
  deal: {
    _id: string;
    name: string;
    image?: string;
    endDate: string;
    description?: string;
  };
}

export default function DealCard({ deal }: DealCardProps) {
  // Calculate time remaining (basic)
  const endDate = new Date(deal.endDate);
  const now = new Date();
  const diffTime = Math.abs(endDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className='group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full'>
      <div className='relative aspect-video overflow-hidden bg-gray-100'>
        <Image
          src={deal.image || '/placeholder.png'} // You might want a specific placeholder for deals
          alt={deal.name}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

        <div className='absolute bottom-4 left-4 right-4 text-white'>
          <h3 className='text-xl font-bold mb-1 leading-tight group-hover:text-yellow-300 transition-colors'>
            {deal.name}
          </h3>
          {deal.description && (
            <p className='text-xs text-gray-200 line-clamp-1 opacity-80'>{deal.description}</p>
          )}
        </div>

        <div className='absolute top-3 left-3 bg-red-600/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse'>
          <Timer className='w-3 h-3' />
          <span>Ends in {diffDays} days</span>
        </div>
      </div>

      <div className='p-5 flex flex-col flex-grow'>
        <div className='mt-auto'>
          <Link
            href={`/deals/${deal._id}`}
            className='w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-900 hover:bg-orange-600 hover:text-white py-3 rounded-xl font-bold transition-all duration-300 group-hover:shadow-lg transform group-hover:-translate-y-1'
          >
            View Offers <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </div>
  );
}
