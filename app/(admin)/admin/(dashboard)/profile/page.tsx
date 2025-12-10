import React from 'react';
import api from '@/lib/api';
import { getAuthHeaders } from '@/lib/api-server';
import { User, Mail, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getProfile() {
    try {
        // Forward the cookie to the backend
        const headers = await getAuthHeaders();
        const res = await api.get('/auth/me', { headers });
        return res.data;
    } catch (error) {
        console.error('Failed to fetch profile', error);
        return null;
    }
}

export default async function AdminProfilePage() {
    const data = await getProfile();
    const user = data?.user;

    if (!user) {
        return (
            <div className="text-center p-12">
                <p className="text-red-500">Failed to load profile. Please try logging in again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Profile</h1>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-violet-500 h-32"></div>
                
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg inline-flex items-center justify-center">
                            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-gray-500">Administrator</p>
                        </div>

                        <div className="grid gap-4">
                             <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <Shield className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Role</p>
                                    <p className="font-medium capitalize">{user.role}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">User ID</p>
                                    <p className="font-mono text-sm text-gray-600">{user._id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
