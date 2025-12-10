'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
      <select
        id="sort"
        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 bg-white border"
        onChange={handleSortChange}
        defaultValue={searchParams.get('sort') || 'newest'}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="popular">Popularity</option>
      </select>
    </div>
  );
}
