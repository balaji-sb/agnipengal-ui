'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface WishlistContextType {
  wishlist: any[]; // Full product objects
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: any) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch wishlist on user login
  useEffect(() => {
    if (user) {
        fetchWishlist();
    } else {
        setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
        setLoading(true);
        const res = await api.get('/wishlist');
        setWishlist(res.data); // Expecting array of populated products
    } catch (error) {
        console.error('Failed to fetch wishlist', error);
    } finally {
        setLoading(false);
    }
  };

  const toggleWishlist = async (product: any) => {
    if (!user) {
        toast.error('Please login to use wishlist');
        return;
    }

    const productId = product._id;
    const isAdded = !isInWishlist(productId);

    // Optimistic Update
    let newWishlist;
    if (isAdded) {
        newWishlist = [...wishlist, product];
    } else {
        newWishlist = wishlist.filter(p => p._id !== productId);
    }
    setWishlist(newWishlist);

    try {
        const res = await api.post('/wishlist/toggle', { productId });
        toast.success(res.data.message);
    } catch (error) {
        console.error('Wishlist toggle failed', error);
        toast.error('Something went wrong');
        // Revert (fetch fresh)
        fetchWishlist(); 
    }
  };

  const addToWishlist = async (product: any) => {
      if (!isInWishlist(product._id)) {
          await toggleWishlist(product);
      }
  };

  const removeFromWishlist = async (productId: string) => {
      if (isInWishlist(productId)) {
          // Find dummy product or fetched one in list
          const product = wishlist.find(p => p._id === productId) || { _id: productId };
          await toggleWishlist(product);
      }
  };

  const isInWishlist = (productId: string) => {
      return wishlist.some(p => p._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
