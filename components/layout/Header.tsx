'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, Search, User, Heart, MapPin } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import SearchWithAutocomplete from '@/components/ui/SearchWithAutocomplete';
import { useConfig } from '@/lib/context/ConfigContext';

import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  const { config } = useConfig();
  const logoSrc = config?.logo || '/logo.jpg';
  const appName = config?.appName || "Mahi's Vriksham Boutique";

  // Handle scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/category' }, 
    { name: 'Products', href: '/products' },
    { name: 'Deals', href: '/deals' },
  ];

  return (
    <header 
        className={clsx(
            "sticky top-0 z-50 w-full transition-all duration-500 border-b",
            isScrolled 
                ? "bg-white/80 backdrop-blur-xl border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" 
                : "bg-transparent border-transparent"
        )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-3 relative">
                 <div className="relative w-16 h-16 md:w-16 md:h-16 overflow-hidden rounded-xl border-2 border-white/50 shadow-sm group-hover:scale-110 transition-transform duration-500 p-2">
                    <Image
                        src={logoSrc}
                        alt={`${appName} Logo`} 
                        fill
                        className="object-cover"
                    />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xl md:text-2xl font-black tracking-tight text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                        {appName}
                    </span>
                 </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'relative px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-full transition-all duration-300 overflow-hidden group',
                  pathname === link.href 
                    ? 'text-pink-600' 
                    : 'text-gray-600 hover:text-pink-600'
                )}
              >
                <span className="relative z-10">{link.name}</span>
                {pathname === link.href && (
                    <motion.div 
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-pink-50 rounded-full z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Bar - Desktop */}
            <div className="hidden lg:block w-64 transition-all duration-300 focus-within:w-72">
                <SearchWithAutocomplete />
            </div>

             {/* Mobile Search Icon */}
            <Link href="/products" className="lg:hidden p-2.5 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-full transition-all">
              <Search className="h-5 w-5" />
            </Link>
            
            <Link href="/cart" className="p-2.5 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-full transition-all relative group">
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-[10px] font-bold leading-none text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-md transform translate-x-1/4 -translate-y-1/4 border-2 border-white animate-bounce-short">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Link */}
            {user ? (
               <div className="relative group/profile z-50">
                   <Link href="/profile" className="hidden md:flex items-center space-x-2 pl-1 pr-3 py-1 rounded-full hover:bg-gray-100/50 transition-all border border-transparent hover:border-gray-200">
                      <div className="h-8 w-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                          {user.name.charAt(0).toUpperCase()}
                      </div>
                   </Link>
                   
                   {/* Dropdown Menu */}
                   <div className="absolute right-0 top-full pt-4 w-60 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 transform origin-top-right">
                       <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden ring-1 ring-black/5">
                           <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-pink-50/50 to-purple-50/50">
                               <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                               <p className="text-xs text-gray-500 truncate">{user.email}</p>
                           </div>
                           <div className="py-2">
                               <Link href="/profile" className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-2">
                                   <User className="w-4 h-4" /> My Profile
                               </Link>
                               <Link href="/profile/orders" className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-2">
                                   <ShoppingCart className="w-4 h-4" /> My Orders
                               </Link>
                               <Link href="/profile/wishlist" className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-2">
                                   <Heart className="w-4 h-4" /> Wishlist
                               </Link>
                               <Link href="/profile/addresses" className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-2">
                                   <MapPin className="w-4 h-4" /> Saved Addresses
                               </Link>
                           </div>
                           <div className="border-t border-gray-100 py-2 bg-gray-50/50">
                               <button 
                                   onClick={logout} 
                                   className="w-full text-left px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium flex items-center gap-2"
                               >
                                   Sign Out
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all duration-200 tracking-wide transform hover:-translate-y-0.5">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
      {isMenuOpen && (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl w-full shadow-xl overflow-hidden"
        >
          <div className="space-y-1 px-4 py-6">
             {user && (
                 <div className="flex items-center space-x-3 mb-6 px-2 pb-4 border-b border-gray-100">
                    <div className="h-10 w-10 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
             )}

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'block py-3 px-4 text-sm font-bold rounded-xl transition-all uppercase tracking-wide',
                  pathname === link.href 
                    ? 'bg-pink-50 text-pink-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
                <>
                <div className="border-t border-gray-100 my-4 pt-4">
                  <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Account</p>
                  <Link href="/profile" className="block py-3 px-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-pink-600 rounded-xl transition-all flex items-center gap-3">
                    <User className="w-5 h-5" /> Profile
                  </Link>
                  <Link href="/profile/orders" className="block py-3 px-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-pink-600 rounded-xl transition-all flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5" /> Orders
                  </Link>
                  <Link href="/profile/addresses" className="block py-3 px-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-pink-600 rounded-xl transition-all flex items-center gap-3">
                    <MapPin className="w-5 h-5" /> Addresses
                  </Link>
                  <Link href="/profile/wishlist" className="block py-3 px-4 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-pink-600 rounded-xl transition-all flex items-center gap-3">
                    <Heart className="w-5 h-5" /> Wishlist
                  </Link>
                </div>
                </>
            )}

            {!user && (
                 <Link
                    href="/login"
                    className="block mt-6 w-full py-3.5 px-4 text-center text-white font-bold bg-gray-900 rounded-xl shadow-lg uppercase tracking-wider active:scale-95 transition-transform"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Sign Up
                </Link>
            )}
            
            {user && (
                 <button
                    onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                    }}
                    className="block mt-6 w-full py-3 px-4 text-center text-red-500 font-bold bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Sign Out
                </button>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
