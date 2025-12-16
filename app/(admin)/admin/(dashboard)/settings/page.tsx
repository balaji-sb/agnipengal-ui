'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Save, Loader2, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    
    const [formData, setFormData] = useState({
        appName: '',
        themeColor: '',
        adminEmail: '',
        adminUsername: '',
        adminWhatsapp: '',
        whatsappApiUrl: '',
        whatsappApiKey: ''
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await api.get('/config');
            if (res.data.success) {
                setFormData({
                    appName: res.data.data.appName || '',
                    themeColor: res.data.data.themeColor || '#ffffff',
                    adminEmail: res.data.data.adminEmail || '',
                    adminUsername: res.data.data.adminUsername || '',
                    adminWhatsapp: res.data.data.adminWhatsapp || '',
                    whatsappApiUrl: res.data.data.whatsappApiUrl || '',
                    whatsappApiKey: res.data.data.whatsappApiKey || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch config', error);
            setMessage({ text: 'Failed to load settings', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await api.put('/config', formData);
            if (res.data.success) {
                setMessage({ text: 'Settings updated successfully', type: 'success' });
            }
        } catch (error: any) {
            console.error('Failed to update config', error);
            setMessage({ 
                text: error.response?.data?.error || 'Failed to update settings', 
                type: 'error' 
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <SettingsIcon className="w-8 h-8 text-pink-600" />
                    Settings
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-100">General Configuration</h2>
                
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Application Name
                            </label>
                            <input
                                type="text"
                                name="appName"
                                value={formData.appName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                placeholder="E.g. My Shop"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Theme Color (Hex)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    name="themeColor"
                                    value={formData.themeColor}
                                    onChange={handleChange}
                                    className="h-10 w-20 p-1 bg-white border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    name="themeColor"
                                    value={formData.themeColor}
                                    onChange={handleChange}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition uppercase"
                                    placeholder="#FFFFFF"
                                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Username
                            </label>
                            <input
                                type="text"
                                name="adminUsername"
                                value={formData.adminUsername}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                placeholder="Admin Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                name="adminEmail"
                                value={formData.adminEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                placeholder="admin@example.com"
                            />
                            <p className="mt-1 text-xs text-gray-500">Used for system notifications.</p>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                             <h3 className="text-md font-semibold mb-4 text-gray-800">WhatsApp Configuration</h3>
                             
                             <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Admin WhatsApp Number
                                    </label>
                                    <input
                                        type="text"
                                        name="adminWhatsapp"
                                        value={formData.adminWhatsapp}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                        placeholder="+1234567890"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Number to receive WhatsApp notifications.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        WhatsApp API URL
                                    </label>
                                    <input
                                        type="text"
                                        name="whatsappApiUrl"
                                        value={formData.whatsappApiUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                        placeholder="https://api.whatsapp.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        WhatsApp API Key
                                    </label>
                                    <input
                                        type="password"
                                        name="whatsappApiKey"
                                        value={formData.whatsappApiKey}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                        placeholder="Your API Key"
                                    />
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex items-center gap-2 px-6 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
