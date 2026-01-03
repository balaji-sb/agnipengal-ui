'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Link as LinkIcon, Check, X, Copy } from 'lucide-react';
import { useConfig } from '@/lib/context/ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductShareProps {
  productName: string;
  productSlug: string;
}

export default function ProductShare({ productName, productSlug }: ProductShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { config } = useConfig();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/product/${productSlug}`;
  const appName = config?.appName || 'Aari Shop';
  const shareText = `Check out ${productName} on ${appName}, Get 10% off on your first order!`;

  const handleShare = async () => {
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
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.001.54 1.973.916 3.287.916 3.179 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.766-5.771zm7.418 5.762c.001 4.091-3.328 7.421-7.419 7.421-1.282 0-2.285-.357-3.393-.949l-3.794.995 1.013-3.696c-.663-1.15-1.071-2.257-1.071-3.77 0-4.093 3.327-7.421 7.418-7.421 4.095 0 7.426 3.328 7.426 7.42l.001-.002z" />
          <path d="M17.16 14.162c-.285-.143-1.685-.83-1.947-.926-.259-.093-.448-.14-.637.143-.19.285-.737.926-.902 1.117-.168.191-.334.214-.617.073-.284-.143-1.201-.442-2.286-1.409-.844-.753-1.413-1.682-1.58-1.967-.167-.285-.018-.439.125-.581.13-.129.284-.334.428-.501.144-.167.19-.285.285-.476.096-.191.047-.357-.024-.5-.07-.143-.637-1.536-.874-2.103-.23-.55-.465-.476-.637-.485-.163-.008-.352-.009-.54-.009-.191 0-.501.071-.762.357-.262.286-1.001.977-1.001 2.381 0 1.405 1.023 2.762 1.166 2.952.143.193 2.016 3.076 4.881 4.312 2.871 1.237 2.871.825 3.393.774.522-.048 1.685-.69 1.921-1.357.238-.666.238-1.237.167-1.356-.07-.119-.26-.191-.545-.333z" />
        </svg>
      ),
      color: 'bg-[#25D366] hover:bg-[#128C7E]',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: 'bg-[#1877F2] hover:bg-[#165db8]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
           <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'bg-black hover:bg-gray-800',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleShare}
        className="p-2.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all group"
        title="Share"
      >
        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Share Popover for Desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-gray-50/50">
                <span className="font-bold text-gray-900 text-sm tracking-wide uppercase">Share Product</span>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            
            <div className="p-5">
              {/* Social Icons Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                  {socialLinks.map((link) => (
                      <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl text-white transition-all transform hover:-translate-y-1 hover:shadow-lg ${link.color}`}
                          title={`Share on ${link.name}`}
                      >
                          {link.icon}
                          <span className="text-[10px] font-medium tracking-wide opacity-90">{link.name}</span>
                      </a>
                  ))}
              </div>

              {/* Copy Link Section */}
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <LinkIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  <input 
                      readOnly 
                      value={shareUrl} 
                      className="block w-full pl-10 pr-12 py-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all font-medium"
                      onClick={(e) => e.currentTarget.select()}
                  />
                  <button
                      onClick={copyToClipboard}
                      className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg flex items-center justify-center transition-all ${
                          copied 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-white text-gray-500 hover:text-pink-600 shadow-sm border border-gray-100 hover:border-pink-200'
                      }`}
                      title="Copy Link"
                  >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
              </div>
              {copied && (
                <p className="text-center text-xs text-green-600 font-medium mt-2 animate-pulse">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
