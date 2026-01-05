'use client';

import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface ProductListingLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function ProductListingLayout({ children, sidebar }: ProductListingLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();

  // Close sidebar when URL changes (filters applied)
  useEffect(() => {
    setIsFilterOpen(false);
  }, [searchParams]);

  // Prevent body scroll when filter is open on mobile
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden sticky top-[72px] z-30 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 border-b border-gray-200">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Show Filters</span>
        </button>
      </div>

      {/* Sidebar / Filter Drawer */}
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${
            isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterOpen(false)}
      />

      <div 
        className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out 
            md:transform-none md:static md:z-auto md:w-72 md:shadow-none md:bg-transparent flex-shrink-0
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full"> 
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 md:hidden">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto md:overflow-visible no-scrollbar p-0">
                <div className="min-h-full md:min-h-0 md:sticky md:top-24 bg-white p-6 md:rounded-xl md:border md:border-gray-100 md:shadow-sm">
                     <h2 className="text-xl font-bold mb-4 hidden md:block">Filters</h2>
                    {sidebar}
                </div>
            </div>
            
            {/* Mobile Footer Area (Optional Apply Button if needed, currently filters apply in real-time) */}
            <div className="p-4 border-t border-gray-100 md:hidden bg-white">
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold"
                >
                    View Results
                </button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
