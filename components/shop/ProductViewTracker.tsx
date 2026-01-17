"use client";
import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

interface Product {
  _id: string;
  name: string;
  price: number;
  category?: { name: string };
  image?: string;
}

export default function ProductViewTracker({ product }: { product: Product }) {
  const { _id: productId, name, price, category } = product;

  useEffect(() => {
    if (!productId) return;

    // 1. Local Storage History (Existing Logic)
    const visitedInfo = localStorage.getItem('viewedProducts');
    let viewedProducts: string[] = visitedInfo ? JSON.parse(visitedInfo) : [];
    viewedProducts = viewedProducts.filter(id => id !== productId);
    viewedProducts.unshift(productId);
    if (viewedProducts.length > 10) {
        viewedProducts = viewedProducts.slice(0, 10);
    }
    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));

    // 2. Firebase Analytics Tracking
    if (analytics) {
      logEvent(analytics, 'view_item', {
        currency: 'INR',
        value: price,
        items: [
          {
            item_id: productId,
            item_name: name,
            item_category: category?.name || 'General',
            price: price,
            quantity: 1
          }
        ]
      });
      // console.log("Analytics: view_item logged", name);
    }

  }, [productId, name, price, category]);

  return null;
}
