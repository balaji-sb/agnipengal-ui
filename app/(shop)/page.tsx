import React from 'react';
import Carousel from '@/components/shop/Carousel';
import ProductCard from '@/components/shop/ProductCard';
import CategoryCard from '@/components/shop/CategoryCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Force dynamic to ensure data is fresh
export const dynamic = 'force-dynamic';

import api from '@/lib/api';

// ...

async function getData() {
  try {
      const [carouselRes, featuredRes, categoriesRes] = await Promise.all([
          api.get('/carousel'),
          api.get('/products', { params: { isFeatured: true, limit: 8 } }),
          api.get('/categories')
      ]);

      return {
        carouselItems: carouselRes.data.data || [],
        featuredProducts: featuredRes.data.data || [],
        categories: categoriesRes.data.data || [],
      };
  } catch (error) {
      console.error('Home Page Data Fetch Error:', error);
      return { carouselItems: [], featuredProducts: [], categories: [] };
  }
}

export default async function Home() {
  const { carouselItems, featuredProducts, categories } = await getData();

  // Fallback if no carousel data
  const safeCarouselItems = carouselItems.length > 0 ? carouselItems : [
      { id: '1', title: 'Premium Aari Materials', image: 'https://images.unsplash.com/photo-1619551734325-81aaf323686c?auto=format&fit=crop&q=80', link: '/products' },
      { id: '2', title: 'Exquisite Sewing Kits', image: 'https://images.unsplash.com/photo-1594981441668-d4c38d22ddba?auto=format&fit=crop&q=80', link: '/category/sewing' },
       // Add placeholders to ensure UI looks good initially
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      {/* Carousel Section */}
      <section className="container mx-auto px-4 py-8">
        <Carousel items={safeCarouselItems} />
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Shop by Category
          </h2>
          <Link href="/category" className="flex items-center text-pink-600 font-medium hover:text-pink-700 transition">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat: any) => (
                <CategoryCard key={cat._id} category={cat} />
            ))}
            </div>
        ) : (
             <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">Categories coming soon.</p>
             </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Featured Collections
          </h2>
           <Link href="/products" className="flex items-center text-pink-600 font-medium hover:text-pink-700 transition">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
            ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No featured products yet.</p>
             </div>
        )}
      </section>
      
      {/* Newsletter / CTA Section could go here */}
    </div>
  );
}
