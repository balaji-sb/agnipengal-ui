'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';
import { Save, Loader2, Settings as SettingsIcon, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    
    const [formData, setFormData] = useState({
        appName: '',
        themeColor: '',
        logo: '',
        adminEmail: '',
        adminUsername: '',
        adminWhatsapp: '',
        whatsappApiUrl: '',
        whatsappApiKey: '',
        whatsappPhoneNumberId: '',
        shippingCharge: 50,
        freeShippingThreshold: 500,
        adminCommissionRate: 5
    });

    const [homepageSections, setHomepageSections] = useState<any[]>([]);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await api.get('/config');
            if (res.data.success) {
                const data = res.data.data;
                setFormData({
                    appName: data.appName || '',
                    logo: data.logo || '',
                    themeColor: data.themeColor || '#ffffff',
                    adminEmail: data.adminEmail || '',
                    adminUsername: data.adminUsername || '',
                    adminWhatsapp: data.adminWhatsapp || '',
                    whatsappApiUrl: data.whatsappApiUrl || '',
                    whatsappApiKey: data.whatsappApiKey || '',
                    whatsappPhoneNumberId: data.whatsappPhoneNumberId || '',
                    shippingCharge: data.shippingCharge || 50,
                    freeShippingThreshold: data.freeShippingThreshold || 500,
                    adminCommissionRate: data.adminCommissionRate || 5
                });

                // // Initialize homepage sections if they don't exist
                // let sections = data.homepageSections || [];
                // if (sections.length === 0) {
                //      sections = [
                //         { id: 'banner', type: 'banner', order: 0, enabled: true },
                //         { id: 'categories', type: 'categories', order: 1, enabled: true },
                //         { id: 'deals', type: 'deals_of_day', title: 'Deals of the Day', order: 2, enabled: true },
                //         { id: 'featured', type: 'featured_products',order: 3, enabled: true },
                //         { id: 'latest', type: 'latest_products', title: 'New Arrivals', order: 4, enabled: true },
                //     ];
                // }
                // // Sort by order
                // sections.sort((a: any, b: any) => a.order - b.order);
                // setHomepageSections(sections);
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

    const handleSectionChange = (index: number, field: string, value: any) => {
        const updated = [...homepageSections];
        updated[index] = { ...updated[index], [field]: value };
        setHomepageSections(updated);
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === homepageSections.length - 1)) return;
        
        const updated = [...homepageSections];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
        
        // Update order property
        updated.forEach((section, idx) => section.order = idx);
        
        setHomepageSections(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const payload = {
                ...formData,
                homepageSections
            };

            const res = await api.put('/config', payload);
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
        <div className="space-y-6 pb-20">
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

                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            />
                        </div>

                        <div className="md:col-span-2">
                             <ImageUpload 
                                label="App Logo"
                                value={formData.logo}
                                onChange={(url: string | string[]) => setFormData({ ...formData, logo: url as string })}
                                multiple={false}
                                folder="branding"
                             />
                             <p className="text-xs text-gray-500 mt-2">Recommended size: 512x512px (Square), Transparent PNG</p>
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
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                         <h3 className="text-md font-semibold mb-4 text-gray-800">Shipping Configuration</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shipping Charge (₹)
                                </label>
                                <input
                                    type="number"
                                    name="shippingCharge"
                                    value={formData.shippingCharge}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Free Shipping Threshold (₹)
                                </label>
                                <input
                                    type="number"
                                    name="freeShippingThreshold"
                                    value={formData.freeShippingThreshold}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                         </div>
                            <div>
                                <label className="pt-6 block text-sm font-medium text-gray-700 mb-1">
                                    Admin CommissionRate (%)
                                </label>
                                <input
                                    type="number"
                                    name="adminCommissionRate"
                                    value={formData.adminCommissionRate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                />
                            </div>
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
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    WhatsApp Phone Number ID
                                </label>
                                <input
                                    type="text"
                                    name="whatsappPhoneNumberId"
                                    value={formData.whatsappPhoneNumberId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter Phone Number ID from Meta Dashboard"
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
                                />
                            </div>
                         </div>
                    </div>

                    {/* Homepage Layout Editor */}
                    {/* <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-md font-semibold mb-4 text-gray-800">Homepage Layout</h3>
                        <p className="text-sm text-gray-500 mb-4">Reorder sections and toggle visibility for the storefront.</p>
                        
                        <div className="space-y-3">
                            {homepageSections.map((section, index) => (
                                <div key={section.id} className={`flex items-center gap-4 p-4 rounded-xl border ${section.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                                    <div className="flex flex-col gap-1">
                                        <button 
                                            type="button" 
                                            onClick={() => moveSection(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                                        >
                                            <ArrowUp className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => moveSection(index, 'down')}
                                            disabled={index === homepageSections.length - 1}
                                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                                        >
                                            <ArrowDown className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{section.type.replace('_', ' ')}</span>
                                            {!section.enabled && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">Hidden</span>}
                                        </div>
                                        <input 
                                            type="text" 
                                            value={section.title || ''} 
                                            onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                            placeholder="Section Title"
                                            className="w-full max-w-sm px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                                        />
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={() => handleSectionChange(index, 'enabled', !section.enabled)}
                                        className={`p-2 rounded-full transition ${section.enabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                                        title={section.enabled ? 'Disable Section' : 'Enable Section'}
                                    >
                                        {section.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    <div className="sticky bottom-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex items-center gap-2 px-8 py-3 bg-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-pink-700 transition transform hover:-translate-y-1 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Configuration
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

