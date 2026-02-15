'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Grid,
  Tag,
  LogOut,
  Settings,
  MessageSquare,
  Image as ImageIcon,
  CreditCard,
  Mail,
  FileText,
  HelpCircle,
  Ticket,
  BarChart3,
  UserCog,
} from 'lucide-react';

import { useConfig } from '@/lib/context/ConfigContext';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/mahisadminpanel',
    icon: LayoutDashboard,
    color: 'text-sky-500',
  },
  {
    label: 'Analytics',
    href: '/mahisadminpanel/analytics',
    icon: BarChart3,
    color: 'text-indigo-600',
  },
  {
    label: 'Categories',
    href: '/mahisadminpanel/categories',
    icon: Grid,
    color: 'text-violet-500',
  },
  {
    label: 'Products',
    href: '/mahisadminpanel/products',
    icon: Package,
    color: 'text-pink-500',
  },
  {
    label: 'Orders',
    href: '/mahisadminpanel/orders',
    icon: ShoppingBag,
    color: 'text-orange-500',
  },
  {
    label: 'Carousel',
    href: '/mahisadminpanel/carousel',
    icon: ImageIcon,
    color: 'text-emerald-500',
  },
  {
    label: 'Combos',
    href: '/mahisadminpanel/combos',
    icon: Layers,
    color: 'text-purple-500',
  },
  {
    label: 'Deals',
    href: '/mahisadminpanel/deals',
    icon: Tag,
    color: 'text-red-500',
  },
  {
    label: 'Reviews',
    href: '/mahisadminpanel/reviews',
    icon: MessageSquare,
    color: 'text-yellow-500',
  },
  {
    label: 'CMS',
    href: '/mahisadminpanel/cms',
    icon: FileText,
    color: 'text-blue-500',
  },
  {
    label: 'Payments',
    href: '/mahisadminpanel/payments',
    icon: CreditCard,
    color: 'text-green-500',
  },
  {
    label: 'Email Templates',
    href: '/mahisadminpanel/email-templates',
    icon: Mail,
    color: 'text-cyan-500',
  },
  {
    label: 'FAQs',
    href: '/mahisadminpanel/faqs',
    icon: HelpCircle,
    color: 'text-teal-500',
  },
  {
    label: 'Support Tickets',
    href: '/mahisadminpanel/support',
    icon: MessageSquare,
    color: 'text-rose-500',
  },
  {
    label: 'Coupons',
    href: '/mahisadminpanel/coupons',
    icon: Ticket,
    color: 'text-indigo-500',
  },
  {
    label: 'Layout Manager',
    href: '/mahisadminpanel/layout-manager',
    icon: Layers,
    color: 'text-gray-500',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { config } = useConfig();
  const appName = config?.appName || "Mahi's Vriksham Boutique";

  return (
    <aside className='w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent'>
      <div className='p-6 flex items-center justify-center'>
        {/* <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
                    Admin Panel
                </h1> */}
        <Image
          src={config?.logo || '/logo.jpg'}
          alt={`${appName} Logo`}
          width={150}
          height={120}
          className='object-contain p-1 rounded-xl'
        />
      </div>

      <nav className='px-4 space-y-2 flex-1'>
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

      <div className='p-4 border-t border-gray-800 text-xs text-center text-gray-500'>
        &copy; {new Date().getFullYear()} {appName}
      </div>
    </aside>
  );
}
