import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Layers, Image as ImageIcon } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:block">
        <div className="p-6">
           <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
              Admin Panel
           </h1>
        </div>
        <nav className="px-4 space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition">
                <LayoutDashboard className="w-5 h-5 text-gray-400" />
                <span>Dashboard</span>
            </Link>
            <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition">
                <Package className="w-5 h-5 text-gray-400" />
                <span>Products</span>
            </Link>
            <Link href="/admin/categories" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition">
                <Layers className="w-5 h-5 text-gray-400" />
                <span>Categories</span>
            </Link>
            <Link href="/admin/carousel" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                <span>Carousel</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition">
                <ShoppingBag className="w-5 h-5 text-gray-400" />
                <span>Orders</span>
            </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
