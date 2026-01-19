'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, History, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';

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

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                try {
                    const res = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
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
        const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));

        setShowDropdown(false);
        router.push(`/products?search=${encodeURIComponent(query)}`);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('searchHistory');
    };

    return (
        <div className={clsx("relative group", className)} ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search products..." 
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder-gray-400 text-gray-700 shadow-sm"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                {query && (
                    <button 
                        type="button" 
                        onClick={() => {
                            setQuery('');
                            setSuggestions([]);
                        }}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </form>

            {/* Dropdown Results */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[60]">
                    
                    {/* Loading State */}
                    {loading && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Loading suggestions...
                        </div>
                    )}

                    {/* Suggestions */}
                    {!loading && suggestions.length > 0 && (
                        <div className="py-2">
                            <h3 className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggestions</h3>
                            {suggestions.map((product) => (
                                <Link 
                                    key={product._id} 
                                    href={`/product/${product.slug}`}
                                    className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors group/item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <div className="flex-shrink-0 h-8 w-8 rounded bg-gray-100 overflow-hidden mr-3">
                                       {/* Placeholder for image */}
                                       {/* <div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-xs">
                                            {product.name.charAt(0)}
                                       </div> */}
                                       {
                                        product.images && product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                width={50}
                                            height={50}
                                            className="object-cover"
                                        />
                                        ):(
                                        <div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-xs">
                                            {product.name.charAt(0)}
                                       </div> 
                                        )
                                    }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate group-hover/item:text-pink-600">{product.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{product.category?.name} • ₹{product.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Recent History */}
                    {!loading && query.length === 0 && history.length > 0 && (
                        <div className="py-2">
                             <div className="flex items-center justify-between px-4 py-1">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Searches</h3>
                                <button onClick={clearHistory} className="text-xs text-pink-600 hover:text-pink-700">Clear</button>
                            </div>
                            {history.map((term, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setQuery(term);
                                        handleSearch(); // Trigger search immediately
                                    }}
                                    className="w-full text-left flex items-center px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                >
                                    <History className="h-3.5 w-3.5 mr-3 text-gray-400" />
                                    {term}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {/* No Results */}
                    {!loading && query.length > 2 && suggestions.length === 0 && (
                        <div className="p-4 text-center">
                            <p className="text-sm text-gray-500">No matches found.</p>
                        </div>
                    )}
                     
                     {/* View All Results Link */}
                     {query.length > 0 && (
                         <div className="border-t border-gray-100 bg-gray-50 p-2">
                             <button 
                                onClick={() => handleSearch()}
                                className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-semibold text-pink-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                            >
                                 <span>View all results for "{query}"</span>
                                 <ArrowRight className="h-3.5 w-3.5" />
                             </button>
                         </div>
                     )}
                </div>
            )}
        </div>
    );
}
