import React from 'react';
import ProductCard from '@/components/shop/ProductCard';
import ProductSort from '@/components/shop/ProductSort';
import ProductFilter from '@/components/shop/ProductFilter';
import { notFound } from 'next/navigation';
import api from '@/lib/api-server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getProducts(categorySlug: string, subCategory: string, sort: string, filters: any) {
  const params: any = { subcategory: subCategory };
  if (sort) params.sort = sort;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.inStock === 'true') params.inStock = 'true';
  if (filters.material) params.material = filters.material;
  if (filters.vendor) params.vendor = filters.vendor;
  if (filters.vendorCategory) params.vendorCategory = filters.vendorCategory;

  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await api.get(`/products?${queryString}`);
    // api-server returns { data: ... }
    return res.data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const subCategoryName = subSlug.replace(/-/g, ' ');
  const categoryName = slug.replace(/-/g, ' ');
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return {
    title: `${subCategoryName} - ${categoryName} | Agnipengal`,
    description: `Shop for ${subCategoryName} in ${categoryName} on Agnipengal. Support women-owned businesses by purchasing these high-quality, handcrafted products.`,
    keywords: [
      subCategoryName,
      categoryName,
      'women entrepreneurs',
      'Agnipengal',
      'handmade',
      'marketplace India',
      'made in india',
    ],
    alternates: {
      canonical: `${siteUrl}/category/${slug}/${subSlug}`,
    },
    openGraph: {
      title: `${subCategoryName} - ${categoryName} | Agnipengal`,
      description: `Find the best ${subCategoryName} from women artisans on Agnipengal.`,
      url: `${siteUrl}/category/${slug}/${subSlug}`,
      images: [{ url: `${siteUrl}/og-image.jpg` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${subCategoryName} - ${categoryName} | Agnipengal`,
      description: `Shop for ${subCategoryName} on Agnipengal.`,
      images: [`${siteUrl}/og-image.jpg`],
    },
  };
}

export default async function ProductListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug: categorySlug, subSlug: subCategorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const sort = (resolvedSearchParams.sort as string) || 'newest';
  const filters = {
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    inStock: resolvedSearchParams.inStock,
    material: resolvedSearchParams.material,
    vendor: resolvedSearchParams.vendor,
    vendorCategory: resolvedSearchParams.vendorCategory,
  };

  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');
  const products = await getProducts(categorySlug, subCategorySlug, sort, filters);

  const categoryName = categorySlug.replace(/-/g, ' ');
  const subCategoryName = subCategorySlug.replace(/-/g, ' ');

  return (
    <div className='container mx-auto px-4 py-8'>
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
                name: categoryName,
                item: `${siteUrl}/category/${categorySlug}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: subCategoryName,
                item: `${siteUrl}/category/${categorySlug}/${subCategorySlug}`,
              },
            ],
          }),
        }}
      />

      {/* ItemList Schema for Products */}
      {products.length > 0 && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${subCategoryName} Products`,
              itemListElement: products.map((p: any, idx: number) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url: `${siteUrl}/product/${p.slug || p._id}`,
                name: p.name,
              })),
            }),
          }}
        />
      )}

      <div className='flex flex-col md:flex-row gap-8'>
        {/* Sidebar */}
        <div className='w-full md:w-64 flex-shrink-0'>
          <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24'>
            <h2 className='text-xl font-bold mb-4'>Filters</h2>
            <ProductFilter />
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1'>
          <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
            <h1 className='text-2xl font-bold capitalize text-gray-900 mb-4 sm:mb-0'>
              {subCategoryName} <span className='text-gray-400 text-lg'>({products.length})</span>
            </h1>
            <ProductSort />
          </div>

          {products.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className='text-center py-20 bg-white rounded-xl border border-dashed border-gray-300'>
              <p className='text-gray-500 text-lg'>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
