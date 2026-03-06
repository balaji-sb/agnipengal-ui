'use client';

import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useVendorAuth } from '@/lib/context/VendorAuthContext';

export default function VendorHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { vendor, logout } = useVendorAuth();

  return (
    <header className='bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30'>
      <div className='flex items-center'>
        <button
          onClick={onMenuClick}
          className='md:hidden p-2 mr-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition'
        >
          <Menu className='w-6 h-6' />
        </button>
      </div>

      <div className='flex items-center space-x-6'>
        <div className='flex items-center space-x-4'>
          <div className='flex flex-col items-end mr-2'>
            <span className='text-sm font-semibold text-gray-800'>
              {vendor?.storeName || vendor?.ownerName || 'Vendor'}
            </span>
            <span className='text-xs text-gray-500'>Seller Account</span>
          </div>

          <button
            onClick={() => logout()}
            className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition'
            title='Logout'
          >
            <LogOut className='w-5 h-5' />
          </button>
        </div>
      </div>
    </header>
  );
}
