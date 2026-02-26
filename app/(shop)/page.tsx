import React from 'react';
import type { Metadata } from 'next';
import Carousel from '@/components/shop/Carousel';
import ProductGridSection from '@/components/shop/sections/ProductGridSection';
import HomeCategories from '@/components/shop/sections/HomeCategories';
import RecentHistory from '@/components/shop/sections/RecentHistory';
import SearchHistorySection from '@/components/shop/sections/SearchHistorySection';
import BuyAgain from '@/components/shop/sections/BuyAgain';
import FeaturedShops from '@/components/sections/FeaturedShops';
import VendorCategorySection from '@/components/shop/sections/VendorCategorySection';
import HeroSection from '@/components/shop/sections/HeroSection';
import FeatureSection from '@/components/shop/sections/FeatureSection';
import SubscriptionPackagesSection from '@/components/shop/sections/SubscriptionPackagesSection';

import api from '@/lib/api';
import { Package, Sparkles } from 'lucide-react';
import * as Motion from 'framer-motion/client'; // Server Component compatible import

// Force dynamic to ensure data is fresh
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agni Pengal – Empowering Women Entrepreneurs',
  description:
    'Welcome to Agni Pengal – a community platform empowering women entrepreneurs across India. Discover handmade products, support women-owned businesses, and join a movement celebrating creativity and financial independence.',
  keywords: [
    'Agni Pengal',
    'Agni Pengal platform',
    'empowering women entrepreneurs India',
    'women empowerment marketplace',
    'women business community India',
    'support women owned businesses',
    'handmade products women India',
    'women artisans marketplace',
    'female entrepreneurs India',
    'buy from women India',
  ],
  openGraph: {
    title: 'Agni Pengal – Empowering Women Entrepreneurs',
    description:
      "Join Agni Pengal – India's platform empowering women entrepreneurs with a marketplace, mentorship, and community.",
    url: 'https://agnipengal.com',
    images: [{ url: 'https://agnipengal.com/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@agnipengal',
    title: 'Agni Pengal – Empowering Women Entrepreneurs',
    description: 'Join Agni Pengal – a community empowering women entrepreneurs across India.',
    images: ['https://agnipengal.com/og-image.jpg'],
  },
};

async function getData() {
  try {
    // 1. Fetch Layout first to determine what else to fetch
    const layoutRes = await api.get('/homepage-layout');
    const layout = layoutRes.data.data || [];

    // Determine needed data based on layout
    const hasDeals = layout.some((s: any) => s.type === 'deals' && s.isVisible);
    const hasCombos = layout.some((s: any) => s.type === 'combos' && s.isVisible);
    const hasProductGrid = layout.some((s: any) => s.type === 'product_grid' && s.isVisible);

    // 2. Prepare promises for conditional fetching
    // Always fetch core data
    const configPromise = api.get('/config');
    const carouselPromise = api.get('/carousel');
    const categoriesPromise = api.get('/categories');
    const vendorCategoriesPromise = api.get('/vendor-categories');

    // Conditional promises
    const productsPromise = hasProductGrid
      ? api.get('/products', { params: { limit: 100 } })
      : Promise.resolve({ data: { data: [] } });
    const dealsPromise = hasDeals
      ? api.get('/deals?activeOnly=true')
      : Promise.resolve({ data: { data: [] } });
    const combosPromise = hasCombos ? api.get('/combos') : Promise.resolve({ data: { data: [] } });
    const subscriptionPlansPromise = api.get('/subscription-plans');

    // 3. Execute all promises in parallel
    const [
      configRes,
      carouselRes,
      categoriesRes,
      vendorCategoriesRes,
      productsRes,
      dealsRes,
      combosRes,
      subscriptionPlansRes,
    ] = await Promise.all([
      configPromise,
      carouselPromise,
      categoriesPromise,
      vendorCategoriesPromise,
      productsPromise,
      dealsPromise,
      combosPromise,
      subscriptionPlansPromise,
    ]);

    const config = configRes.data.data || {};
    const carouselItems = carouselRes.data.data || [];
    const categories = categoriesRes.data.data || [];
    const vendorCategories = vendorCategoriesRes.data.data || [];
    const allProducts = productsRes.data.data || [];
    const dealsData = dealsRes.data.data || [];
    const combosData = combosRes.data.data || [];
    const subscriptionPlans = subscriptionPlansRes?.data?.data || [];

    // 4. Process Product Grids
    const latestProducts = allProducts
      .filter((p: any) => p.countInStock > 0 || p.stock > 0)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
    const featuredProducts = allProducts
      .filter((p: any) => p.isFeatured && (p.countInStock > 0 || p.stock > 0))
      .slice(0, 8);

    // Default layout fallback if empty
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
      dealsData,
      combosData,
      subscriptionPlans,
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
      dealsData: [],
      combosData: [],
      subscriptionPlans: [],
    };
  }
}

export default async function Home() {
  const {
    sections,
    carouselItems,
    categories,
    vendorCategories,
    latestProducts,
    featuredProducts,
    dealsData,
    combosData,
    subscriptionPlans,
  } = await getData();

  // Fallback for banner if empty
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
          {
            id: '2',
            title: 'Support Women Makers',
            image:
              'https://images.unsplash.com/photo-1594981441668-d4c38d22ddba?auto=format&fit=crop&q=80',
            link: '/category',
          },
        ];

  const renderSection = (section: any) => {
    if (!section.isVisible) return null; // Use isVisible from DB

    switch (section.type) {
      case 'carousel': // Match DB type
        return (
          <section key={section._id} className='relative z-10'>
            <Carousel items={safeCarouselItems} />
          </section>
        );
      case 'vendor_category':
        return <VendorCategorySection key={section._id} categories={vendorCategories} />;
      case 'shops':
        return <FeaturedShops />;
      case 'categories':
        return (
          <div key={section._id} className='relative z-10'>
            <HomeCategories categories={categories.slice(0, 5)} title={section.label} />
          </div>
        );
      case 'product_grid': // Generic product grid type
        // Decide which products to show based on section props or ID
        let productsToShow = [];
        let title = section.props?.title || section.label;

        if (section.sectionId === 'featured_products') productsToShow = featuredProducts;
        else if (section.sectionId === 'new_arrivals') productsToShow = latestProducts;
        else productsToShow = latestProducts; // Default for new sections

        return (
          <div key={section._id} className='relative z-10'>
            {/* Add background decoration for specific sections if needed */}
            {section.sectionId === 'featured_products' && (
              <div className='absolute inset-0 bg-gradient-to-r from-pink-50/50 to-violet-50/50 -skew-y-3 z-0 transform scale-y-110' />
            )}
            <div className='relative z-10'>
              <ProductGridSection title={title} products={productsToShow} link='/products' />
            </div>
          </div>
        );
      case 'deals': // Match DB type
        if (dealsData.length === 0) return null;
        // Map API deals to product grid format if necessary or use a dedicated DealCard
        // For now, assuming dealsData has product info or we just show the first few deals as a grid
        // The ProductGridSection expects 'products', let's see if dealsData matches that shape or if we need to extract products.
        // Deal model has 'products' array. If the API populates it, we can show them.
        // If the deal itself is the item, we might need a DealGrid.
        // Let's assume for now we want to show the products *inside* the active deals, or the deals themselves.
        // Given the previous code used `allProducts.filter(p => p.isDeal)`, it was showing PRODUCTS.
        // The new API returns DEAL objects.
        // We should probably show a "Deals" section where each card is a Deal.
        // Or, valid products from valid deals.
        // Let's create a flat list of products from all active deals for the grid, OR pass the deals to a DealGrid.
        // For simplicity and reuse: extract products from active deals.

        // However, Deal object structure: { name, products: [product objects], dealPrice... }
        // If we want to reuse ProductGridSection, we need an array of Products.
        // Let's aggregate all products from all deals.
        // Map products from deals and attach the dealPrice as the offerPrice
        const productsInDeals = dealsData.flatMap((d: any) => {
          return (d.products || []).map((p: any) => ({
            ...p,
            offerPrice: d.dealPrice, // Show deal price as the effective price
            // Prioritize Deal Image if available, else Product Image
            images: d.image ? [d.image] : p.images,
            // Pass deal info for badge
            activeDeal: { name: d.name },
            // Keep original price for strikethrough reference in ProductCard
          }));
        });
        // Remove duplicates if any (keeping the last deal price encountered if duplicate)
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

        // Similar to deals, we can show a grid of Combos or the products in them.
        // Combos usually sell as a unit. We should probably display the Combo itself.
        // ProductGridSection expects Products. Combo has { name, price, image, ... } which looks like a Product.
        // Let's try to pass combos as products to the grid, ensuring safety fields.
        // We might need to map them to have 'price' (it has 'price' or 'comboPrice'), 'images' (it has 'image'), etc.

        const combosAsProducts = combosData.map((c: any) => ({
          _id: c._id,
          name: c.name,
          slug: c._id, // Use ID as slug for combos to trigger the backend fallback
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
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-[100px] animate-blob' />
        <div className='absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-rose-100/30 rounded-full blur-[100px] animate-blob animation-delay-2000' />
        <div className='absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-orange-100/20 rounded-full blur-[100px] animate-blob animation-delay-4000' />
      </div>

      <HeroSection />
      {/* <FeatureSection /> */}
      {/* <SubscriptionPackagesSection plans={subscriptionPlans} /> */}

      <div className='relative z-10 space-y-8 md:space-y-2 mt-8'>
        {/* <SearchHistorySection /> */}

        {sections.map((section: any) => renderSection(section))}

        <BuyAgain />
        <RecentHistory />
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className='container mx-auto px-4 py-40 text-center relative z-10'>
          <div className='bg-orange-50/50 backdrop-blur-sm p-12 rounded-3xl inline-block border border-orange-100 shadow-xl'>
            <Package className='w-20 h-20 mx-auto text-orange-300 mb-6' />
            <h2 className='text-2xl font-bold text-gray-800'>Igniting Soon...</h2>
            <p className='text-gray-600 mt-2'>
              We are curating amazing handcrafted products for you.
            </p>
          </div>
        </div>
      )}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: 'Agni Pengal',
            image: 'https://agnipengal.com/logo.jpg',
            description:
              'Agni Pengal - Empowering Women Entrepreneurs. Shop handmade, tailored, and creative products.',
            url: 'https://agnipengal.com',
            telephone: '+91 880663116', // Update with real number if available
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'IN',
            },
            priceRange: '₹₹',
            sameAs: [
              // Add social media links here if available
              'https://www.instagram.com/agnipengal',
              // Placeholder until verified
            ],
          }),
        }}
      />
    </div>
  );
}
