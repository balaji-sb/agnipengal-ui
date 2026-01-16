'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Reset selection when images change (e.g. variant switch)
    React.useEffect(() => {
        setSelectedImageIndex(0);
    }, [images]);

    const selectedImage = images[selectedImageIndex] || '/placeholder.png';

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Image Trigger */}
            <motion.div 
                layoutId={`product-image-${selectedImage}`}
                className="relative aspect-[4/5] md:aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
            >
                <Image 
                    src={selectedImage} 
                    alt={productName} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                />
                
                {/* Zoom Hint Icon */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                </div>
                
                {/* Overlay Hint */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold text-gray-800 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Click to Zoom
                    </span>
                </div>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`relative aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 transition-all ${
                                selectedImageIndex === idx 
                                    ? 'border-pink-500 ring-2 ring-pink-500/20 opacity-100' 
                                    : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100'
                            }`}
                        >
                            <Image 
                                src={img} 
                                alt={`${productName} view ${idx + 1}`} 
                                fill 
                                className="object-cover" 
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        {/* Close Button */}
                        <button 
                            className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-50"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-50"
                                    onClick={handlePrev}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button 
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-50"
                                    onClick={handleNext}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {/* Image Container */}
                        <motion.div 
                            layoutId={`product-image-${selectedImage}`}
                            className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={selectedImage}
                                    alt={productName}
                                    fill
                                    className="object-contain"
                                    priority
                                    quality={100}
                                />
                            </div>
                        </motion.div>
                        
                        {/* Footer Info */}
                        <div className="absolute bottom-6 left-0 right-0 text-center text-white/70">
                            <p className="text-sm">Image {selectedImageIndex + 1} of {images.length}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
