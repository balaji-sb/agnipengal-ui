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
    media?: { url: string; type: 'image' | 'video' }[];
}

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
    const ratingCounts = reviews.reduce((acc, r) => {
        acc[r.rating] = (acc[r.rating] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

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

            {!loading && reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   
                   {/* Average Rating */}
                   <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                        <p className="text-5xl font-black text-gray-900">{avgRating.toFixed(1)}</p>
                        <div className="flex text-yellow-400 my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    className={`w-6 h-6 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-gray-200'}`} 
                                />
                            ))}
                        </div>
                        <p className="text-gray-500 font-medium">{reviews.length} Global Ratings</p>
                   </div>

                   {/* Rating Distribution */}
                   <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-600 w-3">{star}</span>
                                <Star className="w-4 h-4 text-gray-400" />
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-yellow-400 rounded-full" 
                                        style={{ width: `${((ratingCounts[star] || 0) / reviews.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 w-10 text-right">
                                    {Math.round(((ratingCounts[star] || 0) / reviews.length) * 100)}%
                                </span>
                            </div>
                        ))}
                   </div>
                </div>
            )}

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
                            <p className="text-gray-600 leading-relaxed mb-4">{review.comment}</p>
                            
                            {/* Media Attachments */}
                            {review.media && review.media.length > 0 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {review.media.map((item, idx) => (
                                        <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 cursor-pointer hover:opacity-90 transition">
                                            {item.type === 'video' ? (
                                                <video src={item.url} className="w-full h-full object-cover" />
                                            ) : (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={item.url} alt="Review attachment" className="w-full h-full object-cover" onClick={() => window.open(item.url, '_blank')} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
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
