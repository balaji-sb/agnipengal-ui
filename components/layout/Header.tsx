'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/category' }, // Maybe list all categories?
    { name: 'Products', href: '/products' }, // General product list
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600">
              Mahi's Vriksham Boutique
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'text-sm font-medium transition-colors hover:text-pink-600',
                  pathname === link.href ? 'text-pink-600' : 'text-gray-700'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Hidden on mobile initially for simplicity, or make it expanding */}
            <form action="/products" className="hidden sm:block relative">
                 <input 
                    type="text" 
                    name="search"
                    placeholder="Search..." 
                    className="pl-3 pr-8 py-1.5 border rounded-full text-sm focus:ring-2 focus:ring-pink-500 outline-none w-48 transition-all focus:w-64"
                />
                <button type="submit" className="absolute right-2 top-1.5 text-gray-500 hover:text-pink-600">
                    <Search className="h-4 w-4" />
                </button>
            </form>
             {/* Mobile Search Icon - Could link to specific search page or toggle menu */}
            <Link href="/products" className="sm:hidden p-2 text-gray-700 hover:text-pink-600 transition-colors">
              <Search className="h-5 w-5" />
            </Link>
            
            <Link href="/cart" className="p-2 text-gray-700 hover:text-pink-600 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-pink-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Link */}
            {user ? (
               <Link href="/profile" className="hidden md:flex items-center space-x-1 p-2 text-gray-700 hover:text-pink-600 transition-colors">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
               </Link>
            ) : (
              <Link href="/login" className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-full hover:bg-pink-700 transition">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'block py-2 text-base font-medium rounded-md px-3 transition-colors',
                  pathname === link.href ? 'bg-pink-50 text-pink-600' : 'text-gray-700 hover:bg-gray-50'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
