import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import api from '@/lib/api-server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getCategory(slug: string) {
  try {
    const res = await api.get('/categories');
    // api-server returns { data: ... }
    return res.data.data.find((c: any) => (c.slug === slug || c._id === slug)) || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  if (!category) {
    return { title: 'Category Not Found | Agnipengal' };
  }

  const categoryUrl = `${siteUrl}/category/${slug}`;

  return {
    title: `${category.name} | Agnipengal – Women Entrepreneur Marketplace`,
    description: `Explore ${category.name} products handcrafted by women entrepreneurs across India. Shop on Agnipengal to support women-owned businesses.`,
    keywords: [
      category.name,
      'women entrepreneurs',
      'handmade India',
      'Agnipengal',
      'women marketplace India',
      'made in india',
    ],
    openGraph: {
      title: `${category.name} | Agnipengal`,
      description: `Buy ${category.name} from women-owned businesses on Agnipengal.`,
      url: categoryUrl,
      images: [{ url: `${siteUrl}/og-image.jpg` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Agnipengal`,
      description: `Discover ${category.name} on Agnipengal.`,
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  if (!category) {
    notFound();
  }

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
                name: category.name,
                item: `${siteUrl}/category/${category.slug || category._id}`,
              },
            ],
          }),
        }}
      />

      {/* ItemList Schema for Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${category.name} Subcategories`,
              itemListElement: category.subcategories.map((sub: any, idx: number) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url: `${siteUrl}/category/${category.slug || category._id}/${sub.slug || sub._id}`,
                name: sub.name,
              })),
            }),
          }}
        />
      )}

      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 mb-4'>
          {category.name}
        </h1>
        <p className='text-gray-600'>Explore subcategories</p>
      </div>

      {category.subcategories && category.subcategories.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {category.subcategories.map((sub: any) => (
            <Link
              key={sub.slug}
              href={`/category/${category.slug}/${sub.slug}`}
              className='group block p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-pink-200 transition-all text-center'
            >
              <div className='w-20 h-20 mx-auto mb-4 bg-pink-50 rounded-full overflow-hidden flex items-center justify-center group-hover:bg-pink-100 transition-colors border-2 border-transparent group-hover:border-pink-200 shadow-sm relative'>
                {sub.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                  />
                ) : (
                  <span className='text-3xl text-pink-500 font-bold'>{sub.name?.[0]}</span>
                )}
              </div>
              <h3 className='text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors'>
                {sub.name}
              </h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 bg-white rounded-xl border border-dashed border-gray-300'>
          <p className='text-gray-500'>No subcategories found in this category.</p>
        </div>
      )}
    </div>
  );
}
