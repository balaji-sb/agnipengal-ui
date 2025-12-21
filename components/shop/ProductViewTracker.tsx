'use client';

import { useEffect } from 'react';

export default function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    if (!productId) return;

    const visitedInfo = localStorage.getItem('viewedProducts');
    let viewedProducts: string[] = visitedInfo ? JSON.parse(visitedInfo) : [];

    // Remove if already exists (to move to front)
    viewedProducts = viewedProducts.filter(id => id !== productId);
    
    // Add to front
    viewedProducts.unshift(productId);
    
    // Limit to 10
    if (viewedProducts.length > 10) {
        viewedProducts = viewedProducts.slice(0, 10);
    }

    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
  }, [productId]);

  return null;
}
