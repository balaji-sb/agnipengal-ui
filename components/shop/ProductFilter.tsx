'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentStock = searchParams.get('inStock') === 'true';

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Price</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            className="w-20 p-2 border rounded-md text-sm"
            value={currentMinPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-20 p-2 border rounded-md text-sm"
            value={currentMaxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Availability</h3>
        <label className="flex items-center space-x-2">
            <input 
                type="checkbox" 
                checked={currentStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
                className="rounded text-pink-600 focus:ring-pink-500" 
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Materials (Hardcoded for Demo) */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Material</h3>
        <div className="space-y-2">
            {['Silk', 'Cotton', 'Zardosi', 'Beads', 'Stone'].map((mat) => (
                <label key={mat} className="flex items-center space-x-2">
                    <input 
                        type="radio" 
                        name="material"
                        value={mat}
                        checked={searchParams.get('material') === mat}
                        onChange={(e) => handleFilterChange('material', e.target.value)}
                        className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">{mat}</span>
                </label>
            ))}
             <label className="flex items-center space-x-2">
                    <input 
                        type="radio" 
                        name="material"
                        value=""
                        checked={!searchParams.get('material')}
                        onChange={(e) => handleFilterChange('material', '')}
                        className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">All</span>
                </label>
        </div>
      </div>
      
       <button 
        onClick={() => router.push(window.location.pathname)}
        className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition"
       >
           Clear Filters
       </button>
    </div>
  );
}
