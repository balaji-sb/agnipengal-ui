'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: string; // or _id
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
    opacity: 0,
    scale: 1.05,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Carousel({ items }: CarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
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
    <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden rounded-2xl shadow-2xl group border border-gray-100/50 bg-gray-900">
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
            opacity: { duration: 0.2 },
            scale: { duration: 0.4 }
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
            
            {/* Overlay & Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                <div className="max-w-3xl">
                    <motion.h2 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-xl leading-tight"
                    >
                        {currentItem.title}
                    </motion.h2>
                    
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Link 
                            href={currentItem.link} 
                            className="inline-flex items-center gap-2 mt-2 px-8 py-3.5 bg-white text-black font-bold text-lg rounded-full hover:bg-pink-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
                            draggable={false}
                        >
                            Shop Collection
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls - Show on hover */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
              onClick={() => paginate(-1)} 
              className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/30 border border-white/20 transition-all shadow-lg hover:scale-110 active:scale-90"
              aria-label="Previous slide"
          >
              <ChevronLeft className="w-6 h-6" />
          </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
              onClick={() => paginate(1)} 
              className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/30 border border-white/20 transition-all shadow-lg hover:scale-110 active:scale-90"
              aria-label="Next slide"
          >
              <ChevronRight className="w-6 h-6" />
          </button>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, idx) => (
              <button 
                  key={idx} 
                  onClick={() => {
                      const direction = idx > imageIndex ? 1 : -1;
                      setPage([page + (idx - imageIndex), direction]);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 shadow-lg ${
                    idx === imageIndex 
                        ? 'bg-white w-8' 
                        : 'bg-white/40 w-2 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
              />
          ))}
      </div>
    </div>
  );
}
