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
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Background Image or Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center text-gray-400">
             {category.image ? (
                <Image 
                    src={category.image} 
                    alt={category.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
             ) : (
                <Image 
                    src="/logo.jpg" 
                    alt={category.name} 
                    fill 
                    className="object-contain p-8 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                />
             )}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
          <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
              <h3 className="text-2xl font-bold text-white drop-shadow-md mb-1 relative inline-block">
                {category.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </h3>
              <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 translate-y-2 group-hover:translate-y-0">
                  Explore Collection
              </p>
          </div>
        </div>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 z-10 block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute -inset-full top-0 block w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </div>
      </div>
    </Link>
  );
}
