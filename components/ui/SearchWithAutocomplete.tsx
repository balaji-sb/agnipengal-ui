'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, History, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: { name: string };
  images: string[];
}

export default function SearchWithAutocomplete({ className }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations('Search');

  // Load history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const storeSlug = getSubdomain();
          const url = storeSlug
            ? `/products/search?q=${encodeURIComponent(query)}&storeSlug=${storeSlug}`
            : `/products/search?q=${encodeURIComponent(query)}`;
          const res = await api.get(url);
          setSuggestions(res.data.data);
        } catch (error) {
          console.error('Search error', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    // Save to history
    const newHistory = [query, ...history.filter((h) => h !== query)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    setShowDropdown(false);
    const storeSlug = getSubdomain();
    const url = storeSlug
      ? `/products?search=${encodeURIComponent(query)}&storeSlug=${storeSlug}`
      : `/products?search=${encodeURIComponent(query)}`;
    router.push(url);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className={clsx('relative group', className)} ref={dropdownRef}>
      <form onSubmit={handleSearch} className='relative'>
        <input
          type='text'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={t('placeholder')}
          className='w-full pl-14 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl text-base focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder-gray-400 text-gray-800 shadow-sm hover:border-gray-200'
        />
        <Search className='absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors' />
        {query && (
          <button
            type='button'
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className='absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </form>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className='absolute top-full flex flex-col left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] max-h-[70vh]'>
          {/* Loading State */}
          {loading && (
            <div className='p-4 text-center text-gray-500 text-sm'>{t('loading')}</div>
          )}

          {/* Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div className='py-2'>
              <h3 className='px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                {t('suggestions')}
              </h3>
              {suggestions.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug}`}
                  className='flex items-center px-4 py-2 hover:bg-gray-50 transition-colors group/item'
                  onClick={() => setShowDropdown(false)}
                >
                  <div className='flex-shrink-0 h-8 w-8 rounded bg-gray-100 overflow-hidden mr-3'>
                    {/* Placeholder for image */}
                    {/* <div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-xs">
                                            {product.name.charAt(0)}
                                       </div> */}
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={50}
                        height={50}
                        className='object-cover'
                      />
                    ) : (
                      <div className='w-full h-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-xs'>
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate group-hover/item:text-red-600'>
                      {product.name}
                    </p>
                    <p className='text-xs text-gray-500 truncate mt-0.5'>
                      {product.category?.name} • ₹{product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Recent History */}
          {!loading && query.length === 0 && history.length > 0 && (
            <div className='py-4 px-4'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                  {t('recentSearches')}
                </h3>
                <button
                  onClick={clearHistory}
                  className='text-xs font-semibold text-red-500 hover:text-red-700 transition-colors'
                >
                  {t('clearAll')}
                </button>
              </div>
              <div className='flex flex-wrap gap-2'>
                {history.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(term);
                      handleSearch(); // Trigger search immediately
                    }}
                    className='flex items-center px-4 py-2 bg-gray-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-transparent rounded-full transition-all text-sm text-gray-700 font-medium group'
                  >
                    <History className='h-3.5 w-3.5 mr-2 text-gray-400 group-hover:text-red-500 transition-colors' />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && query.length > 2 && suggestions.length === 0 && (
            <div className='p-8 text-center flex flex-col items-center justify-center space-y-3'>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <p className='text-sm text-gray-600 font-medium'>{t('noMatchesFound', { query })}</p>
              <p className='text-xs text-gray-400'>{t('tryCheckingSpelling')}</p>
            </div>
          )}

          {/* View All Results Link */}
          {query.length > 0 && (
            <div className='border-t border-gray-100 bg-gray-50/50 p-3 mt-2'>
              <button
                onClick={() => handleSearch()}
                className='w-full flex items-center justify-center space-x-2 py-3 text-sm font-bold text-red-600 bg-white hover:bg-gray-50 rounded-xl transition-all border border-gray-200 shadow-sm hover:shadow active:scale-[0.99]'
              >
                <span>{t('viewAllResults', { query })}</span>
                <ArrowRight className='h-4 w-4' />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
