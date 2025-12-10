import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    image?: string;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3] shadow-sm group-hover:shadow-md transition-all">
        {/* Image Placeholder if no image */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
             {category.image ? (
                <Image src={category.image} alt={category.name} fill className="object-cover" />
             ) : (
                <span className="text-4xl font-light text-pink-300">{category.name[0]}</span>
             )}
        </div>
        
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white drop-shadow-md group-hover:translate-x-1 transition-transform">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
