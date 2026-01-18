'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { History, X } from 'lucide-react';

export default function SearchHistorySection() {
    const [history, setHistory] = useState<string[]>([]);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse search history", e);
            }
        }
    }, []);

    const handleSearch = (term: string) => {
        // Move to top of history logic handled in search component mostly, but good to refresh here if we wanted interactive
        // For now, just navigate. The search page/component will update the history order on submit if needed, 
        // but let's just push.
        router.push(`/products?search=${encodeURIComponent(term)}`);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('searchHistory');
    };

    const removeTerm = (e: React.MouseEvent, term: string) => {
        e.stopPropagation();
        const newHistory = history.filter(h => h !== term);
        setHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }

    if (!mounted || history.length === 0) return null;

    return (
        <section className="py-4 bg-white/50 backdrop-blur-sm relative z-20 border-b border-gray-100/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-pink-500" />
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Your Recent Searches</h2>
                     </div>
                     <button 
                        onClick={clearHistory}
                        className="text-xs font-semibold text-gray-400 hover:text-pink-600 transition-colors"
                     >
                        Clear All
                     </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {history.map((term, index) => (
                        <div 
                            key={`${term}-${index}`}
                            onClick={() => handleSearch(term)}
                            className="group flex items-center gap-2 pl-4 pr-2 py-1.5 bg-white hover:bg-pink-50 text-gray-600 hover:text-pink-600 rounded-full cursor-pointer transition-all border border-gray-200 hover:border-pink-200 shadow-sm hover:shadow-md"
                        >
                            <span className="text-sm font-medium">{term}</span>
                            <button 
                                onClick={(e) => removeTerm(e, term)}
                                className="p-1 rounded-full hover:bg-pink-100 text-gray-300 hover:text-pink-500 transition-all"
                                title="Remove from history"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
