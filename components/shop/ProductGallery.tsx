'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0] || '/placeholder.png');
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x, y });
    };

    return (
        <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div 
                className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
            >
                <div 
                    className={`relative w-full h-full transition-transform duration-200 ease-out origin-center ${isZoomed ? 'scale-150' : 'scale-100'}`}
                    style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
                >
                    <Image 
                        src={selectedImage} 
                        alt={productName} 
                        fill 
                        className="object-cover"
                        priority
                    />
                </div>
                
                {/* Zoom Hint */}
                {!isZoomed && (
                    <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-5 h-5 text-gray-600" />
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setSelectedImage(img)}
                            className={`relative aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 transition-all ${
                                selectedImage === img 
                                    ? 'border-pink-500 ring-2 ring-pink-500/20' 
                                    : 'border-transparent hover:border-gray-200'
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
        </div>
    );
}
