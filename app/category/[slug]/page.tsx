import React from 'react';
import dbConnect from '@/lib/db';
import CategoryModel from '@/lib/models/Category';
import Link from 'next/link';
import { notFound } from 'next/navigation';



export const dynamic = 'force-dynamic';

async function getCategory(slug: string) {
  await dbConnect();
  const category = await CategoryModel.findOne({ slug }).lean();
  return category ? JSON.parse(JSON.stringify(category)) : null;
}

export default async function SubCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600 mb-4">
            {category.name}
        </h1>
        <p className="text-gray-600">Explore subcategories</p>
      </div>

      {category.subcategories && category.subcategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {category.subcategories.map((sub: any) => (
            <Link 
                key={sub.slug} 
                href={`/category/${category.slug}/${sub.slug}`}
                className="group block p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-pink-200 transition-all text-center"
            >
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-50 rounded-full flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                    <span className="text-2xl text-pink-500 font-bold">{sub.name[0]}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {sub.name}
                </h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500">No subcategories found in this category.</p>
        </div>
      )}
    </div>
  );
}
