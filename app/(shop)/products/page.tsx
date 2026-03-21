import React from 'react';
import type { Metadata } from 'next';
import ProductCard from '@/components/shop/ProductCard';
import ProductSort from '@/components/shop/ProductSort';
import ProductFilter from '@/components/shop/ProductFilter';
import ProductListingLayout from '@/components/shop/ProductListingLayout';
import api from '@/lib/api-server';
import ProductInfiniteScroll from '@/components/shop/ProductInfiniteScroll';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search as string;
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  const title = search
    ? `Search results for "${search}" | Agnipengal`
    : 'Shop Products | Agnipengal – Women Entrepreneur Marketplace';
  
  const description = search
    ? `Discover products matching "${search}" on Agnipengal. Support women entrepreneurs with every purchase.`
    : 'Browse handmade products, Aari embroidery supplies, sewing kits, and decoration items crafted by women entrepreneurs and artisans across India.';

  return {
    title,
    description,
    keywords: [
      'women entrepreneur products India',
      'buy from women owned businesses',
      'Agnipengal shop',
      'handmade products women India',
      'Aari embroidery materials online',
    ],
    openGraph: {
      title,
      description,
      url: search ? `${siteUrl}/products?search=${encodeURIComponent(search)}` : `${siteUrl}/products`,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/products`,
    },
  };
}

async function getAllProducts(sort: string, filters: any) {
  const params: any = { limit: 15, page: 1 };
  if (sort) params.sort = sort;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.inStock === 'true') params.inStock = 'true';
  if (filters.material) params.material = filters.material;
  if (filters.search) params.search = filters.search;
  if (filters.vendor) params.vendor = filters.vendor;
  if (filters.storeSlug) params.storeSlug = filters.storeSlug;
  if (filters.vendorCategory) params.vendorCategory = filters.vendorCategory;

  try {
    // Construct query string for api-server
    const queryString = new URLSearchParams(params).toString();
    const res = await api.get(`/products?${queryString}`);
    
    // api-server returns { data: ... }
    return {
      products: res.data.data || [],
      pagination: res.data.pagination || { page: 1, totalPages: 1, total: 0 },
    };
  } catch (error) {
    console.error('[getAllProducts] Fetch products error:', error);
    return { products: [], pagination: { page: 1, totalPages: 1, total: 0 } };
  }
}

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const sort = (resolvedSearchParams.sort as string) || 'newest';
  const filters = {
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    inStock: resolvedSearchParams.inStock,
    material: resolvedSearchParams.material,
    search: resolvedSearchParams.search,
    vendor: resolvedSearchParams.vendor,
    storeSlug: resolvedSearchParams.storeSlug,
    vendorCategory: resolvedSearchParams.vendorCategory,
  };

  const { products, pagination } = await getAllProducts(sort, filters);
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return (
    <div className='container mx-auto px-4 py-4'>
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
                name: 'All Products',
                item: `${siteUrl}/products`,
              },
            ],
          }),
        }}
      />
      {/* ItemList Schema */}
      {products.length > 0 && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Products on Agnipengal',
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
      <ProductListingLayout sidebar={<ProductFilter />}>
        <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold capitalize text-gray-900 mb-4 sm:mb-0'>
            {resolvedSearchParams.search ? `Search: ${resolvedSearchParams.search}` : 'All Products'}{' '}
            <span className='text-gray-400 text-lg'>({pagination.total})</span>
          </h1>
          <ProductSort />
        </div>

        {products.length > 0 ? (
          <ProductInfiniteScroll
            initialProducts={products}
            searchParams={resolvedSearchParams}
            initialPagination={pagination}
          />
        ) : (
          <div className='text-center py-20 bg-white rounded-xl border border-dashed border-gray-300'>
            <p className='text-gray-500 text-lg'>No products found matching your criteria.</p>
          </div>
        )}
      </ProductListingLayout>
    </div>
  );
}
