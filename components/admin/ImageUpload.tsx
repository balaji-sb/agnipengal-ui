'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface ImageUploadProps {
    value: string | string[];
    onChange: (url: string | string[]) => void;
    label?: string;
    multiple?: boolean;
    folder?: string;
}

export default function ImageUpload({ value, onChange, label = "Category Image", multiple = false, folder = "others" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    // Helper to normalize value to array regardless of input
    const getValues = (): string[] => {
        if (!value) return [];
        return Array.isArray(value) ? value : [value];
    };

    const currentValues = getValues();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        const uploadedUrls: string[] = [];

        try {
            // Upload each file sequentially
            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', folder);

                const res = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (res.data.success) {
                    uploadedUrls.push(res.data.data.imageUrl);
                }
            }

            if (multiple) {
                // Return new array with existing + new images
                onChange([...currentValues, ...uploadedUrls]);
            } else {
                // Return just the last uploaded image for single mode (replacing)
                // If they uploaded multiple files in single mode (dragged 2 files), standard dropzone 'multiple:false' usually prevents this,
                // but just in case, we take the last one or first one. Use last one here.
                if (uploadedUrls.length > 0) {
                     onChange(uploadedUrls[0]);
                }
            }

        } catch (error) {
            console.error('Upload failed', error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    }, [onChange, multiple, currentValues, folder]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: multiple,
        disabled: uploading
    });

    const handleRemove = (e: React.MouseEvent, urlToRemove: string) => {
        e.stopPropagation();
        if (multiple) {
            onChange(currentValues.filter(url => url !== urlToRemove));
        } else {
            onChange('');
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
            
            {/* Grid for multiple images */}
            {multiple && currentValues.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {currentValues.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <button 
                                    type="button"
                                    onClick={(e) => handleRemove(e, url)}
                                    className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                             </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dropzone Area */}
            {/* Hide dropzone if single mode and has value */}
            {(!multiple && currentValues.length > 0) ? (
                 <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentValues[0]} alt="Uploaded" className="w-full h-full object-contain bg-gray-50" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button 
                            type="button"
                            onClick={(e) => handleRemove(e, currentValues[0])}
                            className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            ) : (
                <div 
                    {...getRootProps()} 
                    className={`
                        relative border-2 border-dashed rounded-xl p-6 transition cursor-pointer flex flex-col items-center justify-center text-center h-32 md:h-48
                        ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                    `}
                >
                    <input {...getInputProps()} />

                    {uploading ? (
                        <div className="flex flex-col items-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 text-pink-500" />
                            <span className="text-sm">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                                <UploadCloud className="w-6 h-6 text-pink-500" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                {isDragActive ? 'Drop images here' : multiple ? 'Click to upload multiple images' : 'Click to upload image'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or WEBP</p>
                        </div>
                    )}
                </div>
            )}
             
             {!multiple && currentValues.length > 0 && <p className="text-xs text-gray-400 mt-2 truncate">URL: {currentValues[0]}</p>}
        </div>
    );
}
