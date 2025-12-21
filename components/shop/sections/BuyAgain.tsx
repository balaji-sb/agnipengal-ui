'use client';

import React, { useEffect, useState } from 'react';
import ProductGridSection from './ProductGridSection';
import api from '@/lib/api';
import { useAuth } from '@/lib/context/AuthContext';

export default function BuyAgain() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user) {
        const fetchBuyAgain = async () => {
            try {
                // Ideally this should be a dedicated endpoint like /orders/buy-again
                // For now, we'll fetch orders and extract unique products
                const res = await api.get('/orders/myorders');
                if (res.data.success) {
                    const orders = res.data.data;
                    const allItems: any[] = [];
                    orders.forEach((order: any) => {
                        if (order.items) {
                            order.items.forEach((item: any) => {
                                if (item.product) allItems.push(item.product);
                            });
                        }
                    });
                    
                    // Deduplicate by ID
                    const uniqueProducts = Array.from(new Map(allItems.map(item => [item._id, item])).values());
                    setProducts(uniqueProducts.slice(0, 4) as any);
                }
            } catch (error) {
                console.error('Failed to fetch buy again', error);
            }
        };
        fetchBuyAgain();
    }
  }, [user]);

  if (!user || products.length === 0) return null;

  return (
    <ProductGridSection 
      title="Buy Again" 
      products={products} 
      link="/profile/orders" 
      viewAllText="View Orders"
    />
  );
}
