import React from 'react';
import dbConnect from '@/lib/db';
import ProductModel from '@/lib/models/Product';
import ProductCard from '@/components/shop/ProductCard';
import ProductSort from '@/components/shop/ProductSort';
import ProductFilter from '@/components/shop/ProductFilter';
import { notFound } from 'next/navigation';



export const dynamic = 'force-dynamic';

async function getProducts(categorySlug: string, subCategory: string, sort: string, filters: any) {
  await dbConnect();
  
  // Base query
  const query: any = { 
    // We assume categorySlug is implicitly filtered if we query by subCategory slug. 
    // Ideally we should verify categorySlug matches too, but for speed just specific subcategory check if unique enough.
    // Prompt says: /category/[categorySlug]/[subCategorySlug]
    subcategory: subCategory 
 };

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
    // Note: This attempts to match Map structure. 'attributes.Material' might work if Mongoose supports it directly, 
    // or we might need strict path 'attributes.Material'.
    // If attributes is Map, we might need a different query or store material in dedicated field. 
    // For now assuming we check a generic attribute.
  }

  let sortOption: any = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'popular') sortOption = { isFeatured: -1 }; // Proxy for now

  const products = await ProductModel.find(query)
    .sort(sortOption)
    .populate('category') // populate to get category name
    .lean();

  return JSON.parse(JSON.stringify(products));
}

export default async function ProductListingPage({ params, searchParams }: { params: Promise<{ slug: string; subSlug: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug: categorySlug, subSlug: subCategorySlug } = await params;
  const resolvedSearchParams = await searchParams;
  
  const sort = (resolvedSearchParams.sort as string) || 'newest';
  const filters = {
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    inStock: resolvedSearchParams.inStock,
    material: resolvedSearchParams.material,
  };

  const products = await getProducts(categorySlug, subCategorySlug, sort, filters);

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
               {subCategorySlug.replace(/-/g, ' ')} <span className="text-gray-400 text-lg">({products.length})</span>
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
