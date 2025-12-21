import React from 'react';
import AddToCart from '@/components/shop/AddToCart';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductReviews from '@/components/shop/ProductReviews'; // New Component
import ProductViewTracker from '@/components/shop/ProductViewTracker';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react'; // Added icons

export const dynamic = 'force-dynamic';

import api from '@/lib/api';

async function getProduct(slug: string) {
  try {
      const res = await api.get(`/products/${slug}`);
      return res.data.data;
  } catch (error) {
      return null;
  }
}

async function getRelatedProducts(category: string, currentId: string) {
    try {
        const res = await api.get('/products', { params: { category } });
        return res.data.data.filter((p: any) => p._id !== currentId).slice(0, 4) || [];
    } catch (error) {
        return [];
    }
}

// Ensure params is treated as a Promise in Next.js 15
export default async function ProductDetailPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params;
  const product = await getProduct(productSlug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category._id, product._id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16">
        <ProductViewTracker productId={product._id} />
        {/* Left: Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Right: Details */}
        <div className="space-y-8">
            <div>
                <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full">
                    {product.category?.name || 'Category'}
                </span>
                <h1 className="mt-4 text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {product.name}
                </h1>
                <div className="mt-4 flex items-end gap-4">
                    <p className="text-3xl font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    {/* Optional: Show original price if discounted later */}
                </div>
            </div>

            <div className="prose prose-gray prose-lg">
                <p>{product.description}</p>
            </div>

            {/* Attributes Grid */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-2 gap-y-4 gap-x-8">
                     {Object.entries(product.attributes).map(([key, value]) => (
                         <div key={key}>
                             <span className="block text-xs uppercase tracking-wide text-gray-500 mb-1">{key}</span>
                             <span className="font-medium text-gray-900">{value as string}</span>
                         </div>
                     ))}
                </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100">
                <AddToCart product={product} />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                        <RotateCcw className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Easy Returns</span>
                </div>
            </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product._id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-gray-100 pt-16">
              <h2 className="text-3xl font-bold mb-10 text-center">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedProducts.map((p: any) => (
                      <ProductCard key={p._id} product={p} />
                  ))}
              </div>
          </section>
      )}
    </div>
  );
}
