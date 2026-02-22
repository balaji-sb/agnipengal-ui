'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Heart, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    offerPrice?: number; // Added offerPrice
    images: string[];
    category: { name: string; slug: string } | string;
    stock: number;
    activeDeal?: { name: string };
    variants?: { stock: number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const totalStock =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
      : product.stock;

  const isOutOfStock = totalStock <= 0;

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col h-full ${isOutOfStock ? 'opacity-75' : ''}`}
    >
      {/* Image Area */}
      <div className='relative aspect-[4/5] bg-gray-50 overflow-hidden'>
        {isOutOfStock && (
          <div className='absolute top-3 right-3 z-20 bg-gray-900/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider'>
            Out of Stock
          </div>
        )}
        {!isOutOfStock && product.activeDeal && (
          <div className='absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1'>
            <Sparkles className='w-3 h-3 text-white animate-pulse' />
            {product.activeDeal.name}
          </div>
        )}
        {!isOutOfStock &&
          !product.activeDeal &&
          product.offerPrice &&
          product.offerPrice > 0 &&
          product.offerPrice < product.price && (
            <div className='absolute top-3 left-3 z-20 bg-red-600/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm'>
              {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
            </div>
          )}
        <Link
          href={`/product/${product.slug}`}
          className={`block h-full w-full ${isOutOfStock ? 'pointer-events-none' : ''}`}
        >
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-700 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
            />
          ) : (
            <Image
              src={'/logo.jpg'}
              alt={product.name}
              fill
              className={`object-contain opacity-50 bg-white p-8 transition-transform duration-700 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
            />
          )}
          {/* <Image
            src={product.images[0] || '/logo.jpg'} 
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
          /> */}
          {/* Secondary Image on Hover (if available - future enhancement) */}
        </Link>

        {/* Quick Actions Overlay */}
        {!isOutOfStock && (
          <div className='absolute inset-x-0 bottom-4 flex justify-center gap-3 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 px-4'>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product);
              }}
              className={`p-3 rounded-full shadow-xl transition-colors transform hover:-translate-y-1 ${
                isInWishlist(product._id)
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white/90 backdrop-blur text-gray-900 hover:bg-red-50 hover:text-red-600 border border-white/50'
              }`}
              title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className='p-3 bg-gray-900/90 backdrop-blur text-white rounded-full shadow-xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 transition-all transform hover:-translate-y-1 flex items-center gap-2 px-6 border border-gray-800/50'
              title='Add to Cart'
            >
              <ShoppingCart className='w-5 h-5' />
              <span className='text-sm font-bold'>Add</span>
            </button>
            <Link
              href={`/product/${product.slug}`}
              className='p-3 bg-white/90 backdrop-blur text-gray-900 rounded-full shadow-xl hover:bg-red-50 hover:text-red-600 transition-colors transform hover:-translate-y-1 border border-white/50'
              title='Quick View'
            >
              <Eye className='w-5 h-5' />
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-5 flex flex-col flex-grow relative bg-white z-10'>
        <div className='mb-2'>
          <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors cursor-pointer'>
            {product.category && typeof product.category === 'object'
              ? product.category.name
              : 'Category'}
          </span>
        </div>
        <Link href={`/product/${product.slug}`} className='block mb-2'>
          <h3
            className={`text-[15px] font-bold text-gray-900 leading-snug transition-colors line-clamp-2 ${!isOutOfStock && 'group-hover:text-red-700'}`}
          >
            {product.name}
          </h3>
        </Link>
        <div className='mt-auto flex items-end justify-between border-t border-gray-100 pt-3'>
          <div className='flex flex-col'>
            {product.offerPrice && product.offerPrice > 0 && (
              <span className='text-xs text-gray-400 line-through mb-0.5'>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
            <span
              className={`text-[17px] font-bold tracking-tight ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}
            >
              ₹
              {(product.offerPrice && product.offerPrice > 0
                ? product.offerPrice
                : product.price
              ).toLocaleString('en-IN')}
            </span>
          </div>
          {/* Rating Stars could go here */}
        </div>
      </div>
    </div>
  );
}
