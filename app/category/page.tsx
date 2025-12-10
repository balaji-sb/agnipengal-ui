import React from 'react';
import dbConnect from '@/lib/db';
import CategoryModel from '@/lib/models/Category';
import CategoryCard from '@/components/shop/CategoryCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getCategories() {
  await dbConnect();
  const categories = await CategoryModel.find({}).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(categories));
}

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600">
        All Categories
      </h1>
      
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat: any) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No categories found.</p>
        </div>
      )}
    </div>
  );
}
