'use client';

import React, { useState } from 'react';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import VendorHeader from '@/components/vendor/VendorHeader';
import { Toaster } from 'react-hot-toast';

import { usePathname } from 'next/navigation';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/vendor/login';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-100 font-sans'>
      {!isLoginPage && <VendorSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {!isLoginPage && <VendorHeader onMenuClick={() => setIsSidebarOpen(true)} />}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6'>
          {children}
        </main>
      </div>
      <Toaster position='top-right' />
    </div>
  );
}
