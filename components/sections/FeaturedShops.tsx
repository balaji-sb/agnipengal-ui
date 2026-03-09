'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Store } from 'lucide-react';
import api from '@/lib/api';

interface Vendor {
  _id: string;
  storeName: string;
  category: { name: string } | null;
}

export default function FeaturedShops() {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    // Fetch limited number of vendors for homepage
    api
      .get('/vendors/public')
      .then((res) => {
        setVendors(res.data.data.slice(0, 4)); // Show top 4
      })
      .catch((err) => console.error(err));
  }, []);

  if (vendors.length === 0) return null;

  return (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-10 gap-2'>
          <div className='space-y-1'>
            <h2 className='text-xl md:text-3xl font-bold text-gray-900'>Featured Shops</h2>
            <p className='text-xs md:text-base text-gray-600 line-clamp-1'>
              Browse top-rated sellers
            </p>
          </div>
          <Link
            href='/shops'
            className='text-red-600 font-bold hover:text-red-700 flex items-center transition shrink-0 text-sm md:text-base'
          >
            View All <ArrowRight className='w-3.5 h-3.5 md:w-4 md:h-4 ml-1' />
          </Link>
        </div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8'>
          {vendors.map((vendor) => (
            <Link key={vendor._id} href={`/shops/${vendor._id}`} className='group'>
              <div className='bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition border border-transparent hover:border-red-100 h-full flex flex-col items-center justify-center'>
                <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-2xl font-bold text-red-600'>
                  {vendor.storeName.charAt(0)}
                </div>
                <h3 className='font-bold text-lg text-gray-900 mb-1 group-hover:text-red-700 transition-colors'>
                  {vendor.storeName}
                </h3>
                {vendor.category && <p className='text-sm text-gray-500'>{vendor.category.name}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
