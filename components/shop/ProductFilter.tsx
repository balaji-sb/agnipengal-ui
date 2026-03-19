'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactSlider from 'react-slider';
import api from '@/lib/api';
import { useTranslations } from 'next-intl';

interface VendorCategory {
  _id: string;
  name: string;
}

interface Vendor {
  _id: string; // The Vendor document ID
  user: {
    _id: string; // The User ID for filtering
    name: string;
  };
  storeName: string;
}

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('ProductFilter');

  const MIN_PRICE = 0;
  const MAX_PRICE = 10000; // Define a reasonable max price or fetch from backend if possible

  const currentMinPrice = Number(searchParams.get('minPrice')) || MIN_PRICE;
  const currentMaxPrice = Number(searchParams.get('maxPrice')) || MAX_PRICE;

  // Custom Hook/Logic to read Subdomain since useSearchParams() can't safely see middleware rewrites
  const getSubdomain = () => {
    if (typeof window === 'undefined') return null;
    const hostname = window.location.hostname;
    const cleanHost = hostname.replace('www.', '');
    const baseDomain = hostname.includes('localhost') ? 'localhost' : 'agnipengal.com';

    if (cleanHost.endsWith(baseDomain) && cleanHost !== baseDomain) {
      const extractedSlug = cleanHost.replace(`.${baseDomain}`, '');
      const reservedSubdomains = [
        'admin',
        'api',
        'help',
        'support',
        'mail',
        'blog',
        'shop',
        'vendor',
      ];
      if (!reservedSubdomains.includes(extractedSlug)) {
        return extractedSlug;
      }
    }
    return null;
  };

  const storeSlug = getSubdomain();

  const [priceRange, setPriceRange] = useState([currentMinPrice, currentMaxPrice]);
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    setPriceRange([
      Number(searchParams.get('minPrice')) || MIN_PRICE,
      Number(searchParams.get('maxPrice')) || MAX_PRICE,
    ]);
  }, [searchParams]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [catRes, vendorRes] = await Promise.all([
          api.get('/vendor-categories'),
          api.get('/vendors/public'),
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (vendorRes.data.success) setVendors(vendorRes.data.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchFiltersData();
  }, []);

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
    <div className='space-y-8'>
      {/* Price Range */}
      <div>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>{t('priceRange')}</h3>
        <div className='px-2'>
          <ReactSlider
            className='h-1 bg-gray-200 rounded-full cursor-pointer'
            thumbClassName='w-5 h-5 bg-orange-600 rounded-full cursor-grab focus:outline-none -mt-2 shadow-sm border-2 border-white'
            renderTrack={(props, state) => {
              const { key, ...restProps } = props;
              // State index 1 is the middle track (selected range)
              const isSelected = state.index === 1;
              return (
                <div
                  key={key}
                  {...restProps}
                  className={`h-1 rounded-full ${isSelected ? 'bg-orange-600' : 'bg-gray-200'}`}
                />
              );
            }}
            value={priceRange}
            min={MIN_PRICE}
            max={MAX_PRICE}
            onChange={handleSliderChange}
            onAfterChange={handleSliderCommit}
            pearling
            minDistance={100}
          />
        </div>
        <div className='flex items-center justify-between mt-4'>
          <div className='flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-gray-50'>
            <span className='text-xs text-gray-500'>{t('min')}</span>
            <span className='text-sm font-medium text-gray-900'>₹{priceRange[0]}</span>
          </div>
          <span className='text-gray-400'>-</span>
          <div className='flex items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-gray-50'>
            <span className='text-xs text-gray-500'>{t('max')}</span>
            <span className='text-sm font-medium text-gray-900'>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>{t('availability')}</h3>
        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={currentStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
            className='rounded text-pink-600 focus:ring-pink-500'
          />
          <span className='text-sm text-gray-700'>{t('inStockOnly')}</span>
        </label>
      </div>

      {/* Materials (Hardcoded for Demo) */}
      <div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>{t('material')}</h3>
        <div className='space-y-2'>
          {['Silk', 'Cotton', 'Zardosi', 'Beads', 'Stone'].map((mat) => (
            <label key={mat} className='flex items-center space-x-2'>
              <input
                type='radio'
                name='material'
                value={mat}
                checked={searchParams.get('material') === mat}
                onChange={(e) => handleFilterChange('material', e.target.value)}
                className='text-pink-600 focus:ring-pink-500'
              />
              <span className='text-sm text-gray-700'>{mat}</span>
            </label>
          ))}
          <label className='flex items-center space-x-2'>
            <input
              type='radio'
              name='material'
              value=''
              checked={!searchParams.get('material')}
              onChange={(e) => handleFilterChange('material', '')}
              className='text-pink-600 focus:ring-pink-500'
            />
            <span className='text-sm text-gray-700'>{t('all')}</span>
          </label>
        </div>
      </div>

      {/* Vendor Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>{t('vendorCategory')}</h3>
          <div className='space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
            {categories.map((cat) => (
              <label key={cat._id} className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='radio'
                  name='vendorCategory'
                  value={cat._id}
                  checked={searchParams.get('vendorCategory') === cat._id}
                  onChange={(e) => handleFilterChange('vendorCategory', e.target.value)}
                  className='bg-orange-600 focus:ring-orange-500'
                />
                <span className='text-sm text-gray-700 truncate'>{cat.name}</span>
              </label>
            ))}
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='vendorCategory'
                value=''
                checked={!searchParams.get('vendorCategory')}
                onChange={(e) => handleFilterChange('vendorCategory', '')}
                className='bg-orange-600 focus:ring-orange-500'
              />
              <span className='text-sm text-gray-700'>{t('allCategories')}</span>
            </label>
          </div>
        </div>
      )}

      {/* Shops (Vendors) - Hide if user is already on a vendor's subdomain */}
      {!storeSlug && vendors.length > 0 && (
        <div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>{t('shops')}</h3>
          <div className='space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
            {vendors.map((vendor) => (
              <label key={vendor._id} className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='radio'
                  name='vendor'
                  // Backend expects User ID for vendor filtering
                  value={vendor.user?._id || ''}
                  checked={searchParams.get('vendor') === vendor.user?._id}
                  onChange={(e) => handleFilterChange('vendor', e.target.value)}
                  className='bg-orange-600 focus:ring-orange-500'
                />
                <span
                  className='text-sm text-gray-700 truncate line-clamp-1'
                  title={vendor.storeName}
                >
                  {vendor.storeName}
                </span>
              </label>
            ))}
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                name='vendor'
                value=''
                checked={!searchParams.get('vendor')}
                onChange={(e) => handleFilterChange('vendor', '')}
                className='bg-orange-600 focus:ring-orange-500'
              />
              <span className='text-sm text-gray-700'>{t('allShops')}</span>
            </label>
          </div>
        </div>
      )}

      <button
        onClick={() => router.push(window.location.pathname)}
        className='w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition'
      >
        {t('clearFilters')}
      </button>
    </div>
  );
}
