'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import api from '@/lib/api';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data } = await api.get('/coupons');
            if (data.success) {
                setCoupons(data.data);
            }
        } catch (error) {
            console.error('Error fetching coupons', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            fetchCoupons();
        } catch (error) {
            console.error('Delete error', error);
            alert('Failed to delete coupon');
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await api.patch(`/coupons/${id}/status`);
            fetchCoupons();
        } catch (error) {
            console.error('Toggle error', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Tag className="w-6 h-6" /> Coupons
                </h1>
                <Link 
                    href="/admin/coupons/new"
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                >
                    <Plus className="w-4 h-4" /> Create Coupon
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Code</th>
                            <th className="p-4 font-semibold text-gray-600">Discount</th>
                            <th className="p-4 font-semibold text-gray-600">Min Order</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {coupons.map((coupon) => (
                            <tr key={coupon._id} className="hover:bg-gray-50/50">
                                <td className="p-4 font-mono font-bold text-gray-800">{coupon.code}</td>
                                <td className="p-4">
                                    {coupon.discountType === 'PERCENTAGE' 
                                        ? `${coupon.discountValue}% OFF` 
                                        : `₹${coupon.discountValue} OFF`
                                    }
                                </td>
                                <td className="p-4">₹{coupon.minOrderValue}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-3">
                                    <button 
                                        onClick={() => handleToggleStatus(coupon._id)}
                                        className="text-gray-500 hover:text-blue-600 transition"
                                        title="Toggle Status"
                                    >
                                        {coupon.isActive ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6" />}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(coupon._id)}
                                        className="text-gray-400 hover:text-red-600 transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {coupons.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No coupons found. Create one to get started.</div>
                )}
            </div>
        </div>
    );
}
