import React from 'react';
import ProductCard from '@/components/shop/ProductCard';
import ProductSort from '@/components/shop/ProductSort';
import ProductFilter from '@/components/shop/ProductFilter';
import ProductListingLayout from '@/components/shop/ProductListingLayout';
import api from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getAllProducts(sort: string, filters: any) {
  const params: any = {};
  if (sort) params.sort = sort;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.inStock === 'true') params.inStock = 'true';
  if (filters.material) params.material = filters.material;
  if (filters.search) params.search = filters.search;

  try {
      const res = await api.get('/products', { params });
      return res.data.data || [];
  } catch (error) {
      console.error('Fetch products error:', error);
      return [];
  }
}

// ... (existing imports and functions)

export default async function AllProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  
  const sort = (resolvedSearchParams.sort as string) || 'newest';
  const filters = {
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    inStock: resolvedSearchParams.inStock,
    material: resolvedSearchParams.material,
    search: resolvedSearchParams.search,
  };

  const products = await getAllProducts(sort, filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductListingLayout
        sidebar={<ProductFilter />}
      >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <h1 className="text-2xl font-bold capitalize text-gray-900 mb-4 sm:mb-0">
               All Products <span className="text-gray-400 text-lg">({products.length})</span>
            </h1>
            <ProductSort />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
             </div>
          )}
      </ProductListingLayout>
    </div>
  );
}
