import React from 'react';
import ProductDetails from '@/components/shop/ProductDetails';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import ProductReviews from '@/components/shop/ProductReviews';
import ProductViewTracker from '@/components/shop/ProductViewTracker';
import api from '@/lib/api-server';
import { Metadata, ResolvingMetadata } from 'next';

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

async function getProduct(slug: string) {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getProductReviews(productId: string) {
  try {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

async function getRelatedProducts(category: string, currentId: string) {
  try {
    const res = await api.get(`/products?category=${category}`);
    const products = res.data.data || [];
    return products.filter((p: any) => p._id !== currentId).slice(0, 4);
  } catch (error) {
    return [];
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
      title: 'Product Not Found | Agnipengal',
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');
  const productUrl = `${siteUrl}/product/${productSlug}`;
  
  // Ensure images are absolute
  const images = (product.images || []).map((img: string) => 
    img.startsWith('http') ? img : `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`
  );

  const title = `${product.name} | Agnipengal`;
  const description = product.description?.slice(0, 160) || 
    `Buy ${product.name} on Agnipengal – high-quality products from women entrepreneurs across India.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      product.name,
      product.category?.name,
      'Agnipengal',
      'women entrepreneurs India',
      'handmade products',
      'buy from women',
    ].filter(Boolean),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: productUrl,
      siteName: 'Agnipengal',
      images: images.map((url: string) => ({
        url,
        width: 1200,
        height: 630,
        alt: product.name,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.slice(0, 1),
    },
  };
}

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

  const reviews = await getProductReviews(product._id);
  const relatedProducts = product.category?._id 
    ? await getRelatedProducts(product.category._id, product._id)
    : [];

  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');
  const productUrl = `${siteUrl}/product/${productSlug}`;

  // Calculate rating for schema
  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
    : 0;

  // Format images for schema
  const schemaImages = (product.images || []).map((img: string) => 
    img.startsWith('http') ? img : `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`
  );

  return (
    <div className='container mx-auto px-4 py-12'>
      {/* Product View Tracker for Analytics */}
      <ProductViewTracker product={product} />
      
      {/* Product Details Component */}
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
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {relatedProducts.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Product JSON-LD Schema – Advanced for URL Inspection & Rich Results */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: schemaImages,
            description: product.description || `Buy ${product.name} on Agnipengal`,
            sku: product._id,
            mpn: product.slug || product._id,
            brand: {
              '@type': 'Brand',
              name: 'Agnipengal',
            },
            ...(avgRating > 0 && {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: avgRating.toFixed(1),
                reviewCount: reviews.length,
                bestRating: '5',
                worstRating: '1',
              },
            }),
            ...(reviews.length > 0 && {
              review: reviews.slice(0, 5).map((r: any) => ({
                '@type': 'Review',
                author: { '@type': 'Person', name: r.user?.name || 'Anonymous' },
                datePublished: r.createdAt?.split('T')[0],
                reviewBody: r.comment,
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: r.rating,
                  bestRating: '5',
                  worstRating: '1',
                },
              })),
            }),
            offers: {
              '@type': 'Offer',
              url: productUrl,
              priceCurrency: 'INR',
              price: product.offerPrice || product.price,
              priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              itemCondition: 'https://schema.org/NewCondition',
              availability: (product.countInStock > 0 || product.stock > 0)
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'Agnipengal',
                url: siteUrl,
              },
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                  '@type': 'MonetaryAmount',
                  value: '0',
                  currency: 'INR',
                },
                shippingDestination: {
                  '@type': 'DefinedRegion',
                  addressCountry: 'IN',
                },
              },
              hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'IN',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
                merchantReturnDays: 7,
                returnMethod: 'https://schema.org/ReturnByMail',
                returnFees: 'https://schema.org/FreeReturn',
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
                item: siteUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: `${siteUrl}/products`,
              },
              ...(product.category
                ? [
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: product.category.name,
                      item: `${siteUrl}/category/${product.category.slug || product.category._id}`,
                    },
                    {
                      '@type': 'ListItem',
                      position: 4,
                      name: product.name,
                      item: productUrl,
                    },
                  ]
                : [
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: product.name,
                      item: productUrl,
                    },
                  ]),
            ],
          }),
        }}
      />
    </div>
  );
}
