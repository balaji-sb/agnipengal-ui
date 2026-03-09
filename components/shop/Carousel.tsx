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

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page],
  );

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
    <div className='relative w-full h-[35vh] md:h-[55vh] overflow-hidden bg-white/5 flex items-center justify-center'>
      <AnimatePresence initial={false} custom={direction} mode='popLayout'>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{
            x: { type: 'tween', ease: 'easeInOut', duration: 0.6 },
            opacity: { duration: 0.6 },
            filter: { duration: 0.6 },
          }}
          className='absolute inset-0'
        >
          <div className='relative w-full h-full'>
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              fill
              className='object-cover object-center'
              priority
              draggable={false}
            />

            {/* Elegant Vignette & Gradient Overlay for text contrast */}
            <div className='absolute inset-0 bg-black/20' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10' />

            {/* Content Container - Bottom aligned for sleek half-screen look */}
            <div className='absolute inset-0 flex flex-col justify-end items-center text-center pb-10 md:pb-24 px-6 max-w-5xl mx-auto w-full'>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className='flex items-center gap-3 mb-4'
              >
                <span className='w-8 h-[1px] bg-white/60'></span>
                <span className='text-white/90 text-[10px] md:text-sm font-medium uppercase tracking-[0.4em]'>
                  New Arrival
                </span>
                <span className='w-8 h-[1px] bg-white/60'></span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                className='text-2xl md:text-5xl lg:text-6xl font-serif text-white mb-6 md:mb-10 tracking-tight leading-tight drop-shadow-md pb-2'
              >
                {currentItem.title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Link
                  href={currentItem.link}
                  className='group flex items-center gap-3 px-8 py-3.5 bg-white text-black font-semibold text-xs md:text-sm tracking-[0.15em] hover:bg-black hover:text-white transition-all duration-300 rounded-sm'
                >
                  EXPLORE
                  <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Minimal floating style */}
      <button
        onClick={() => paginate(-1)}
        className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-black/20 rounded-full backdrop-blur-sm transition-all z-20'
        aria-label='Previous'
      >
        <ChevronLeft className='w-6 h-6 md:w-8 md:h-8' strokeWidth={1.5} />
      </button>

      <button
        onClick={() => paginate(1)}
        className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-black/20 rounded-full backdrop-blur-sm transition-all z-20'
        aria-label='Next'
      >
        <ChevronRight className='w-6 h-6 md:w-8 md:h-8' strokeWidth={1.5} />
      </button>

      {/* Modern thin indicators */}
      <div className='absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-3'>
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const direction = idx > imageIndex ? 1 : -1;
              setPage([page + (idx - imageIndex), direction]);
            }}
            className={`h-0.5 transition-all duration-500 rounded-none overflow-hidden ${
              idx === imageIndex ? 'bg-white w-10 md:w-16' : 'bg-white/30 w-6 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
