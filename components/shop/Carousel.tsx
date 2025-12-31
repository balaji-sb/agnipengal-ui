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
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-3xl shadow-2xl group border border-white/10 bg-gray-900 mx-auto max-w-[1400px]">
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
            scale: { duration: 0.8, ease: "easeInOut" },
            filter: { duration: 0.4 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
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
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Glassmorphic Content Card */}
            <div className="absolute inset-0 flex flex-col justify-center items-center md:items-start p-8 md:p-24">
                <div className="max-w-4xl w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium uppercase tracking-wider"
                    >
                        Exclusive Collection
                    </motion.div>

                    <motion.h2 
                        initial={{ y: 50, opacity: 0, letterSpacing: '0em' }}
                        animate={{ y: 0, opacity: 1, letterSpacing: '-0.02em' }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 mb-8 drop-shadow-2xl leading-[1.1]"
                    >
                        {currentItem.title}
                    </motion.h2>
                    
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link 
                            href={currentItem.link} 
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-pink-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 overflow-hidden"
                            draggable={false}
                        >
                            <span className="relative z-10">Shop Now</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                            <div className="absolute inset-0 z-0 bg-white group-hover:scale-x-0 transition-transform duration-300 origin-left" />
                            <span className="absolute inset-0 z-10 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-3">
                                Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        
                        {/* <button className="px-8 py-4 rounded-full border border-white/30 hover:bg-white/10 text-white font-medium backdrop-blur-sm transition-all hover:scale-105">
                            View Details
                        </button> */}
                    </motion.div>
                </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Controls */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-20">
          <button 
              onClick={() => paginate(-1)} 
              className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-full hover:bg-white/20 transition-all hover:scale-110 active:scale-90 group"
          >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button 
              onClick={() => paginate(1)} 
              className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-full hover:bg-white/20 transition-all hover:scale-110 active:scale-90 group"
          >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
      </div>
      
      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-10 md:left-24 flex gap-3 z-20">
          {items.map((_, idx) => (
              <button 
                  key={idx} 
                  onClick={() => {
                      const direction = idx > imageIndex ? 1 : -1;
                      setPage([page + (idx - imageIndex), direction]);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === imageIndex 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 w-12' 
                        : 'bg-white/30 w-6 hover:bg-white/50'
                  }`}
              />
          ))}
      </div>
    </div>
  );
}
