'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, LogOut, Settings, Store, ShoppingBag } from 'lucide-react';
import { useConfig } from '@/lib/context/ConfigContext';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useVendorAuth } from '@/lib/context/VendorAuthContext';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/vendor/dashboard',
    icon: LayoutDashboard,
    color: 'text-sky-500',
  },
  {
    label: 'Products',
    href: '/vendor/products',
    icon: Package,
    color: 'text-pink-500',
  },
  {
    label: 'Orders',
    href: '/vendor/orders',
    icon: ShoppingBag,
    color: 'text-pink-500',
  },

  {
    label: 'Profile',
    href: '/vendor/profile',
    icon: Store,
    color: 'text-violet-500',
  },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useVendorAuth();
  const { config } = useConfig();
  const appName = config?.appName || 'Agni Pengal';

  const handleLogout = async () => {
    logout();
  };

  return (
    <aside className='w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent'>
      <div className='p-6 flex items-center justify-center'>
        <Image
          src={config?.logo || '/logo.jpg'}
          alt={`${appName} Logo`}
          width={150}
          height={120}
          className='object-contain p-1 rounded-xl'
        />
      </div>

      <div className='px-6 mb-4'>
        <h2 className='text-xs uppercase text-gray-500 font-semibold tracking-wider'>
          Vendor Portal
        </h2>
      </div>

      <nav className='px-4 space-y-2 flex-1'>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className='flex w-full items-center space-x-3 px-4 py-3 mt-auto rounded-lg transition hover:bg-gray-800 text-red-500 hover:text-red-400'
        >
          <LogOut className='w-5 h-5 text-red-500' />
          <span>Sign Out</span>
        </button>
      </nav>

      <div className='p-4 border-t border-gray-800 text-xs text-center text-gray-500'>
        &copy; {new Date().getFullYear()} {appName}
      </div>
    </aside>
  );
}
