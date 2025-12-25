'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, HelpCircle, AlertCircle } from 'lucide-react';
import axios from '@/lib/api';
import toast from 'react-hot-toast';

export default function FAQManager() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFAQs = async () => {
        try {
            const res = await axios.get('/faqs?isAdmin=true');
            if (res.data.success) {
                setFaqs(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            toast.error('Failed to load FAQs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            const res = await axios.delete(`/faqs/${id}`);
            if (res.data.success) {
                toast.success('FAQ deleted successfully');
                fetchFAQs();
            }
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            toast.error('Failed to delete FAQ');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading FAQs...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <HelpCircle className="w-8 h-8 text-pink-600" />
                        FAQ Manager
                    </h1>
                    <p className="text-gray-500 mt-1">Manage Frequently Asked Questions</p>
                </div>
                <Link 
                    href="/portal-secure-admin/faqs/new"
                    className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition shadow-md hover:shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New FAQ</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {faqs.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center text-gray-400">
                        <HelpCircle className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">No FAQs found.</p>
                        <p className="text-sm">Click "Add New FAQ" to create one.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {faqs.map((faq: any) => (
                            <div key={faq._id} className="p-6 hover:bg-gray-50 transition group">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${faq.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {faq.isActive ? 'Active' : 'Draft'}
                                            </span>
                                            <span className="text-xs text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                                                {faq.category}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-2">{faq.answer}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link 
                                            href={`/portal-secure-admin/faqs/${faq._id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(faq._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
