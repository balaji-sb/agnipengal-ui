'use client';

import React, { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/context/AuthContext';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: { _id: string; name: string; image?: string };
    orderId: string;
    onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, product, orderId, onSuccess }: ReviewModalProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            // Updated to use backend-server endpoint
            const res = await api.post('/reviews', {
                rating,
                comment,
                productId: product._id,
                orderId: orderId
            });

            if (res.data.success) {
                setSuccess(true);
                if (onSuccess) onSuccess(); // Notify parent to refresh state
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setComment('');
                    setRating(5);
                }, 1500);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h4>
                            <p className="text-gray-500">Your review for {product.name} has been submitted.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div>
                                <p className="text-sm text-gray-500 mb-2">Product</p>
                                <p className="font-medium text-gray-900">{product.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Rate this product</label>
                                <div className="flex gap-3 justify-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                        >
                                            <Star 
                                                className={`w-10 h-10 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none transition bg-gray-50 focus:bg-white"
                                    placeholder="What did you like or dislike?"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center font-medium">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-gradient-to-r from-pink-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-pink-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
