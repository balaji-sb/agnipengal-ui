
'use client';

import React from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!user) {
      router.push('/login');
      return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <button onClick={logout} className="flex items-center text-red-600 hover:text-red-700 font-medium">
                <LogOut className="w-5 h-5 mr-1" />
                Sign Out
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-gray-500">Name</label>
                     <p className="text-lg font-medium">{user.name}</p>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-500">Email</label>
                     <p className="text-lg font-medium">{user.email}</p>
                </div>
            </div>
        </div>

        {/* Future: Order History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
             <h2 className="text-xl font-bold mb-4">Order History</h2>
             <p className="text-gray-500">No recent orders found.</p>
        </div>
    </div>
  );
}
