import React from 'react';
import dbConnect from '@/lib/db';
import ProductModel from '@/lib/models/Product';
import ProductCard from '@/components/shop/ProductCard';
import ProductSort from '@/components/shop/ProductSort';
import ProductFilter from '@/components/shop/ProductFilter';

export const dynamic = 'force-dynamic';

async function getAllProducts(sort: string, filters: any) {
  await dbConnect();
  
  const query: any = {};

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  if (filters.inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  if (filters.material) {
    query['attributes.Material'] = filters.material;
  }

  if (filters.search) {
     const searchRegex = new RegExp(filters.search, 'i');
     query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { slug: searchRegex }
     ];
  }

  let sortOption: any = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'popular') sortOption = { isFeatured: -1 };

  const products = await ProductModel.find(query)
    .sort(sortOption)
    .populate('category')
    .lean();

  return JSON.parse(JSON.stringify(products));
}

export default async function AllProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  
  const sort = (resolvedSearchParams.sort as string) || 'newest';
  const filters = {
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    inStock: resolvedSearchParams.inStock,
    inStock: resolvedSearchParams.inStock,
    material: resolvedSearchParams.material,
    search: resolvedSearchParams.search,
  };

  const products = await getAllProducts(sort, filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                 <h2 className="text-xl font-bold mb-4">Filters</h2>
                 <ProductFilter />
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
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
        </div>
      </div>
    </div>
  );
}
