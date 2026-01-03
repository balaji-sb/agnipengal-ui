'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check, Facebook, Twitter, MessageCircle, X } from 'lucide-react';

interface ProductShareProps {
  productName: string;
  productSlug: string;
}

export default function ProductShare({ productName, productSlug }: ProductShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Construct standard URL (assumes window is available in client component)
  // Fallback to origin if window is not yet ready (SSR safe)
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/product/${productSlug}`;
  const shareText = `Check out ${productName} on Aari Shop!`;

  const handleShare = async () => {
    // If Web Share API is available (mobile), use it
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to custom dropdown
      setIsOpen(!isOpen);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black hover:bg-gray-800',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all"
        title="Share"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Share Modal/Dropdown for Desktop */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/5" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-900">Share this product</span>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
                {socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-white transition-colors ${link.color}`}
                        title={`Share on ${link.name}`}
                    >
                        <link.icon className="w-5 h-5" />
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                        copied ? 'bg-green-50 text-green-600 ring-2 ring-green-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Copy Link"
                >
                    {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                </button>
            </div>
            
            <div className="relative">
                <input 
                    readOnly 
                    value={shareUrl} 
                    className="w-full text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 focus:outline-none"
                    onClick={(e) => e.currentTarget.select()}
                />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
