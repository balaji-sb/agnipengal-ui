'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ProductCard from '@/components/shop/ProductCard';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface ProductInfiniteScrollProps {
  initialProducts: any[];
  searchParams: { [key: string]: string | string[] | undefined };
  initialPagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export default function ProductInfiniteScroll({ initialProducts, searchParams, initialPagination }: ProductInfiniteScrollProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPagination?.page || 1);
  const [hasMore, setHasMore] = useState(initialPagination ? initialPagination.page < initialPagination.totalPages : true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  useEffect(() => {
    setProducts(initialProducts);
    setPage(initialPagination?.page || 1);
    setHasMore(initialPagination ? initialPagination.page < initialPagination.totalPages : true);
  }, [initialProducts, initialPagination]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreProducts();
    }
  }, [inView, hasMore]);

  const loadMoreProducts = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params: any = { ...searchParams, page: nextPage, limit: 15 };
      
      // Clean up undefined params
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const res = await api.get('/products', { params });
      
      const newProducts = res.data.data;
      const pagination = res.data.pagination;

      if (newProducts.length > 0) {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(pagination ? pagination.page < pagination.totalPages : newProducts.length === 15);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any, index: number) => (
          <ProductCard key={`${product._id}-${index}`} product={product} />
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="flex justify-center items-center py-10 w-full">
            <div className="flex flex-col items-center gap-2 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                <span className="text-sm font-medium">Loading details...</span>
            </div>
        </div>
      )}
      
      {!hasMore && products.length > 0 && (
         <div className="text-center py-10 text-gray-400 text-sm">
            You've reached the end of the list
         </div>
      )}
    </>
  );
}
