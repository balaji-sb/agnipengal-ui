'use client';

import React from 'react';
import Link from 'next/link';
import { Send, CreditCard, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import api from '@/lib/api'; 
import toast from 'react-hot-toast';

import { useConfig } from '@/lib/context/ConfigContext';

export default function Footer() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [cmsPages, setCmsPages] = React.useState<any[]>([]);
  const { config } = useConfig();
  const appName = config?.appName || "Mahi's Vriksham Boutique";

  React.useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data } = await api.get('/cms');
        setCmsPages(data);
      } catch (error) {
        console.error('Failed to fetch footer pages:', error);
      }
    };
    fetchPages();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await api.post('/subscribers', { email });
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative mt-20">
      {/* Decorative Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
      
      {/* Main Footer Content */}
      <div className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          
          {/* Newsletter Section - Catchy & Prominent */}
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400 mb-4">
              Join the {appName} Family
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Subscribe to get exclusive offers, early access to new sewing kits, and aari work tips delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={loading}
                className="relative flex-1 bg-gray-800 border-gray-700 text-white rounded-lg px-5 py-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="relative bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Subscribing...</span>
                    </>
                ) : (
                    <>
                        <span>Subscribe</span>
                        <Send className="w-4 h-4" />
                    </>
                )}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-gray-800 pt-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {appName}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Your premium destination for Aari raw materials, custom sewing kits, and exquisite decoration items. We empower your creativity with quality.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/mahis_vriksham_boutique/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1"  target="_blank" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/mahisvrikshamboutique" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"  target="_blank" >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/channel/UCd6hth_H-F29nFblO8u96Eg" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                    <path d="m10 15 5-3-5-3z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
                Shop
              </h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/products" className="hover:text-pink-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-pink-500 transition-colors"></span> All Products</a></li>
                <li><a href="/products/aari-materials" className="hover:text-pink-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-pink-500 transition-colors"></span> Aari Materials</a></li>
                <li><a href="/products/sewing-kits" className="hover:text-pink-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-pink-500 transition-colors"></span> Sewing Kits</a></li>
                <li><a href="/products?sort=newest" className="hover:text-pink-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-pink-500 transition-colors"></span> New Arrivals</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                Support
              </h4>
              <ul className="space-y-3 text-sm">
                {cmsPages.map((page) => (
                    <li key={page._id}>
                        <Link href={`/pages/${page.slug}`} className="text-gray-400 hover:text-white transition">
                            {page.title}
                        </Link>
                    </li>
                ))}
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
                <li><Link href="/account/support" className="text-gray-400 hover:text-white transition">Customer Support</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
               <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                We Accept
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                 {/* Simulate Payment Badges */}
                 <div className="bg-gray-800 p-2 rounded flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-700">UPI / GPay</div>
                 <div className="bg-gray-800 p-2 rounded flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-700">Cards</div>
                 <div className="bg-gray-800 p-2 rounded flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-700">NetBanking</div>
                 <div className="bg-gray-800 p-2 rounded flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-700">Wallets</div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-800">
                   <Truck className="w-5 h-5 text-indigo-400" />
                   <span>Fast Delivery across India</span>
                </div>
                 <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-800">
                   <ShieldCheck className="w-5 h-5 text-green-400" />
                   <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-6 border-t border-gray-900">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <span className="hover:text-gray-400 cursor-pointer">Privacy</span>
             <span className="hover:text-gray-400 cursor-pointer">Terms</span>
             <span className="hover:text-gray-400 cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
