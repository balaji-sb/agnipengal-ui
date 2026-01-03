import React from 'react';
import AddToCart from '@/components/shop/AddToCart';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductReviews from '@/components/shop/ProductReviews';
import ProductShare from '@/components/shop/ProductShare';
import ProductViewTracker from '@/components/shop/ProductViewTracker';
import { ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';

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
                <div className="flex justify-between items-start mt-4 gap-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        {product.name}
                    </h1>
                    <ProductShare productName={product.name} productSlug={product.slug} />
                </div>
                
                {/* Rating Summary */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex bg-pink-600 text-white px-2 py-0.5 rounded text-sm font-bold items-center gap-1">
                        <span>{product.rating?.toFixed(1) || 0}</span>
                        <Star className="w-3 h-3 fill-current" />
                    </div>
                    <a href="#reviews" className="text-sm text-gray-500 hover:text-pink-600 hover:underline">
                        {product.numReviews || 0} ratings
                    </a>
                </div>
                <div className="mt-4 flex items-end gap-4">
                    <p className="text-3xl font-bold text-gray-900">
                        ₹{(product.offerPrice && product.offerPrice > 0 ? product.offerPrice : product.price).toLocaleString('en-IN')}
                    </p>
                    {product.offerPrice && product.offerPrice > 0 && (
                        <>
                            <p className="text-lg text-gray-400 line-through mb-1">
                                ₹{product.price.toLocaleString('en-IN')}
                            </p>
                            <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded font-bold text-sm mb-1.5">
                                {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                            </span>
                        </>
                    )}
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

       {/* Combo Includes Section */}
       {product.isCombo && product.products && product.products.length > 0 && (
           <section className="mb-20 border-t border-gray-100 pt-16 bg-pink-50/50 rounded-3xl p-8 lg:p-12">
               <div className="text-center mb-10">
                   <span className="text-pink-600 font-bold tracking-wider uppercase text-sm">Great Value Bundle</span>
                   <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-gray-900">What&apos;s Inside This Combo?</h2>
                   <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                       This bundle includes {product.products.length} premium items curated specially for you.
                   </p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                   {product.products.map((p: any) => (
                       <ProductCard key={p._id} product={p} />
                   ))}
               </div>
           </section>
       )}

      {/* Reviews Section */}
      <div id="reviews">
        <ProductReviews productId={product._id} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-gray-100 pt-16">
              <h2 className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  You Might Also Like
              </h2>
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
