'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Layers, Grid, Tag, LogOut, Settings, MessageSquare, Image as ImageIcon, CreditCard } from 'lucide-react';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';

const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard }, // Re-adding Dashboard as it was in the original and not explicitly removed by the instruction's snippet, but the snippet itself didn't include it. I will keep it for now and adjust based on the instruction's snippet.
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Categories', href: '/admin/categories', icon: Grid },
    { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { label: 'Carousel', href: '/admin/carousel', icon: ImageIcon },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col h-full">
            <div className="p-6 flex items-center justify-center">
                {/* <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
                    Admin Panel
                </h1> */}
                <Image
                                        src="/logo.jpg" 
                                        alt="Mahi's Vriksham Logo" 
                                        width={150}
                                        height={120}
                                        className="object-contain p-1 rounded-xl"
                                    />
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
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 text-xs text-center text-gray-500">
                &copy; 2025 Mahi's Vriksham Boutique
            </div>
        </aside>
    );
}
