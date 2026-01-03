'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Layers, Grid, Tag, LogOut, Settings, MessageSquare, Image as ImageIcon, CreditCard, Mail, FileText, HelpCircle,Ticket } from 'lucide-react';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';

const menuItems = [
    { label: 'Dashboard', href: '/portal-secure-admin', icon: LayoutDashboard, color: 'text-sky-500' }, 
    { label: 'Categories', href: '/portal-secure-admin/categories', icon: Grid, color: 'text-violet-500' },
    { label: 'Products', href: '/portal-secure-admin/products', icon: Package, color: 'text-pink-500' },
    { label: 'Orders', href: '/portal-secure-admin/orders', icon: ShoppingBag, color: 'text-orange-500' },
    { label: 'Carousel', href: '/portal-secure-admin/carousel', icon: ImageIcon, color: 'text-emerald-500' },
    { label: 'Combos', href: '/portal-secure-admin/combos', icon: Layers, color: 'text-purple-500' },
    { label: 'Deals', href: '/portal-secure-admin/deals', icon: Tag, color: 'text-red-500' },
    { label: 'Reviews', href: '/portal-secure-admin/reviews', icon: MessageSquare, color: 'text-yellow-500' },
    { label: 'CMS', href: '/portal-secure-admin/cms', icon: FileText, color: 'text-blue-500' },
    { label: 'Payments', href: '/portal-secure-admin/payments', icon: CreditCard, color: 'text-green-500' },
    { label: 'Email Templates', href: '/portal-secure-admin/email-templates', icon: Mail, color: 'text-cyan-500' },
    { label: 'FAQs', href: '/portal-secure-admin/faqs', icon: HelpCircle, color: 'text-teal-500' },
    { label: 'Support Tickets', href: '/portal-secure-admin/support', icon: MessageSquare, color: 'text-rose-500' },
    { label: 'Coupons', href: '/portal-secure-admin/coupons', icon: Ticket, color: 'text-indigo-500' },
    { label: 'Layout Manager', href: '/portal-secure-admin/layout-manager', icon: Layers, color: 'text-gray-500' }
  
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
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
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
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
