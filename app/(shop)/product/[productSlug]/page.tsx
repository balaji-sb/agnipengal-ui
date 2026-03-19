import React from 'react';
import ProductDetails from '@/components/shop/ProductDetails';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import ProductReviews from '@/components/shop/ProductReviews';
import ProductViewTracker from '@/components/shop/ProductViewTracker';
import api from '@/lib/api';
import { getTranslations } from 'next-intl/server';

// ISR: revalidate every 10 minutes so Googlebot gets fast cached HTML
export const revalidate = 600;

// Pre-render the top 100 products at build time for instant first load
export async function generateStaticParams() {
  try {
    const res = await api.get('/products?limit=100&sort=newest');
    const products = res.data?.data || [];
    return products.map((p: { slug?: string; _id: string }) => ({
      productSlug: p.slug || p._id,
    }));
  } catch {
    return [];
  }
}

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

  const siteUrl = 'https://agnipengal.com';
  const productUrl = `${siteUrl}/product/${productSlug}`;

  return {
    metadataBase: new URL(siteUrl),
    title: `${product.name} | Agnipengal`,
    description:
      product.description?.slice(0, 160) ||
      `Buy ${product.name} from women-owned businesses on Agnipengal - Empowering Women Entrepreneurs across India.`,
    keywords: [
      product.name,
      product.category?.name,
      'women entrepreneurs',
      'handmade India',
      'Agnipengal',
      'women marketplace India',
      'made in india',
      'buy from women owned businesses',
      'Agnipengal shop',
      'handmade products India',
      'artisan products India',
      'sustainable products India',
      'ethical shopping India',
      'support women entrepreneurs',
      'Indian crafts',
      'unique gifts India',
      'made in india marketplace',
      'women entrepreneur marketplace',
    ].filter(Boolean),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: 'website' as const,
      title: `${product.name} | Agnipengal`,
      description:
        product.description?.slice(0, 200) ||
        `Shop ${product.name} on Agnipengal – India's marketplace for handmade and artisan products by women entrepreneurs.`,
      url: productUrl,
      siteName: 'Agnipengal',
      images: [
        ...(product.images || []).map((imgUrl: string) => ({
          url: imgUrl,
          width: 800,
          height: 600,
          alt: `${product.name} – available on Agnipengal`,
        })),
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@agnipengal',
      title: `${product.name} | Agnipengal`,
      description:
        product.description?.slice(0, 160) ||
        `Buy ${product.name} on Agnipengal – Empowering Women Entrepreneurs.`,
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
  const t = await getTranslations('ProductDetails');
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
              {t('greatValueBundle')}
            </span>
            <h2 className='text-3xl lg:text-4xl font-bold mt-2 text-gray-900'>
              {t('whatsInsideCombo')}
            </h2>
            <p className='text-gray-500 mt-3 max-w-2xl mx-auto'>
              {t('comboIncludes', { count: product.products.length })}
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
            {t('youMightAlsoLike')}
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {relatedProducts.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
      {/* Product JSON-LD Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.images?.length > 0 ? product.images : [product.image].filter(Boolean),
            description: product.description,
            sku: product.slug || product._id,
            brand: {
              '@type': 'Brand',
              name: 'Agnipengal',
            },
            category: product.category?.name,
            offers: {
              '@type': 'Offer',
              url: `https://agnipengal.com/product/${productSlug}`,
              priceCurrency: 'INR',
              price: product.offerPrice || product.price,
              priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
              itemCondition: 'https://schema.org/NewCondition',
              availability:
                product.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'Agnipengal',
                url: 'https://agnipengal.com',
              },
            },
          }),
        }}
      />
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
                name: 'Products',
                item: 'https://agnipengal.com/products',
              },
              ...(product.category
                ? [
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: product.category.name,
                      item: `https://agnipengal.com/category/${product.category.slug || product.category._id}`,
                    },
                    {
                      '@type': 'ListItem',
                      position: 4,
                      name: product.name,
                      item: `https://agnipengal.com/product/${productSlug}`,
                    },
                  ]
                : [
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: product.name,
                      item: `https://agnipengal.com/product/${productSlug}`,
                    },
                  ]),
            ],
          }),
        }}
      />
    </div>
  );
}
