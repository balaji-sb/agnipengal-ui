import React from 'react';
import ProductDetails from '@/components/shop/ProductDetails';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import ProductReviews from '@/components/shop/ProductReviews';
import ProductViewTracker from '@/components/shop/ProductViewTracker';

export const dynamic = 'force-dynamic';

import api from '@/lib/api';

import { Metadata, ResolvingMetadata } from 'next';

async function getProduct(slug: string) {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ productSlug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProduct(productSlug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} | Agni Pengal`,
    description:
      product.description?.slice(0, 160) ||
      `Buy ${product.name} from women-owned businesses on Agni Pengal – Empowering Women Entrepreneurs across India.`,
    openGraph: {
      title: `${product.name} | Agni Pengal`,
      description:
        product.description?.slice(0, 200) ||
        `Shop ${product.name} on Agni Pengal – India's marketplace for handmade and artisan products by women entrepreneurs.`,
      images: [
        ...(product.images || []).map((url: string) => ({
          url,
          width: 800,
          height: 600,
          alt: `${product.name} – available on Agni Pengal`,
        })),
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@agnipengal',
      title: `${product.name} | Agni Pengal`,
      description:
        product.description?.slice(0, 160) ||
        `Buy ${product.name} on Agni Pengal – Empowering Women Entrepreneurs.`,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
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
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  const product = await getProduct(productSlug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category._id, product._id);

  return (
    <div className='container mx-auto px-4 py-12'>
      <ProductViewTracker product={product} />
      <ProductDetails product={product} />

      {/* Combo Includes Section */}
      {product.isCombo && product.products && product.products.length > 0 && (
        <section className='mb-20 border-t border-gray-100 pt-16 bg-pink-50/50 rounded-3xl p-8 lg:p-12'>
          <div className='text-center mb-10'>
            <span className='text-pink-600 font-bold tracking-wider uppercase text-sm'>
              Great Value Bundle
            </span>
            <h2 className='text-3xl lg:text-4xl font-bold mt-2 text-gray-900'>
              What&apos;s Inside This Combo?
            </h2>
            <p className='text-gray-500 mt-3 max-w-2xl mx-auto'>
              This bundle includes {product.products.length} premium items curated specially for
              you.
            </p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {product.products.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <div id='reviews'>
        <ProductReviews productId={product._id} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className='mt-20 border-t border-gray-100 pt-16'>
          <h2 className='text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600'>
            You Might Also Like
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {relatedProducts.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.image || product.images?.[0],
            description: product.description,
            brand: {
              '@type': 'Brand',
              name: 'Agni Pengal',
              description: 'Empowering Women Entrepreneurs across India',
            },
            seller: {
              '@type': 'Organization',
              name: 'Agni Pengal',
              url: 'https://agnipengal.com',
            },
            offers: {
              '@type': 'Offer',
              url: `https://agnipengal.com/product/${product.slug || product._id}`,
              priceCurrency: 'INR',
              price: product.offerPrice || product.price,
              availability:
                product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
    </div>
  );
}
