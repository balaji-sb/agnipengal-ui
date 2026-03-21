import React from 'react';
import type { Metadata } from 'next';
import api from '@/lib/api-server';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Mail, Grid, Store, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
}

async function getVendor(id: string) {
  try {
    const res = await api.get(`/vendors/public/${id}`);
    if (res.data.success) return res.data.data;
    return null;
  } catch (error) {
    return null;
  }
}

async function getVendorProducts(userId: string) {
  try {
    const res = await api.get(`/products?vendor=${userId}`);
    if (res.data.success) return res.data.data;
    return [];
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vendor = await getVendor(id);
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  if (!vendor) {
    return { title: 'Shop Not Found | Agnipengal' };
  }

  return {
    title: `${vendor.storeName} | Agnipengal – Women Owned Business`,
    description: vendor.storeDescription || `Browse products from ${vendor.storeName} on Agnipengal.`,
    keywords: [
      vendor.storeName,
      vendor.category?.name || 'Women Boutique',
      'women owned business India',
      'Agnipengal shop',
    ],
    openGraph: {
      title: `${vendor.storeName} | Agnipengal`,
      description: vendor.storeDescription,
      url: `${siteUrl}/shops/${id}`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/shops/${id}`,
    },
  };
}

export default async function ShopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await getVendor(id);

  if (!vendor) {
    notFound();
  }

  const products = await getVendorProducts(vendor.user._id);
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return (
    <div className='bg-gray-50 min-h-screen pb-20'>
      {/* BreadcrumbList Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Shops',
                item: `${siteUrl}/shops`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: vendor.storeName,
                item: `${siteUrl}/shops/${id}`,
              },
            ],
          }),
        }}
      />

      {/* LocalBusiness Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: vendor.storeName,
            description: vendor.storeDescription,
            url: `${siteUrl}/shops/${id}`,
            telephone: vendor.phone || '',
            image: vendor.logo || `${siteUrl}/logo.jpg`,
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'IN',
            },
          }),
        }}
      />

      {/* Shop Header / Banner */}
      <div className='bg-gradient-to-r from-pink-600 to-violet-700 text-white pt-20 pb-20 md:pt-24 md:pb-32 relative'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex flex-col items-center md:items-end gap-6 md:flex-row'>
            <div className='w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-1 shadow-xl mb-0 md:-mb-12 shrink-0 relative'>
              <div className='w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-pink-600 font-bold text-3xl md:text-4xl'>
                {vendor.storeName.charAt(0)}
              </div>
            </div>

            <div className='text-center md:text-left flex-grow pb-4'>
              <div className='flex items-center justify-center md:justify-start gap-3 mb-2'>
                <h1 className='text-2xl md:text-4xl font-extrabold'>{vendor.storeName}</h1>
                {vendor.category && (
                  <span className='bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium'>
                    {vendor.category.name}
                  </span>
                )}
              </div>
              <p className='text-white/90 text-sm md:text-lg max-w-2xl'>
                {vendor.storeDescription}
              </p>

              <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mt-4 text-xs md:text-sm font-medium text-white/80'>
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
        </div>

        {products.length === 0 ? (
          <div className='bg-white rounded-2xl p-12 text-center border border-gray-100'>
            <Store className='w-12 h-12 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-bold text-gray-900'>No Products Yet</h3>
            <p className='text-gray-500'>This shop hasn't listed any products yet.</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {products.map((product: Product) => (
              <Link
                key={product._id}
                href={`/product/${product.slug}?id=${product._id}`}
                className='group'
              >
                <div className='bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300'>
                  <div className='aspect-square relative flex items-center justify-center bg-gray-50 p-4'>
                    <div className='relative w-full h-full'>
                      {product.images && product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
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
