'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactSlider from 'react-slider';

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const MIN_PRICE = 0;
  const MAX_PRICE = 10000; // Define a reasonable max price or fetch from backend if possible

  const currentMinPrice = Number(searchParams.get('minPrice')) || MIN_PRICE;
  const currentMaxPrice = Number(searchParams.get('maxPrice')) || MAX_PRICE;

  const [priceRange, setPriceRange] = useState([currentMinPrice, currentMaxPrice]);

  useEffect(() => {
    setPriceRange([
      Number(searchParams.get('minPrice')) || MIN_PRICE,
      Number(searchParams.get('maxPrice')) || MAX_PRICE
    ]);
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handleSliderChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleSliderCommit = (values: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('minPrice', values[0].toString());
    params.set('maxPrice', values[1].toString());
    router.push(`?${params.toString()}`);
  };

  const currentStock = searchParams.get('inStock') === 'true';

  return (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
        <div className="px-2">
            <ReactSlider
                className="h-1 bg-gray-200 rounded-full cursor-pointer"
                thumbClassName="w-5 h-5 bg-pink-600 rounded-full cursor-grab focus:outline-none -mt-2 shadow-sm border-2 border-white"
                trackClassName="bg-pink-600 h-1 rounded-full"
                value={priceRange}
                min={MIN_PRICE}
                max={MAX_PRICE}
                onChange={handleSliderChange}
                onAfterChange={handleSliderCommit}
                pearling
                minDistance={100}
            />
        </div>
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-gray-50">
                 <span className="text-xs text-gray-500">Min</span>
                 <span className="text-sm font-medium text-gray-900">₹{priceRange[0]}</span>
            </div>
             <span className="text-gray-400">-</span>
            <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-gray-50">
                 <span className="text-xs text-gray-500">Max</span>
                 <span className="text-sm font-medium text-gray-900">₹{priceRange[1]}</span>
            </div>
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
