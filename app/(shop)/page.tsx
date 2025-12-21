import React from 'react';
import Carousel from '@/components/shop/Carousel';
import ProductGridSection from '@/components/shop/sections/ProductGridSection';
import HomeCategories from '@/components/shop/sections/HomeCategories';
import RecentHistory from '@/components/shop/sections/RecentHistory';
import BuyAgain from '@/components/shop/sections/BuyAgain';
import api from '@/lib/api';
import { Package } from 'lucide-react';


// Force dynamic to ensure data is fresh
export const dynamic = 'force-dynamic';

async function getData() {
  try {
      // Fetch Config, Carousel, Products, Categories in parallel
      const [configRes, carouselRes, productsRes, categoriesRes] = await Promise.all([
          api.get('/config'),
          api.get('/carousel'),
          api.get('/products', { params: { limit: 20 } }), // Fetch enough products to filter locally or we could do specific calls
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
      console.error('Home Page Data Fetch Error:', error);
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
                  <section key={section.id} className="container mx-auto px-4 py-8">
                      <Carousel items={safeCarouselItems} />
                  </section>
              );
          case 'categories':
              return <HomeCategories key={section.id} categories={categories} title={section.title} />;
          case 'latest_products':
              return (
                  <ProductGridSection 
                      key={section.id} 
                      title={section.title || 'New Arrivals'} 
                      products={latestProducts} 
                      link="/products?sort=newest"
                  />
              );
          case 'featured_products':
              return (
                  <ProductGridSection 
                    key={section.id} 
                    title={section.title || 'Featured Collections'} 
                    products={featuredProducts} 
                    link="/products?feature=true" 
                  />
              );
          case 'deals_of_day':
              // Only render if there are deals
              if (dealsProducts.length === 0) return null;
              return (
                  <ProductGridSection 
                    key={section.id} 
                    title={section.title || 'Deals of the Day'} 
                    products={dealsProducts} 
                    link="/products?deals=true" 
                  />
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
    <div className="bg-gray-50/50 min-h-screen pb-20">
      {sections.map((section: any) => renderSection(section))}
      
      {/* If no sections defined/enabled, show fallback or check if config failed */}
      {sections.length === 0 && (
           <div className="container mx-auto px-4 py-20 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-500">Store is getting ready...</h2>
           </div>
      )}
    </div>
  );
}
