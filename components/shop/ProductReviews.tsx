'use client';

import React, { useState, useEffect } from 'react';
import { Star, User as UserIcon } from 'lucide-react';
import api from '@/lib/api';

interface Review {
    _id: string;
    user: { _id: string; name: string };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Updated to use backend-server endpoint
                const res = await api.get(`/reviews/product/${productId}`);
                if (res.data.success) {
                    setReviews(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch reviews', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    return (
        <section className="mt-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                Customer Reviews
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{reviews.length}</span>
            </h2>

            <div className="space-y-6">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl" />)}
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-violet-100 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No reviews yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
