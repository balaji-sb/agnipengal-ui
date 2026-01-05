"use client"
import React from 'react';
import Sidebar from '@/components/admin/Sidebar';

import AdminHeader from '@/components/admin/AdminHeader';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, []);

  useEffect(() => {
    if (!loading && !admin && !isMounting) {
        router.push('/mahisadminpanel/login');
    }
  }, [admin, loading, router, isMounting]);

  if (loading || isMounting) {
      return (
          <div className="flex h-screen items-center justify-center bg-gray-50">
              <Loader2 className="w-10 h-10 text-pink-600 animate-spin" />
              <p className="ml-3 text-gray-500">Loading Admin Panel...</p>
          </div>
      );
  }

  if (!admin) return null; // Will redirect

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <AdminHeader />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
