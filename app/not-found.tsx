'use client';

import Link from 'next/link';
import { Home, MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Icon Container */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-pink-100 rounded-full animate-pulse opacity-50"></div>
          <div className="relative bg-white p-6 rounded-full shadow-sm flex items-center justify-center h-full w-full border border-pink-50">
             <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-600">
               ?
             </span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-serif text-gray-900 tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl font-medium text-gray-800">
            Lost within the threads?
          </h2>
          <p className="text-gray-500">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white font-medium transition-all hover:bg-gray-800 hover:shadow-lg group"
          >
            <Home className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-gray-700 border border-gray-200 font-medium transition-all hover:bg-gray-50 hover:border-gray-300"
          >
            <MoveLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        <div className="pt-12">
           <p className="text-xs text-gray-400 uppercase tracking-widest">Mahi's Vriksham Boutique</p>
        </div>
      </div>
    </div>
  );
}
