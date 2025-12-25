import React from 'react';
import Carousel from '@/components/shop/Carousel';
import ProductGridSection from '@/components/shop/sections/ProductGridSection';
import HomeCategories from '@/components/shop/sections/HomeCategories';
import RecentHistory from '@/components/shop/sections/RecentHistory';
import BuyAgain from '@/components/shop/sections/BuyAgain';
import api from '@/lib/api';
import { Package, Sparkles } from 'lucide-react';
import * as Motion from 'framer-motion/client'; // Server Component compatible import

// Force dynamic to ensure data is fresh
export const dynamic = 'force-dynamic';

async function getData() {
  try {
      // Fetch Config, Carousel, Products, Categories in parallel
      const [configRes, carouselRes, productsRes, categoriesRes] = await Promise.all([
          api.get('/config'),
          api.get('/carousel'),
          api.get('/products', { params: { limit: 100 } }), // Fetch enough products to filter locally
          api.get('/categories')
      ]);

      const config = configRes.data.data || {};
      const carouselItems = carouselRes.data.data || [];
      const allProducts = productsRes.data.data || [];
      const categories = categoriesRes.data.data || [];

      // Filter products for different sections
      const latestProducts = allProducts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
      const featuredProducts = allProducts.filter((p: any) => p.isFeatured).slice(0, 8);
      const dealsProducts = allProducts.filter((p: any) => p.isDeal).slice(0, 8);
      
      // Default Sections if not configured
      let sections = config.homepageSections || [];
      if (!sections || sections.length === 0) {
          sections = [
              { id: 'banner', type: 'banner', order: 0, enabled: true },
              { id: 'categories', type: 'categories', order: 1, enabled: true },
              { id: 'deals', type: 'deals_of_day', title: 'Deals of the Day', order: 2, enabled: true },
              { id: 'featured', type: 'featured_products', title: 'Featured Collections', order: 3, enabled: true },
              { id: 'latest', type: 'latest_products', title: 'New Arrivals', order: 4, enabled: true },
          ];
      }

      // Sort sections by order
      sections.sort((a: any, b: any) => a.order - b.order);

      return {
          sections,
          carouselItems,
          categories,
          latestProducts,
          featuredProducts,
          dealsProducts
      };

  } catch (error) {
      console.error('Home Page data fetch error:', error);
      return { 
          sections: [], carouselItems: [], categories: [], 
          latestProducts: [], featuredProducts: [], dealsProducts: [] 
      };
  }
}

export default async function Home() {
  const { 
      sections, 
      carouselItems, 
      categories, 
      latestProducts, 
      featuredProducts, 
      dealsProducts 
  } = await getData();

  // Fallback for banner if empty
  const safeCarouselItems = carouselItems.length > 0 ? carouselItems : [
      { id: '1', title: 'Premium Aari Materials', image: 'https://images.unsplash.com/photo-1619551734325-81aaf323686c?auto=format&fit=crop&q=80', link: '/products' },
      { id: '2', title: 'Exquisite Sewing Kits', image: 'https://images.unsplash.com/photo-1594981441668-d4c38d22ddba?auto=format&fit=crop&q=80', link: '/category/sewing' },
  ];

  const renderSection = (section: any) => {
      if (!section.enabled) return null;

      switch (section.type) {
          case 'banner':
              return (
                  <section key={section.id} className="container mx-auto px-4 py-6 md:py-10 relative z-10">
                      <Carousel items={safeCarouselItems} />
                  </section>
              );
          case 'categories':
              return (
                <div key={section.id} className="relative z-10">
                    <HomeCategories categories={categories} title={section.title} />
                </div>
              );
          case 'latest_products':
              return (
                  <div key={section.id} className="relative z-10">
                    <ProductGridSection 
                        title={section.title || 'New Arrivals'} 
                        products={latestProducts} 
                        link="/products?sort=newest"
                    />
                  </div>
              );
          case 'featured_products':
              return (
                  <div key={section.id} className="relative z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-50/50 to-violet-50/50 -skew-y-3 z-0 transform scale-y-110" />
                      <div className="relative z-10">
                        <ProductGridSection 
                            title={section.title || 'Featured Collections'} 
                            products={featuredProducts} 
                            link="/products?feature=true" 
                        />
                      </div>
                  </div>
              );
          case 'deals_of_day':
              if (dealsProducts.length === 0) return null;
              return (
                  <div key={section.id} className="relative z-10 py-8">
                     <div className="container mx-auto px-4 mb-4 flex items-center gap-2">
                         <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                         <span className="text-sm font-bold text-yellow-600 uppercase tracking-widest">Limited Time Offers</span>
                     </div>
                      <ProductGridSection 
                        title={section.title || 'Deals of the Day'} 
                        products={dealsProducts} 
                        link="/products?deals=true" 
                      />
                  </div>
              );
          case 'buy_again':
              return <BuyAgain key={section.id} />;
          case 'recent_history':
              return <RecentHistory key={section.id} />;
          default:
              return null;
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 overflow-x-hidden relative">
      {/* Decorative Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/30 rounded-full blur-[100px] animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-violet-200/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 space-y-8 md:space-y-16">
        {sections.map((section: any) => renderSection(section))}
      </div>
      
      {/* Empty State */}
      {sections.length === 0 && (
           <div className="container mx-auto px-4 py-40 text-center relative z-10">
                <div className="bg-white/50 backdrop-blur-sm p-12 rounded-3xl inline-block border border-white/50 shadow-xl">
                    <Package className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-400">Store is getting ready...</h2>
                    <p className="text-gray-400 mt-2">Check back soon for amazing products!</p>
                </div>
           </div>
      )}
    </div>
  );
}
