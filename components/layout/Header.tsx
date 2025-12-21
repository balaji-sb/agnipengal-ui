'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import SearchWithAutocomplete from '@/components/ui/SearchWithAutocomplete';

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
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

  const brandColor = "text-[#8B4513]"; // SaddleBrown
  const hoverColor = "hover:text-[#D4AF37]"; // Gold

  return (
    <header 
        className={clsx(
            "sticky top-0 z-50 w-full transition-all duration-300 border-b",
            isScrolled 
                ? "bg-white/95 backdrop-blur-xl border-[#D4AF37]/20 shadow-sm" 
                : "bg-white/80 backdrop-blur-md border-transparent"
        )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-3">
                {/* <div className="relative w-16 h-16 md:w-24 md:h-20 overflow-hidden rounded-xl group-hover:shadow-md transition-all duration-300 bg-white/50"> */}
                    <Image
                        src="/logo.jpg" 
                        alt="Mahi's Vriksham Logo" 
                        width={150}
                        height={150}
                        className="object-contain p-1"
                    />
                {/* </div> */}
                {/* <div className="flex flex-col">
                    <span className={`text-xl md:text-2xl font-serif font-bold ${brandColor} tracking-wide group-hover:opacity-80 transition-opacity`}>
                        Mahi's Vriksham
                    </span>
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-medium">Boutique</span>
                </div> */}
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'px-4 py-2 text-sm font-medium uppercase tracking-wider rounded-md transition-all duration-200',
                  pathname === link.href 
                    ? 'text-[#8B4513] bg-[#D4AF37]/10' 
                    : 'text-gray-600 hover:text-[#8B4513] hover:bg-[#D4AF37]/5'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Bar - Desktop */}
            <div className="hidden lg:block w-56 xl:w-72">
                <SearchWithAutocomplete />
            </div>

             {/* Mobile Search Icon */}
            <Link href="/products" className={`lg:hidden p-2 text-gray-600 ${hoverColor} hover:bg-[#D4AF37]/10 rounded-full transition-all`}>
              <Search className="h-5 w-5" />
            </Link>
            
            <Link href="/cart" className={`p-2 text-gray-600 ${hoverColor} hover:bg-[#D4AF37]/10 rounded-full transition-all relative group`}>
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-[10px] font-bold leading-none text-white bg-[#8B4513] rounded-full shadow-md transform translate-x-1/4 -translate-y-1/4 border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Link */}
            {user ? (
               <div className="relative group/profile z-50">
                   <Link href="/profile" className="hidden md:flex items-center space-x-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-[#D4AF37]/10 transition-all border border-transparent hover:border-[#D4AF37]/20">
                      <div className="h-9 w-9 bg-[#8B4513] text-[#D4AF37] rounded-full flex items-center justify-center text-sm font-serif font-bold shadow-md border border-[#D4AF37]/50">
                          {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#8B4513] max-w-[100px] truncate">
                          {user.name.split(' ')[0]}
                      </span>
                   </Link>
                   
                   {/* Dropdown Menu */}
                   <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 transform origin-top-right">
                       <div className="bg-white rounded-xl shadow-xl border border-[#D4AF37]/20 overflow-hidden">
                           <div className="px-4 py-3 border-b border-gray-50 bg-[#FDFBF7]">
                               <p className="text-sm font-bold text-[#8B4513] truncate">{user.name}</p>
                               <p className="text-xs text-gray-500 truncate">{user.email}</p>
                           </div>
                           <div className="py-2">
                               <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#D4AF37]/10 hover:text-[#8B4513] transition-colors">
                                   My Profile
                               </Link>
                               <Link href="/profile/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#D4AF37]/10 hover:text-[#8B4513] transition-colors">
                                   My Orders
                               </Link>
                               <Link href="/profile/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#D4AF37]/10 hover:text-[#8B4513] transition-colors">
                                   Saved Addresses
                               </Link>
                           </div>
                           <div className="border-t border-gray-50 py-2">
                               <button 
                                   onClick={logout} 
                                   className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                               >
                                   Sign Out
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center px-6 py-2.5 text-sm font-bold text-white bg-[#8B4513] rounded-full hover:bg-[#6d360e] hover:shadow-lg transition-all duration-200 tracking-wide uppercase">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 text-gray-600 ${hoverColor} hover:bg-[#D4AF37]/10 rounded-full transition-all`}
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
                    <div className="h-10 w-10 bg-[#8B4513] text-[#D4AF37] rounded-full flex items-center justify-center font-bold shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-[#8B4513]">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
             )}

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'block py-3 px-4 text-sm font-semibold rounded-lg transition-all uppercase tracking-wide',
                  pathname === link.href 
                    ? 'bg-[#D4AF37]/10 text-[#8B4513]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#8B4513]'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {!user && (
                 <Link
                    href="/login"
                    className="block mt-6 w-full py-3 px-4 text-center text-white font-bold bg-[#8B4513] rounded-xl shadow-md uppercase tracking-wider"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Sign Up
                </Link>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}

// Helper needed for AnimatePresence
import { motion, AnimatePresence } from 'framer-motion';
