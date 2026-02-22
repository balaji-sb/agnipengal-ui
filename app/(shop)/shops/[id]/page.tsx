'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { MapPin, Phone, Mail, Grid, Store, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  offerPrice?: number;
  images: string[];
  description: string;
  category: { name: string; slug: string };
  stock: number;
}

interface Vendor {
  _id: string;
  storeName: string;
  storeDescription: string;
  phone: string;
  category: { name: string } | null;
  user: {
    _id: string; // User ID needed for product fetch
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
}

export default function ShopDetailsPage() {
  const { id } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        // 1. Fetch Vendor Details
        const vendorRes = await api.get(`/vendors/public/${id}`);
        if (vendorRes.data.success) {
          const vendorData = vendorRes.data.data;
          setVendor(vendorData);

          // 2. Fetch Vendor Products using User ID
          // We use the Main Product Filter API with `vendor=USER_ID`
          // Note: vendorData.user._id is the User ID
          if (vendorData.user && vendorData.user._id) {
            const productRes = await api.get(`/products?vendor=${vendorData.user._id}`);
            if (productRes.data.success) {
              setProducts(productRes.data.data);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching shop details:', err);
        setError(err.response?.data?.error || 'Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600'></div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center p-8 bg-white rounded-2xl shadow-sm max-w-md'>
          <AlertCircle className='w-16 h-16 text-red-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Shop Not Found</h2>
          <p className='text-gray-500 mb-6'>
            {error || "This shop doesn't exist or is currently unavailable."}
          </p>
          <Link
            href='/shops'
            className='px-6 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition'
          >
            Browse All Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-50 min-h-screen pb-20'>
      {/* Search Header placeholder if needed later */}

      {/* Shop Header / Banner */}
      <div className='bg-gradient-to-r from-pink-600 to-violet-700 text-white pt-24 pb-32 relative'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex flex-col md:flex-row items-center md:items-end gap-6'>
            <div className='w-32 h-32 bg-white rounded-2xl p-1 shadow-xl -mb-16 md:mb-0 shrink-0 relative'>
              <div className='w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-pink-600 font-bold text-4xl'>
                {vendor.storeName.charAt(0)}
              </div>
            </div>

            <div className='text-center md:text-left flex-grow pb-4'>
              <div className='flex items-center justify-center md:justify-start gap-3 mb-2'>
                <h1 className='text-4xl font-extrabold'>{vendor.storeName}</h1>
                {vendor.category && (
                  <span className='bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium'>
                    {vendor.category.name}
                  </span>
                )}
              </div>
              <p className='text-white/90 text-lg max-w-2xl'>{vendor.storeDescription}</p>

              <div className='flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4 text-sm font-medium text-white/80'>
                <span className='flex items-center gap-2'>
                  <Store className='w-4 h-4' />
                  {vendor.user.name}
                </span>
                {vendor.phone && (
                  <span className='flex items-center gap-2'>
                    <Phone className='w-4 h-4' />
                    {vendor.phone}
                  </span>
                )}
                {/* Email might be private, check requirements. Showing for now if public contact. */}
                <span className='flex items-center gap-2'>
                  <Mail className='w-4 h-4' />
                  Contact Vendor
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 pt-16 md:pt-12'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
            <Grid className='w-6 h-6 text-pink-600' />
            Store Products{' '}
            <span className='text-gray-400 text-lg font-normal'>({products.length})</span>
          </h2>

          {/* Sort/Filter Controls could go here */}
        </div>

        {products.length === 0 ? (
          <div className='bg-white rounded-2xl p-12 text-center border border-gray-100'>
            <Store className='w-12 h-12 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-bold text-gray-900'>No Products Yet</h3>
            <p className='text-gray-500'>This shop hasn't listed any products yet.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/product/${product.slug}?id=${product._id}`}
                className='group'
              >
                <div className='bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300'>
                  <div className='aspect-square relative flex items-center justify-center bg-gray-50 p-4'>
                    <div className='relative w-full h-full'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className='object-contain w-full h-full group-hover:scale-105 transition-transform duration-500'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-gray-300'>
                          No Image
                        </div>
                      )}
                    </div>
                    {product.offerPrice && product.offerPrice > 0 && (
                      <div className='absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm'>
                        SALE
                      </div>
                    )}
                  </div>

                  <div className='p-4'>
                    <h3 className='font-bold text-gray-900 mb-1 truncate group-hover:text-pink-600 transition-colors'>
                      {product.name}
                    </h3>
                    <p className='text-xs text-gray-500 mb-3'>{product.category?.name}</p>

                    <div className='flex items-end justify-between'>
                      <div>
                        {product.offerPrice && product.offerPrice > 0 ? (
                          <div className='flex flex-col'>
                            <span className='text-lg font-extrabold text-gray-900'>
                              ₹{product.offerPrice}
                            </span>
                            <span className='text-xs text-gray-400 line-through'>
                              ₹{product.price}
                            </span>
                          </div>
                        ) : (
                          <span className='text-lg font-extrabold text-gray-900'>
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                      <button className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-orange-600 group-hover:text-white transition-colors'>
                        <Store className='w-4 h-4' />
                      </button>
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
