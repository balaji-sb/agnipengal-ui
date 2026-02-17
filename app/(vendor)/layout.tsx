'use client';

import React from 'react';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import { Toaster } from 'react-hot-toast';

import { usePathname } from 'next/navigation';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/vendor/login';

  return (
    <div className='flex h-screen bg-gray-100 font-sans'>
      {!isLoginPage && <VendorSidebar />}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6'>{children}</main>
      </div>
      <Toaster position='top-right' />
    </div>
  );
}
