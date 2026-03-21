import React from 'react';
import type { Metadata } from 'next';
import api from '@/lib/api-server';
import Link from 'next/link';
import { Store } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return {
    title: 'Women-Owned Shops | Agnipengal – Support Local Entrepreneurs',
    description:
      'Discover unique shops and businesses owned by women entrepreneurs across India. Browse artisanal products, specialized services, and support local empowerment on Agnipengal.',
    keywords: [
      'women owned shops India',
      'female entrepreneur businesses',
      'Agnipengal vendors',
      'support women businesses online',
      'artisanal shops India',
      'local women entrepreneurs marketplace',
    ],
    openGraph: {
      title: 'Women-Owned Shops | Agnipengal',
      description: 'Explore unique shops from our community of women entrepreneurs across India.',
      url: `${siteUrl}/shops`,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@agnipengal',
      title: 'Women-Owned Shops | Agnipengal',
      description: 'Discover businesses owned by women entrepreneurs on Agnipengal.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/shops`,
    },
  };
}

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
  logo?: string;
}

async function getVendors() {
  try {
    const res = await api.get('/vendors/public');
    // api-server returns { data: ... } where data is the JSON body
    // and based on vendor public endpoint, it's usually { success: true, data: [...] }
    return res.data?.data || [];
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
}

export default async function ShopsPage() {
  const vendors = await getVendors();
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return (
    <div className='bg-gray-50 min-h-screen py-12'>
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
            ],
          }),
        }}
      />
      {/* ItemList Schema */}
      {vendors.length > 0 && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Women-Owned Businesses on Agnipengal',
              itemListElement: vendors.map((v: Vendor, idx: number) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url: `${siteUrl}/shops/${v._id}`,
                name: v.storeName,
              })),
            }),
          }}
        />
      )}

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
            {vendors.map((vendor: Vendor) => (
              <Link key={vendor._id} href={`/shops/${vendor._id}`} className='group block h-full'>
                <div className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 flex flex-col'>
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
