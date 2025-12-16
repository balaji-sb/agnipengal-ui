'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OrderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
        router.push(`?search=${encodeURIComponent(query)}`);
    } else {
        router.push('?');
    }
  };

  const clearSearch = () => {
    setQuery('');
    router.push('?');
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Search orders..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </form>
  );
}
