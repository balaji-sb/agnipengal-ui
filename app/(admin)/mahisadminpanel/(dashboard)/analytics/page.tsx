'use client';

import React from 'react';
import { ExternalLink, BarChart3, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Construct Firebase Console URL
  // Project ID is needed. If not available, user lands on generic console.
  const consoleUrl = projectId 
    ? `https://console.firebase.google.com/project/${projectId}/analytics/reports`
    : 'https://console.firebase.google.com/';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-600 mb-8">
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Helper Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="h-12 w-12 bg-pink-50 rounded-lg flex items-center justify-center mb-6">
            <BarChart3 className="w-6 h-6 text-pink-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Google Analytics 4</h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Your application is integrated with Firebase (Google Analytics 4). 
            You can view detailed reports about user engagement, product views, and sales performance directly in the Firebase Console.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 font-mono text-sm text-gray-600 flex justify-between items-center">
             <span>Measurement ID:</span>
             <span className="font-bold text-gray-900">{measurementId || 'Not Configured'}</span>
          </div>

          <a 
            href={consoleUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg group"
          >
            <span>Open Firebase Analytics Dashboard</span>
            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Tracking Status Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-6">What We Are Tracking</h3>
             <ul className="space-y-4">
                 {[
                     { name: 'Page Views', desc: 'Tracking which pages users visit.' },
                     { name: 'Product Views', desc: "Tracking 'view_item' when users view a product details page." },
                     { name: 'Add to Cart', desc: "Tracking 'add_to_cart' events with value and product name." },
                     { name: 'Purchases', desc: "Tracking 'purchase' events with revenue and order ID upon checkout." },
                     { name: 'Search', desc: "Tracking search terms users enter." }
                 ].map((item, i) => (
                     <li key={i} className="flex items-start">
                         <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                             <div className="h-2 w-2 rounded-full bg-green-600" />
                         </div>
                         <div>
                             <span className="block font-medium text-gray-900">{item.name}</span>
                             <span className="text-sm text-gray-500">{item.desc}</span>
                         </div>
                     </li>
                 ))}
             </ul>

             {!measurementId && (
                 <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-3">
                     <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                     <p className="text-sm text-yellow-700">
                         <strong>Missing Configuration:</strong> <code>NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID</code> is missing in your environment variables. Analytics will not work.
                     </p>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
}
