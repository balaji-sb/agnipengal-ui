'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, LogOut, Bell, User } from 'lucide-react';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';

export default function AdminHeader() {
    const { logout, admin } = useAdminAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
            {/* Left side - potentially breadcrumbs or page title later */}
            <div className="flex items-center">
                {/* Placeholder for future breadcrumbs or mobile toggle */}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-6">
                {/* Notifications - Placeholder */}
                <button className="text-gray-500 hover:text-gray-700 transition relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
                </button>

                <div className="h-6 w-px bg-gray-300"></div>

                {/* Settings Link */}
                <Link 
                    href="/mahisadminpanel/settings" 
                    className="text-gray-500 hover:text-gray-700 transition flex items-center space-x-2"
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </Link>

                {/* Profile / Logout Dropdown (Simplified to just logout button for now as per request) */}
                <div className="flex items-center space-x-4">
                     <div className="flex flex-col items-end mr-2">
                        <span className="text-sm font-semibold text-gray-800">{admin?.name || 'Admin'}</span>
                        <span className="text-xs text-gray-500">Administrator</span>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
