'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Search, User, Heart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import SearchWithAutocomplete from '@/components/ui/SearchWithAutocomplete';

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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
    { name: 'New Arrivals', href: '/products?sort=newest' },
    { name: 'Best Sellers', href: '/products?feature=true' },
  ];

  return (
    <header 
        className={clsx(
            "sticky top-0 z-50 w-full transition-all duration-300 border-b",
            isScrolled 
                ? "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-sm" 
                : "bg-white/60 backdrop-blur-md border-transparent"
        )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center gap-2">
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 tracking-tighter group-hover:opacity-80 transition-opacity">
                  Mahi's Vriksham
                </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200',
                  pathname === link.href 
                    ? 'bg-pink-50 text-pink-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-white hover:text-pink-600 hover:shadow-sm'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Bar - Desktop */}
            <div className="hidden lg:block w-64 xl:w-80">
                <SearchWithAutocomplete />
            </div>

             {/* Mobile Search Icon */}
            <Link href="/products" className="lg:hidden p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all">
              <Search className="h-5 w-5" />
            </Link>

            {/* Wishlist - Placeholder */}
            {/* <button className="hidden sm:block p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all">
                <Heart className="h-5 w-5" />
            </button> */}
            
            <Link href="/cart" className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all relative group">
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-[10px] font-bold leading-none text-white bg-gradient-to-r from-pink-600 to-violet-600 rounded-full shadow-md transform translate-x-1/4 -translate-y-1/4 border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Link */}
            {user ? (
               <Link href="/profile" className="hidden md:flex items-center space-x-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-pink-50 transition-all border border-transparent hover:border-pink-100 group">
                  <div className="h-8 w-8 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-pink-600 max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                  </span>
               </Link>
            ) : (
              <Link href="/login" className="hidden md:flex items-center px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-violet-600 rounded-full hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-200">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl absolute w-full shadow-xl">
          <div className="space-y-2 px-4 py-6">
             {user && (
                 <div className="flex items-center space-x-3 mb-6 px-2">
                    <div className="h-10 w-10 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
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
                  'block py-3 px-4 text-base font-semibold rounded-xl transition-all',
                  pathname === link.href 
                    ? 'bg-pink-50 text-pink-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {!user && (
                 <Link
                    href="/login"
                    className="block mt-4 w-full py-3 px-4 text-center text-white font-bold bg-gradient-to-r from-pink-600 to-violet-600 rounded-xl shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Sign Up
                </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
