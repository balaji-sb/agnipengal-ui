import React from 'react';
import dbConnect from '@/lib/db';
import ProductModel from '@/lib/models/Product';
import AddToCart from '@/components/shop/AddToCart'; // I need to create this
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  await dbConnect();
  const product = await ProductModel.findOne({ slug }).populate('category').lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

async function getRelatedProducts(category: string, currentId: string) {
    await dbConnect();
    const products = await ProductModel.find({ category, _id: { $ne: currentId } })
        .limit(4)
        .populate('category')
        .lean();
    return JSON.parse(JSON.stringify(products));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params;
  const product = await getProduct(productSlug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category._id, product._id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <Image 
                    src={product.images[0] || '/placeholder.png'} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                    priority
                />
            </div>
            {/* Thumbnails if multiple images (Implement later or simple grid) */}
             <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:border-pink-500 transition">
                         <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                    </div>
                ))}
             </div>
        </div>

        {/* Details */}
        <div>
            <div className="mb-6">
                <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full">
                    {product.category?.name || 'Category'}
                </span>
                <h1 className="mt-4 text-4xl font-bold text-gray-900 leading-tight">
                    {product.name}
                </h1>
                <p className="mt-4 text-3xl font-bold text-gray-900">
                    ₹{product.price}
                </p>
            </div>

            <div className="prose prose-gray mb-8">
                <p>{product.description}</p>
            </div>

            {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="mb-8 border-t border-b border-gray-100 py-4 grid grid-cols-2 gap-4">
                     {Object.entries(product.attributes).map(([key, value]) => (
                         <div key={key}>
                             <span className="block text-sm text-gray-500 capitalize">{key}</span>
                             <span className="font-medium text-gray-900">{value as string}</span>
                         </div>
                     ))}
                </div>
            )}

            <AddToCart product={product} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
          <section>
              <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
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
