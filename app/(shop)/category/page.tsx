import React from 'react';
import type { Metadata } from 'next';
import CategoryCard from '@/components/shop/CategoryCard';
import api from '@/lib/api-server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return {
    title: 'Product Categories | Agnipengal – Empowering Women Entrepreneurs',
    description:
      'Explore categories of handmade and tailored products on Agnipengal. From Aari embroidery to fashion and home decor, support women-owned businesses across India.',
    keywords: [
      'women entrepreneur categories',
      'handmade products India',
      'Aari embroidery materials',
      'women-owned brands marketplace',
      'Agnipengal collections',
    ],
    openGraph: {
      title: 'Product Categories | Agnipengal',
      description: 'Discover the depth and diversity of products on Agnipengal.',
      url: `${siteUrl}/category`,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product Categories | Agnipengal',
      description: 'Explore handmade and tailored products by women entrepreneurs.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/category`,
    },
  };
}

async function getCategories() {
  try {
    const res = await api.get('/categories');
    // api-server returns { data: ... }
    return res.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoryPage() {
  const categories = await getCategories();
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return (
    <div className='container mx-auto px-4 py-12'>
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
                name: 'Categories',
                item: `${siteUrl}/category`,
              },
            ],
          }),
        }}
      />

      {/* ItemList Schema */}
      {categories.length > 0 && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Agnipengal Categories',
              itemListElement: categories.map((c: any, idx: number) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url: `${siteUrl}/category/${c.slug || c._id}`,
                name: c.name,
              })),
            }),
          }}
        />
      )}

      <h1 className='text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600'>
        All Categories
      </h1>

      {categories.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {categories.map((cat: any) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      ) : (
        <div className='text-center py-20'>
          <p className='text-gray-500 text-lg'>No categories found.</p>
        </div>
      )}
    </div>
  );
}
