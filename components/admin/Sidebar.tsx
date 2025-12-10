'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Layers, Image as ImageIcon, User, LogOut, Settings } from 'lucide-react';
import api from '@/lib/api';

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Carousel', href: '/admin/carousel', icon: ImageIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col h-full">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
                    Admin Panel
                </h1>
            </div>

            <nav className="px-4 space-y-2 flex-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-pink-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                 <div className="mb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Settings
                </div>
                <nav className="space-y-2">
                    <Link 
                        href="/admin/profile" 
                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${pathname === '/admin/profile' ? 'bg-pink-600' : 'hover:bg-gray-800 text-gray-400'}`}
                    >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-900/20 hover:text-red-400 text-gray-400 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>
        </aside>
    );
}
