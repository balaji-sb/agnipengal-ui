'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface CarouselItem {
  id: string;
  image: string;
  title: string;
  link: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    scale: 1.1,
    opacity: 0,
    filter: 'blur(10px)',
  }),
  center: {
    zIndex: 1,
    x: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px)',
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Carousel({ items }: CarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = Math.abs(page % items.length);

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
        paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length, paginate]);


  if (!items || items.length === 0) return null;

  const currentItem = items[imageIndex];

  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-gray-900 group">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            filter: { duration: 0.4 }
          }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              fill
              className="object-cover"
              priority
              draggable={false}
            />
            
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            
            {/* Bottom Gradient for text readability */}
             <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-center items-center md:items-start p-8 md:p-32 container mx-auto">
                <div className="max-w-4xl w-full space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium uppercase tracking-[0.2em] text-sm"
                    >
                         <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                        Exclusive Collection
                    </motion.div>

                    <motion.h2 
                        initial={{ y: 50, opacity: 0, letterSpacing: '0.05em' }}
                        animate={{ y: 0, opacity: 1, letterSpacing: '-0.02em' }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-6 drop-shadow-2xl leading-tight"
                    >
                        {currentItem.title}
                    </motion.h2>
                    
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-6 pt-4"
                    >
                        <Link 
                            href={currentItem.link} 
                            className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                        >
                             <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                            <span className="relative z-10 tracking-wide">SHOP NOW</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 right-12 z-20 flex gap-4">
        {/* Indicators */}
         <div className="flex items-center gap-3 mr-8">
            {items.map((_, idx) => (
                <button 
                    key={idx} 
                    onClick={() => {
                      const direction = idx > imageIndex ? 1 : -1;
                      setPage([page + (idx - imageIndex), direction]);
                    }}
                    className={`h-1 transition-all duration-500 rounded-full ${
                      idx === imageIndex 
                          ? 'bg-white w-12' 
                          : 'bg-white/30 w-6 hover:bg-white/60'
                    }`}
                />
            ))}
        </div>

          <button 
              onClick={() => paginate(-1)} 
              className="p-4 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all active:scale-90"
          >
              <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
              onClick={() => paginate(1)} 
              className="p-4 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all active:scale-90"
          >
              <ChevronRight className="w-6 h-6" />
          </button>
      </div>
    </div>
  );
}
