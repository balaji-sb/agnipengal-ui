import React from 'react';
import type { Metadata } from 'next';
import Carousel from '@/components/shop/Carousel';
import RecentProductsCarousel from '@/components/shop/sections/RecentProductsCarousel';
import ProductGridSection from '@/components/shop/sections/ProductGridSection';
import HomeCategories from '@/components/shop/sections/HomeCategories';
import RecentHistory from '@/components/shop/sections/RecentHistory';
import BuyAgain from '@/components/shop/sections/BuyAgain';
import FeaturedShops from '@/components/sections/FeaturedShops';
import VendorCategorySection from '@/components/shop/sections/VendorCategorySection';
import StatsSection from '@/components/sections/StatsSection';

import api from '@/lib/api-server';
import { Package, Sparkles } from 'lucide-react';

// Force dynamic to ensure data is fresh
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return {
    metadataBase: new URL(siteUrl),
    title: 'Agnipengal – Empowering Women Entrepreneurs',
    description:
      'Welcome to Agnipengal – a community platform empowering women entrepreneurs across India. Discover handmade products, support women-owned businesses, and join a movement celebrating creativity and financial independence.',
    keywords: [
      'Agnipengal',
      'empowering women entrepreneurs India',
      'women empowerment marketplace',
      'women business community India',
      'support women owned businesses',
      'handmade products women India',
      'women artisans marketplace',
      'female entrepreneurs India',
      'buy from women India',
      'Agnipengal marketplace',
      'handmade in India',
      'Aari embroidery India',
    ],
    openGraph: {
      title: 'Agnipengal – Empowering Women Entrepreneurs',
      description:
        "Join Agnipengal – India's platform empowering women entrepreneurs with a marketplace, mentorship, and community.",
      url: siteUrl,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@agnipengal',
      title: 'Agnipengal – Empowering Women Entrepreneurs',
      description: 'Join Agnipengal – a community empowering women entrepreneurs across India.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

async function getData() {
  try {
    // 1. Fetch Layout first
    const layoutRes = await api.get('/homepage-layout');
    const layout = layoutRes.data.data || [];

    // Determine needed data based on layout
    const hasDeals = layout.some((s: any) => s.type === 'deals' && s.isVisible);
    const hasCombos = layout.some((s: any) => s.type === 'combos' && s.isVisible);
    const hasProductGrid = layout.some((s: any) => s.type === 'product_grid' && s.isVisible);

    // 2. Prepare promises for parallel execution using api-server
    const carouselPromise = api.get('/carousel');
    const categoriesPromise = api.get('/categories');
    const vendorCategoriesPromise = api.get('/vendor-categories');
    const productsPromise = hasProductGrid
      ? api.get('/products?limit=100')
      : Promise.resolve({ data: { data: [] } });
    const dealsPromise = hasDeals
      ? api.get('/deals?activeOnly=true')
      : Promise.resolve({ data: { data: [] } });
    const combosPromise = hasCombos ? api.get('/combos') : Promise.resolve({ data: { data: [] } });

    const [
      carouselRes,
      categoriesRes,
      vendorCategoriesRes,
      productsRes,
      dealsRes,
      combosRes,
    ] = await Promise.all([
      carouselPromise,
      categoriesPromise,
      vendorCategoriesPromise,
      productsPromise,
      dealsPromise,
      combosPromise,
    ]);

    const carouselItems = carouselRes.data.data || [];
    const categories = categoriesRes.data.data || [];
    const vendorCategories = vendorCategoriesRes.data.data || [];
    const allProducts = productsRes.data.data || [];
    const dealsData = dealsRes.data.data || [];
    const combosData = combosRes.data.data || [];

    // 4. Process Product Grids
    const recentlyAddedProducts = [...allProducts]
      .filter((p: any) => p.countInStock > 0 || p.stock > 0)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const shuffleArray = (array: any[]) => {
      let shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const inStockProducts = allProducts.filter((p: any) => p.countInStock > 0 || p.stock > 0);
    const shuffledProducts = shuffleArray(inStockProducts);

    const latestProducts = shuffledProducts.slice(0, 8);
    const featuredPool = inStockProducts.filter((p: any) => p.isFeatured);
    const featuredProducts = shuffleArray(featuredPool).slice(0, 8);

    const sections =
      layout.length > 0
        ? layout
        : [
            { sectionId: 'hero_carousel', type: 'carousel', order: 1, isVisible: true },
            { sectionId: 'categories', type: 'categories', order: 2, isVisible: true },
            { sectionId: 'featured_products', type: 'product_grid', order: 3, isVisible: true },
            { sectionId: 'deals', type: 'deals', order: 4, isVisible: true },
            { sectionId: 'new_arrivals', type: 'product_grid', order: 5, isVisible: true },
            { sectionId: 'combos', type: 'combos', order: 6, isVisible: true },
          ];

    return {
      sections,
      carouselItems,
      categories,
      vendorCategories,
      latestProducts,
      featuredProducts,
      recentlyAddedProducts,
      dealsData,
      combosData,
    };
  } catch (error) {
    console.error('Home Page data fetch error:', error);
    return {
      sections: [],
      carouselItems: [],
      categories: [],
      vendorCategories: [],
      latestProducts: [],
      featuredProducts: [],
      recentlyAddedProducts: [],
      dealsData: [],
      combosData: [],
    };
  }
}

export default async function Home() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  const {
    sections,
    carouselItems,
    categories,
    vendorCategories,
    latestProducts,
    featuredProducts,
    recentlyAddedProducts,
    dealsData,
    combosData,
  } = await getData();

  const safeCarouselItems =
    carouselItems.length > 0
      ? carouselItems
      : [
          {
            id: '1',
            title: 'Handcrafted Elegance',
            image:
              'https://images.unsplash.com/photo-1605369651713-33e10bdcecfd?auto=format&fit=crop&q=80',
            link: '/products',
          },
        ];

  const renderSection = (section: any) => {
    if (!section.isVisible) return null;

    switch (section.type) {
      case 'carousel':
        return (
          <section key={section._id} className='relative z-10'>
            <Carousel items={safeCarouselItems} />
          </section>
        );
      case 'vendor_category':
        return <VendorCategorySection key={section._id} categories={vendorCategories} />;
      case 'shops':
        return <FeaturedShops key={section._id} />;
      case 'categories':
        return (
          <div key={section._id} className='relative z-10'>
            <HomeCategories categories={categories.slice(0, 5)} title={section.label} />
          </div>
        );
      case 'product_grid':
        let productsToShow = [];
        let title = section.props?.title || section.label;

        if (section.sectionId === 'featured_products') productsToShow = featuredProducts;
        else if (section.sectionId === 'new_arrivals') productsToShow = latestProducts;
        else productsToShow = latestProducts;

        return (
          <div key={section._id} className='relative z-10'>
            {section.sectionId === 'featured_products' && (
              <div className='absolute inset-0 bg-gradient-to-r from-pink-50/50 to-violet-50/50 -skew-y-3 z-0 transform scale-y-110' />
            )}
            <div className='relative z-10'>
              <ProductGridSection title={title} products={productsToShow} link='/products' />
            </div>
          </div>
        );
      case 'deals':
        if (dealsData.length === 0) return null;
        const productsInDeals = dealsData.flatMap((d: any) => {
          return (d.products || []).map((p: any) => ({
            ...p,
            offerPrice: d.dealPrice,
            images: d.image ? [d.image] : p.images,
            activeDeal: { name: d.name },
          }));
        });
        const uniqueDealProducts = Array.from(
          new Map(productsInDeals.map((p: any) => [p._id, p])).values(),
        );

        if (uniqueDealProducts.length === 0) return null;

        return (
          <div key={section._id} className='relative z-10 py-8'>
            <div className='container mx-auto px-4 mb-4 flex items-center gap-2'>
              <Sparkles className='w-6 h-6 text-yellow-500 animate-pulse' />
              <span className='text-sm font-bold text-yellow-600 uppercase tracking-widest'>
                {section.label || 'Limited Time Offers'}
              </span>
            </div>
            <ProductGridSection
              title={section.label || 'Deals of the Day'}
              products={uniqueDealProducts}
              link='/deals'
            />
          </div>
        );
      case 'combos':
        if (combosData.length === 0) return null;
        const combosAsProducts = combosData.map((c: any) => ({
          _id: c._id,
          name: c.name,
          slug: c._id,
          price: c.price,
          images: c.image ? [c.image] : [],
          category: { name: 'Combo' },
          description: c.description,
        }));

        return (
          <div key={section._id} className='relative z-10 py-8'>
            <ProductGridSection
              title={section.label || 'Super Saver Combos'}
              products={combosAsProducts}
              link='/combos'
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen pb-20 overflow-x-hidden relative'>
      {/* Decorative Background Blobs */}
      <div className='fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0'>
        <div className='absolute top-[-5%] left-[-10%] md:top-[-10%] md:left-[-10%] w-[60%] h-[30%] md:w-[40%] md:h-[40%] bg-amber-100/30 rounded-full blur-[60px] md:blur-[100px]' />
        <div className='absolute top-[15%] right-[-10%] md:top-[20%] md:right-[-10%] w-[50%] h-[25%] md:w-[35%] md:h-[35%] bg-rose-100/30 rounded-full blur-[60px] md:blur-[100px]' />
      </div>

      <div className='relative z-10 space-y-3 md:space-y-2'>
        {sections.map((section: any) => {
          const renderedSection = renderSection(section);
          if (section.type === 'carousel' && section.isVisible) {
            return (
              <React.Fragment key={section._id}>
                {renderedSection}
                <RecentProductsCarousel products={recentlyAddedProducts} />
              </React.Fragment>
            );
          }
          return renderedSection;
        })}
        <StatsSection />
        <BuyAgain />
        <div className='relative z-10 space-y-3 md:space-y-2 mt-5'>
          <RecentHistory />
        </div>
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className='container mx-auto px-4 py-20 text-center relative z-10'>
          <div className='bg-orange-50/50 backdrop-blur-sm p-12 rounded-3xl inline-block border border-orange-100 shadow-xl'>
            <Package className='w-20 h-20 mx-auto text-orange-300 mb-6' />
            <h2 className='text-2xl font-bold text-gray-800'>Igniting Soon...</h2>
          </div>
        </div>
      )}

      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Agnipengal',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/products?search={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'Agnipengal',
              image: `${siteUrl}/logo.jpg`,
              description: 'Agnipengal - Empowering Women Entrepreneurs.',
              url: siteUrl,
              telephone: '+91 8088663116',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Chennai',
                addressRegion: 'Tamil Nadu',
                addressCountry: 'IN',
              },
              priceRange: '₹₹',
              sameAs: [
                'https://www.instagram.com/agnipengal/',
                'https://www.facebook.com/agnipengal',
                'https://www.youtube.com/@agnipengaldotcom',
              ],
            },
          ]),
        }}
      />
    </div>
  );
}
