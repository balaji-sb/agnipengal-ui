'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, HandHeart, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className='relative bg-[#FAF9F6] dark:bg-[#121212] pt-24 pb-28 lg:pt-32 lg:pb-36 min-h-[90vh] flex items-center overflow-hidden font-sans'>
      {/* Subtle Pattern Overlay */}
      <div
        className='absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]'
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <div className='container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10 max-w-7xl'>
        <div className='grid lg:grid-cols-2 gap-16 lg:gap-12 items-center'>
          {/* Main Typography Content */}
          <div className='max-w-2xl mx-auto lg:mx-0 text-center lg:text-left flex flex-col justify-center h-full'>
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 mb-8 self-center lg:self-start transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/50'>
              <Sparkles className='w-3.5 h-3.5 text-orange-600 dark:text-orange-400' />
              <span className='text-sm font-medium text-orange-800 dark:text-orange-300 tracking-wide uppercase text-xs'>
                Join our thriving community
              </span>
            </div>

            <h1 className='text-5xl sm:text-6xl lg:text-[4.2rem] font-bold text-gray-900 dark:text-white tracking-tight mb-8 leading-[1.1]'>
              Turn Your Passion Into a <br className='hidden md:block' />
              <span className='text-orange-600 dark:text-orange-500 relative inline-block'>
                Thriving Business
                {/* Decorative underline */}
                <svg
                  className='absolute w-full h-3 -bottom-1 left-0 text-orange-200 dark:text-orange-900/50 -z-10'
                  viewBox='0 0 100 10'
                  preserveAspectRatio='none'
                >
                  <path
                    d='M0 5 Q 50 10 100 5'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='8'
                    strokeLinecap='round'
                  />
                </svg>
              </span>
            </h1>

            <p className='text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal'>
              Partner with Agni Pengal. Subscribe today to launch your digital storefront, showcase
              your unique crafts to thousands of buyers, and grow alongside fellow women
              entrepreneurs.
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14'>
              <Link href='/partnership' className='w-full sm:w-auto min-w-[200px]'>
                <button className='w-full px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 border border-transparent'>
                  Start Selling Now
                  <ArrowRight className='w-5 h-5' />
                </button>
              </Link>
              <Link href='/how-it-works' className='w-full sm:w-auto min-w-[200px]'>
                <button className='w-full px-8 py-4 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-all duration-200 flex items-center justify-center gap-2'>
                  See How It Works
                </button>
              </Link>
            </div>

            {/* Feature Marks - Artisan Partnership style */}
            <div className='grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-left'>
              <div className='flex items-start gap-3'>
                <div className='mt-1 p-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-md'>
                  <HandHeart className='w-5 h-5 text-rose-600 dark:text-rose-400' />
                </div>
                <div>
                  <h4 className='text-sm font-bold text-gray-900 dark:text-white'>Empowerment</h4>
                  <p className='text-xs text-gray-500 mt-0.5'>By women, for women</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='mt-1 p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md'>
                  <TrendingUp className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <h4 className='text-sm font-bold text-gray-900 dark:text-white'>
                    Zero Setup Fees
                  </h4>
                  <p className='text-xs text-gray-500 mt-0.5'>Simple subscriptions</p>
                </div>
              </div>
              <div className='flex items-start gap-3 col-span-2 md:col-span-1'>
                <div className='mt-1 p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md'>
                  <Users className='w-5 h-5 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <h4 className='text-sm font-bold text-gray-900 dark:text-white'>Global Reach</h4>
                  <p className='text-xs text-gray-500 mt-0.5'>Access 10k+ buyers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Image Layout */}
          <div className='relative mx-auto w-full max-w-[500px] lg:max-w-none lg:mx-0 lg:pl-8 xl:pl-16'>
            {/* Primary Featured Image */}
            <div className='relative z-10 w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/5] sm:aspect-[3/4] group'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src='https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200'
                alt='Women entrepreneur crafting products'
                className='w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105'
              />
              {/* Subtle gradient overlay for better contrast if image is light */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 transition-opacity duration-300'></div>

              {/* Image inner overlay content */}
              <div className='absolute bottom-10 left-8 right-8 text-white z-20'>
                <p className='text-xl font-medium leading-snug mb-3'>
                  &quot;Partnering with Agni Pengal gave me the platform to scale my local craft
                  into a sustaining business.&quot;
                </p>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 rounded-full border-2 border-white/50 overflow-hidden'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src='https://i.pravatar.cc/100?img=17'
                      alt='Artisan'
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div>
                    <h5 className='text-base font-bold text-white'>Shreya M.</h5>
                    <p className='text-sm text-white/80'>Textile Artist, Chennai</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Social Proof / Subscription Highlight Card */}
            <div className='absolute top-8 -left-4 sm:-left-12 bg-white dark:bg-[#1A1A1A] p-5 sm:p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-20 w-[90%] sm:w-[320px] transform transition-transform duration-300 hover:scale-[1.02]'>
              <div className='flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4'>
                <div className='bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-full flex items-center justify-center shrink-0'>
                  <span className='text-xl font-black text-orange-600 dark:text-orange-400'>₹</span>
                </div>
                <div>
                  <h5 className='font-bold text-gray-900 dark:text-white text-lg leading-tight'>
                    Pro Seller Plan
                  </h5>
                  <p className='text-sm text-gray-500'>Unlocks premium tools</p>
                </div>
              </div>
              <ul className='space-y-3'>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='w-4 h-4 text-green-500 mt-0.5 shrink-0' />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    Infinite product listings
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='w-4 h-4 text-green-500 mt-0.5 shrink-0' />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    Dedicated storefront URL
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle2 className='w-4 h-4 text-green-500 mt-0.5 shrink-0' />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    Priority community support
                  </span>
                </li>
              </ul>
            </div>

            {/* Decorative background element behind image */}
            <div className='absolute -bottom-6 -right-6 w-3/4 h-3/4 bg-orange-100 dark:bg-orange-900/20 rounded-2xl -z-10 transition-transform duration-500 hover:translate-x-2 hover:translate-y-2'></div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity z-30 pointer-events-none'>
        <span className='text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-2'>
          Scroll
        </span>
        <div className='w-5 h-8 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center p-0.5'>
          <div className='w-1 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce mt-1' />
        </div>
      </div>
    </section>
  );
}
