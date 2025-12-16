'use client';

import React from 'react';
import { Star, X, Quote } from 'lucide-react';

interface ViewReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    review: {
        rating: number;
        comment: string;
        createdAt: string;
    };
}

export default function ViewReviewModal({ isOpen, onClose, productName, review }: ViewReviewModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Your Review</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 text-center">
                        <p className="text-sm text-gray-500 mb-2">For product</p>
                        <h4 className="font-semibold text-gray-900 text-lg">{productName}</h4>
                    </div>

                    <div className="bg-yellow-50 rounded-xl p-4 mb-6 flex justify-center">
                        <div className="flex gap-2">
                             {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    className={`w-8 h-8 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                                />
                            ))}
                        </div>
                    </div>

                    <div className="relative bg-gray-50 rounded-xl p-6">
                        <Quote className="absolute top-4 left-4 w-6 h-6 text-gray-300 -scale-x-100 opacity-50" />
                        <p className="text-gray-700 italic text-center relative z-10 font-medium leading-relaxed">
                            "{review.comment}"
                        </p>
                        <Quote className="absolute bottom-4 right-4 w-6 h-6 text-gray-300 opacity-50" />
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">Posted on {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
