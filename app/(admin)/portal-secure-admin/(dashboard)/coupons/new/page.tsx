'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCouponPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderValue: 0,
        expiryDate: '',
        maxDiscountAmount: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('/coupons/create', formData);
            if (data.success) {
                alert('Coupon created successfully');
                router.push('/portal-secureadmin/coupons');
            }
        } catch (error: any) {
            console.error('Error creating coupon', error);
            alert('Failed to create coupon: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Link href="/portal-secure-admin/coupons" className="inline-flex items-center text-gray-500 hover:text-gray-800 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Coupons
            </Link>
            
            <h1 className="text-2xl font-bold mb-8">Create New Coupon</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <input 
                        type="text" required name="code"
                        placeholder="e.g. SUMMER50"
                        value={formData.code} onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none uppercase"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                        <select 
                            name="discountType"
                            value={formData.discountType} onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white"
                        >
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED">Fixed Amount (₹)</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                         <input 
                            type="number" required name="discountValue"
                            placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '100'}
                            value={formData.discountValue} onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Value</label>
                         <input 
                            type="number" required name="minOrderValue"
                            value={formData.minOrderValue} onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                         <input 
                            type="date" required name="expiryDate"
                            value={formData.expiryDate} onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                    </div>
                </div>

                {formData.discountType === 'PERCENTAGE' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount (Optional)</label>
                        <input 
                            type="number" name="maxDiscountAmount"
                            placeholder="Max amount to discount, e.g. 200"
                            value={formData.maxDiscountAmount} onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Cap the discount amount for percentage based coupons.</p>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
                >
                    {loading ? 'Creating...' : 'Create Coupon'}
                </button>
            </form>
        </div>
    );
}
