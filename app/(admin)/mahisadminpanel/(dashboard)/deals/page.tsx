'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Plus, Edit, Trash, Tag } from 'lucide-react';

export default function DealsPage() {
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDeals = async () => {
        setLoading(true);
        try {
            const res = await api.get('/deals');
            setDeals(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this deal?')) return;
        try {
            await api.delete(`/deals/${id}`);
            fetchDeals();
        } catch (error) {
            alert('Failed to delete deal');
        }
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Tag className="mr-2 text-red-500" />
                    Deals
                </h1>
                <Link 
                    href="/mahisadminpanel/deals/new" 
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Deal
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Name</th>
                            <th className="p-4 font-medium text-gray-500">Deal Price</th>
                            <th className="p-4 font-medium text-gray-500">Duration</th>
                            <th className="p-4 font-medium text-gray-500">Items</th>
                            <th className="p-4 font-medium text-gray-500">Active</th>
                            <th className="p-4 font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : deals.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No deals found.</td></tr>
                        ) : deals.map((deal) => (
                            <tr key={deal._id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-900">{deal.name}</td>
                                <td className="p-4 text-gray-700">₹{deal.dealPrice}</td>
                                <td className="p-4 text-xs text-gray-600">
                                    <div className="font-semibold">{formatDate(deal.startDate)}</div>
                                    <div className="text-gray-400">to</div>
                                    <div className="font-semibold">{formatDate(deal.endDate)}</div>
                                </td>
                                <td className="p-4 text-gray-700">{deal.products?.length || 0}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${deal.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {deal.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <Link href={`/mahisadminpanel/deals/${deal._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded inline-flex">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(deal._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
