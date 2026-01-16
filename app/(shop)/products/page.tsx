import React from 'react';
import ProductCard from '@/components/shop/ProductCard';
import ProductSort from '@/components/shop/ProductSort';
import ProductFilter from '@/components/shop/ProductFilter';
import ProductListingLayout from '@/components/shop/ProductListingLayout';
import api from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getAllProducts(sort: string, filters: any) {
  const params: any = { limit: 15, page: 1 }; // Default initial load
  if (sort) params.sort = sort;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.inStock === 'true') params.inStock = 'true';
  if (filters.material) params.material = filters.material;
  if (filters.search) params.search = filters.search;

  try {
      const res = await api.get('/products', { params });
      return { 
          products: res.data.data || [],
          pagination: res.data.pagination || { page: 1, totalPages: 1, total: 0 }
      };
  } catch (error) {
      console.error('Fetch products error:', error);
      return { products: [], pagination: { page: 1, totalPages: 1, total: 0 } };
  }
}

// ... (existing imports and functions)
import ProductInfiniteScroll from '@/components/shop/ProductInfiniteScroll';

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

  const { products, pagination } = await getAllProducts(sort, filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductListingLayout
        sidebar={<ProductFilter />}
      >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <h1 className="text-2xl font-bold capitalize text-gray-900 mb-4 sm:mb-0">
               All Products <span className="text-gray-400 text-lg">({pagination.total})</span>
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
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
             </div>
          )}
      </ProductListingLayout>
    </div>
  );
}
