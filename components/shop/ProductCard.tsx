'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category: { name: string, slug: string } | string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}>
      {/* Image Area */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
         {isOutOfStock && (
             <div className="absolute top-2 right-2 z-20 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                 Out of Stock
             </div>
         )}
        <Link href={`/product/${product.slug}`} className={isOutOfStock ? 'pointer-events-none' : ''}>
          <Image
            src={product.images[0] || '/placeholder.png'} 
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
          />
        </Link>
        {!isOutOfStock && (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    addItem(product);
                }} 
                className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-md text-gray-900 hover:text-pink-600 hover:scale-110 transition translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                title="Add to Cart"
            >
                <ShoppingCart className="w-5 h-5" />
            </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
            <span className="text-xs font-medium text-pink-500 bg-pink-50 px-2 py-1 rounded-full uppercase tracking-wider">
                {product.category && typeof product.category === 'object' ? product.category.name : 'Category'}
            </span>
        </div>
        <Link href={`/product/${product.slug}`} className="block">
            <h3 className={`text-lg font-semibold text-gray-900 transition-colors line-clamp-2 ${!isOutOfStock && 'group-hover:text-pink-600'}`}>
            {product.name}
            </h3>
        </Link>
        <div className="mt-auto pt-3 flex items-center justify-between">
            <span className={`text-xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>₹{product.price}</span>
            {isOutOfStock && (
                <span className="text-xs text-red-500 font-medium">Sold Out</span>
            )}
        </div>
      </div>
    </div>
  );
}
