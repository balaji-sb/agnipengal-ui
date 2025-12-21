'use client';

import React, { useEffect, useState } from 'react';
import ProductGridSection from './ProductGridSection';
import api from '@/lib/api';

export default function RecentHistory() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const viewed = localStorage.getItem('viewedProducts');
        if (viewed) {
          const ids = JSON.parse(viewed);
          if (ids.length > 0) {
            // Fetch product details for these IDs
            // We might need a specific endpoint or just filter from a larger list if simple
            // For now, let's assume we can pass IDs to a products endpoint or Promise.all individual fetches
            // Optimization: Create /products?ids=... endpoint later. 
            // Workaround: Fetch featured/latest and see if matches? No.
            // Let's implement a simple fetch loop for now as proof of concept, or rely on a new endpoint.
            // Actually, best to just hide if we can't fetch easily without backend change.
            // BUT, valid approach: Promise.all
            const promises = ids.slice(0, 4).map((id: string) => api.get(`/products/${id}`).catch(() => null));
            const results = await Promise.all(promises);
            const validProducts = results
                .filter(res => res && res.data && res.data.success)
                .map(res => res.data.data);
            
            setProducts(validProducts);
          }
        }
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <ProductGridSection 
      title="Recently Viewed" 
      products={products} 
      link="/products" 
      viewAllText="Start Shopping"
    />
  );
}
