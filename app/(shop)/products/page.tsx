import React from 'react';
import type { Metadata } from 'next';
import ProductCard from '@/components/shop/ProductCard';
import ProductSort from '@/components/shop/ProductSort';
import ProductFilter from '@/components/shop/ProductFilter';
import ProductListingLayout from '@/components/shop/ProductListingLayout';
import api from '@/lib/api';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop Products | Agnipengal – Women Entrepreneur Marketplace',
  description:
    'Browse handmade products, Aari embroidery supplies, sewing kits, and decoration items crafted by women entrepreneurs and artisans across India. Every purchase empowers a woman-owned business on Agnipengal.',
  keywords: [
    'women entrepreneur products India',
    'buy from women owned businesses',
    'Agnipengal shop',
    'handmade products women India',
    'Aari embroidery materials online',
    'women artisan marketplace',
    'empowering women through shopping',
    'support women business India',
    'made in india marketplace',
    'women entrepreneur marketplace',
    'handcrafted in India',
  ],
  openGraph: {
    title: 'Shop Products | Agnipengal – Empowering Women Entrepreneurs',
    description:
      "Buy handmade and artisan products from women-owned businesses on Agnipengal – India's women empowerment marketplace.",
    url: 'https://agnipengal.com/products',
    images: [{ url: 'https://agnipengal.com/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@agnipengal',
    title: 'Shop Products | Agnipengal',
    description: 'Buy from women-owned businesses on Agnipengal – Empowering Women Entrepreneurs.',
    images: ['https://agnipengal.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://agnipengal.com/products',
  },
};

async function getAllProducts(sort: string, filters: any) {
  const params: any = { limit: 15, page: 1 }; // Default initial load
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
    console.log('[getAllProducts] Calling API with params:', params);
    const res = await api.get('/products', { params });
    console.log(`[getAllProducts] Response received. Found ${res.data?.data?.length} products.`);
    return {
      products: res.data.data || [],
      pagination: res.data.pagination || { page: 1, totalPages: 1, total: 0 },
    };
  } catch (error) {
    console.error('[getAllProducts] Fetch products error:', error);
    return { products: [], pagination: { page: 1, totalPages: 1, total: 0 } };
  }
}

// ... (existing imports and functions)
import ProductInfiniteScroll from '@/components/shop/ProductInfiniteScroll';

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations('Products');
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
                item: 'https://agnipengal.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'All Products',
                item: 'https://agnipengal.com/products',
              },
            ],
          }),
        }}
      />
      {/* ItemList Schema – helps Google surface individual products */}
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
                url: `https://agnipengal.com/product/${p.slug || p._id}`,
                name: p.name,
              })),
            }),
          }}
        />
      )}
      <ProductListingLayout sidebar={<ProductFilter />}>
        <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold capitalize text-gray-900 mb-4 sm:mb-0'>
            {t('title')} <span className='text-gray-400 text-lg'>({pagination.total})</span>
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
            <p className='text-gray-500 text-lg'>{t('noProducts')}</p>
          </div>
        )}
      </ProductListingLayout>
    </div>
  );
}
