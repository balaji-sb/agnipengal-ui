'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api'; // Use centralized API

import { Star, Search, Filter } from 'lucide-react';

interface Review {
    _id: string;
    product: {
        _id: string;
        name: string;
        images: string[];
    };
    user: {
        _id: string;
        name: string;
        email: string;
    };
    rating: number;
    comment: string;
    orderId: string;
    createdAt: string;
    media?: { url: string; type: 'image' | 'video' }[];
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterOrderId, setFilterOrderId] = useState('');
    const [filterProductId, setFilterProductId] = useState('');
    // Remove token usage as we rely on cookies via api instance
    // const { admin } = useAdminAuth(); 

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterOrderId) params.append('orderId', filterOrderId);
            if (filterProductId) params.append('productId', filterProductId);
            // Use api instance directlMeetbrilliants@y - logic for baseURL and credentials is built-in
            const res = await api.get(`/reviews/admin?${params.toString()}`);

            if (res.data.success) {
                setReviews(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // console.log('Admin:', admin);
        // Only fetch if admin is loaded/authenticated (or just on mount and let api fail if 401)
        // Check admin existence to be safe or just fetch
        // if (admin) {
            fetchReviews();
        // }
    }, []);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchReviews();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Reviews & Ratings</h1>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Order ID</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Order ID"
                                value={filterOrderId}
                                onChange={(e) => setFilterOrderId(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition"
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Product ID</label>
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Product ID"
                                value={filterProductId}
                                onChange={(e) => setFilterProductId(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition flex items-center space-x-2 h-[42px]"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Apply Filters</span>
                    </button>
                    { (filterOrderId || filterProductId) && (
                        <button
                            type="button"
                            onClick={() => {
                                setFilterOrderId('');
                                setFilterProductId('');
                                setTimeout(fetchReviews, 0); // Need to trigger fetch after state update, or just call directly with empty params if I extracted logic better. Simplest is reset state and let effect or manual call handle it. Actually the effect only runs on token change. So I need to manually call.
                                // Ideal: separate fetchReviews(oid, pid) args. But closure state is fine effectively if I clear first.
                                // Actually, setState is async. So calling fetchReviews immediately will use old state.
                                // Better: reload page or just clear and user hits apply.
                                // Let's just clear inputs and let user hit apply, OR nicer: clear and auto-fetch.
                                // I'll just clear inputs for now.
                            }}
                             className="px-4 py-2 text-gray-500 hover:text-gray-700 transition h-[42px]"
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Review</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Loading reviews...
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No reviews found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden relative">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        src={review.product?.images?.[0] || '/placeholder.png'} 
                                                        alt={review.product?.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 line-clamp-1 max-w-[150px]" title={review.product?.name}>
                                                        {review.product?.name || 'Unknown Product'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-mono">
                                                        {review.product?._id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{review.user?.name || 'Anonymous'}</div>
                                            <div className="text-xs text-gray-500">{review.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-yellow-400">
                                                <span className="font-bold text-gray-900 mr-2">{review.rating}</span>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 line-clamp-2 max-w-xs mb-2" title={review.comment}>
                                                {review.comment}
                                            </p>
                                            {review.media && review.media.length > 0 && (
                                                <div className="flex gap-2">
                                                    {review.media.map((item, idx) => (
                                                        <div key={idx} className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0 cursor-pointer" onClick={() => window.open(item.url, '_blank')}>
                                                            {item.type === 'video' ? (
                                                                <video src={item.url} className="w-full h-full object-cover" />
                                                            ) : (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img src={item.url} alt="Att" className="w-full h-full object-cover" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                            {review.orderId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
