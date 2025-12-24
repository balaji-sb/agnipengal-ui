'use client';

import React from 'react';
import { useWishlist } from '@/lib/context/WishlistContext';
import ProductCard from '@/components/shop/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();
  const { user } = useAuth();
  
  // Need to fetch full product details for the wishlist items
  // The context currently stores IDs (or we need to update context to store objects)
  // Re-reading context: "setWishlist(ids)". Context only has IDs.
  // We need a way to get products. 
  // OPTION 1: Update Context to store full products.
  // OPTION 2: Fetch products here based on IDs (inefficient if many).
  // OPTION 3: Context actually fetches full products, so let's update Context to store generic objects or fetch here.
  
  // Let's check backend: `getWishlist` returns `wishlist.products` (populated).
  // In Context: `const ids = res.data.map((p: any) => p._id);` -> This discards data.
  // I should update Context to store full products.
  
  // For now, I'll put a placeholder and simultaneous update the Context in next step.
  // Let's assume I will fix Context to return objects.
  
  return (
     <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-600 fill-pink-600" />
            My Wishlist
        </h1>

        {!user ? (
             <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <p className="text-xl text-gray-600 mb-4">Please login to view your wishlist</p>
                <Link href="/login" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full font-bold">
                    Login
                </Link>
            </div>
        ) : loading ? (
            <div className="text-center py-20">Loading...</div>
        ) : wishlist.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-400 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-6">Start saving items you love!</p>
                <Link href="/products" className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-700 transition">
                    <ShoppingBag className="w-5 h-5" />
                    Browse Products
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* 
                   We need to map these. 
                   NOTE: I will update Context to provide full product objects.
                   For now, this File is created with the assumption that `wishlist` will contain objects.
                   If `wishlist` is string[], this will break. 
                   I will fix Context immediately after this.
                */}
                 {/* @ts-ignore */}
                {wishlist.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        )}
     </div>
  );
}
