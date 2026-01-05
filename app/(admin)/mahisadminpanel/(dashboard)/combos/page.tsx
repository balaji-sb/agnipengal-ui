'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Plus, Edit, Trash, Layers } from 'lucide-react';

export default function CombosPage() {
    const [combos, setCombos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCombos = async () => {
        setLoading(true);
        try {
            const res = await api.get('/combos');
            setCombos(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombos();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this combo?')) return;
        try {
            await api.delete(`/combos/${id}`);
            fetchCombos();
        } catch (error) {
            alert('Failed to delete combo');
        }
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Layers className="mr-2 text-purple-600" />
                    Combos
                </h1>
                <Link 
                    href="/mahisadminpanel/combos/new" 
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Combo
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Name</th>
                            <th className="p-4 font-medium text-gray-500">Price</th>
                            <th className="p-4 font-medium text-gray-500">Products</th>
                            <th className="p-4 font-medium text-gray-500">Active</th>
                            <th className="p-4 font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : combos.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No combos found.</td></tr>
                        ) : combos.map((combo) => (
                            <tr key={combo._id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-900">{combo.name}</td>
                                <td className="p-4 text-gray-700">₹{combo.price}</td>
                                <td className="p-4 text-gray-700">{combo.products?.length || 0} items</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${combo.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {combo.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 flex space-x-2">
                                    <Link href={`/mahisadminpanel/combos/${combo._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded inline-flex">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(combo._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
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
