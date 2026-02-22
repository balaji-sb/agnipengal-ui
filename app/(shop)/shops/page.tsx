'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Store, MapPin } from 'lucide-react';
import Image from 'next/image';

interface Vendor {
  _id: string;
  storeName: string;
  storeDescription: string;
  category: {
    _id: string;
    name: string;
  } | null;
  user: {
    name: string;
    email: string;
  };
  logo?: string; // Assuming future logo support
}

export default function ShopsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get('/vendors/public');
        setVendors(response.data.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600'></div>
      </div>
    );
  }

  return (
    <div className='bg-gray-50 min-h-screen py-12'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Discover Our Shops</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Explore a variety of unique shops offering specialized products and services.
          </p>
        </div>

        {vendors.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-2xl shadow-sm'>
            <Store className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-gray-900'>No Shops Found</h2>
            <p className='text-gray-500 mt-2'>Check back later for new entries.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {vendors.map((vendor) => (
              <Link key={vendor._id} href={`/shops/${vendor._id}`} className='group block h-full'>
                <div className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 flex flex-col'>
                  {/* Banner/Cover Area - Using a gradient placeholder for now as vendor images aren't fully set up */}
                  <div className='h-32 bg-gradient-to-r from-orange-500 to-red-600 relative'>
                    <div className='absolute -bottom-8 left-6'>
                      <div className='w-16 h-16 rounded-xl bg-white p-1 shadow-lg'>
                        <div className='w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-pink-600 font-bold text-xl'>
                          {vendor.storeName.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='pt-10 p-6 flex-grow flex flex-col'>
                    <div className='flex justify-between items-start mb-2'>
                      <h2 className='text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1'>
                        {vendor.storeName}
                      </h2>
                      {vendor.category && (
                        <span className='bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap'>
                          {vendor.category.name}
                        </span>
                      )}
                    </div>

                    <p className='text-gray-600 text-sm mb-4 line-clamp-2 flex-grow'>
                      {vendor.storeDescription || 'No description available.'}
                    </p>

                    <div className='border-t border-gray-100 pt-4 mt-auto flex items-center text-gray-500 text-sm'>
                      <div className='flex items-center'>
                        <Store className='w-4 h-4 mr-1' />
                        <span>{vendor.user.name}</span>
                      </div>
                      {/* Location Placeholder if added later */}
                      {/* <div className="flex items-center ml-4">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>City</span>
                         </div> */}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
