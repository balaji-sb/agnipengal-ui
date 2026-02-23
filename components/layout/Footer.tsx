'use client';

import React from 'react';
import Link from 'next/link';
import { Send, CreditCard, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

import { useConfig } from '@/lib/context/ConfigContext';

export default function Footer() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [cmsPages, setCmsPages] = React.useState<any[]>([]);
  const [shops, setShops] = React.useState<any[]>([]);
  const { config } = useConfig();
  const appName = config?.appName || 'Agni Pengal';

  React.useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data } = await api.get('/cms');
        setCmsPages(data);
      } catch (error) {
        console.error('Failed to fetch footer pages:', error);
      }
    };
    const fetchShops = async () => {
      try {
        const { data } = await api.get('/vendors', { params: { limit: 5 } });
        // Backend returns array directly or { data: [...] }
        const list = Array.isArray(data) ? data : data?.data || data?.vendors || [];
        setShops(list.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch footer shops:', error);
      }
    };
    fetchPages();
    fetchShops();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await api.post('/subscribers', { email });
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className='relative mt-20'>
      {/* Decorative Top Gradient */}
      <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-rose-500' />

      {/* Main Footer Content */}
      <div className='bg-gray-900 text-gray-300 pt-16 pb-8'>
        <div className='container mx-auto px-4'>
          {/* Newsletter Section - Catchy & Prominent */}
          <div className='max-w-4xl mx-auto mb-16 text-center'>
            <h2 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400 mb-4'>
              Join the {appName} Family
            </h2>
            <p className='text-gray-400 mb-8 max-w-lg mx-auto'>
              Subscribe to get exclusive offers, early access to new sewing kits, and aari work tips
              delivered to your inbox.
            </p>
            <form
              onSubmit={handleSubscribe}
              className='flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto relative group'
            >
              <div className='absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000'></div>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email address'
                disabled={loading}
                className='relative flex-1 bg-gray-800 border-gray-700 text-white rounded-lg px-5 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
                required
              />
              <button
                type='submit'
                disabled={loading}
                className='relative bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className='w-4 h-4' />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-gray-800 pt-12'>
            {/* Brand Section */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-white tracking-tight'>{appName}</h3>
              <p className='text-sm leading-relaxed text-gray-400'>
                Your premium destination for Aari raw materials, custom sewing kits, and exquisite
                decoration items. We empower your creativity with quality.
              </p>
              <div className='flex gap-4'>
                <a
                  href='https://www.instagram.com/agnipengal/'
                  className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1'
                  target='_blank'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
                    <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                    <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
                  </svg>
                </a>
                <a
                  href='https://www.facebook.com/agnipengal'
                  className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1'
                  target='_blank'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
                  </svg>
                </a>
                <a
                  href='https://www.youtube.com/@agnipengal16'
                  className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1'
                  target='_blank'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17' />
                    <path d='m10 15 5-3-5-3z' />
                  </svg>
                </a>
                {/* Twitter / X */}
                <a
                  href='https://x.com/agnipengal'
                  className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-600 hover:text-white transition-all transform hover:-translate-y-1'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Twitter / X'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.63 5.907-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                  </svg>
                </a>
                {/* Reddit */}
                <a
                  href='https://www.reddit.com/user/Aggravating_Award787/'
                  className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Reddit'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z' />
                  </svg>
                </a>
                {/* Pinterest */}
                <a
                  href='https://www.pinterest.com/agnipengal16/?actingBusinessId=1139551649371920657'
                  className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-700 hover:text-white transition-all transform hover:-translate-y-1'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Pinterest'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z' />
                  </svg>
                </a>
              </div>
            </div>

            {/* Shop — dynamic vendor shops */}
            <div>
              <h4 className='text-lg font-semibold text-white mb-6 flex items-center gap-2'>
                <span className='w-8 h-1 bg-red-500 rounded-full'></span>
                Shop
              </h4>
              <ul className='space-y-3 text-sm'>
                {/* Always-visible link */}
                <li>
                  <a
                    href='/products'
                    className='hover:text-red-400 transition-colors flex items-center gap-2 group'
                  >
                    <span className='w-1 h-1 bg-gray-600 rounded-full group-hover:bg-red-500 transition-colors'></span>
                    All Products
                  </a>
                </li>
                {/* Dynamic vendor shops */}
                {shops.map((shop) => (
                  <li key={shop._id}>
                    <a
                      href={`/shops/${shop._id}`}
                      className='hover:text-red-400 transition-colors flex items-center gap-2 group'
                    >
                      <span className='w-1 h-1 bg-gray-600 rounded-full group-hover:bg-red-500 transition-colors'></span>
                      {shop.storeName || shop.name}
                    </a>
                  </li>
                ))}
                {/* Fallback if no shops loaded yet */}
                {shops.length === 0 && (
                  <>
                    <li>
                      <a
                        href='/products?sort=newest'
                        className='hover:text-red-400 transition-colors flex items-center gap-2 group'
                      >
                        <span className='w-1 h-1 bg-gray-600 rounded-full group-hover:bg-red-500 transition-colors'></span>
                        New Arrivals
                      </a>
                    </li>
                  </>
                )}
                <li>
                  <a
                    href='/shops'
                    className='hover:text-red-400 transition-colors flex items-center gap-2 group mt-1'
                  >
                    <span className='w-1 h-1 bg-gray-600 rounded-full group-hover:bg-red-500 transition-colors'></span>
                    Browse All Shops →
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className='text-lg font-semibold text-white mb-6 flex items-center gap-2'>
                <span className='w-8 h-1 bg-orange-500 rounded-full'></span>
                Support
              </h4>
              <ul className='space-y-3 text-sm'>
                {cmsPages.map((page) => (
                  <li key={page._id}>
                    <Link
                      href={`/pages/${page.slug}`}
                      className='text-gray-400 hover:text-white transition'
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href='/faq' className='text-gray-400 hover:text-white transition'>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href='/account/support'
                    className='text-gray-400 hover:text-white transition'
                  >
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className='text-lg font-semibold text-white mb-6 flex items-center gap-2'>
                <span className='w-8 h-1 bg-amber-500 rounded-full'></span>
                We Accept
              </h4>
              <div className='grid grid-cols-2 gap-3 mb-6'>
                {/* Simulate Payment Badges */}
                <div className='bg-gray-800 p-2 rounded flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-700'>
                  UPI / GPay
                </div>
                <div className='bg-gray-800 p-2 rounded flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-700'>
                  Cards
                </div>
                <div className='bg-gray-800 p-2 rounded flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-700'>
                  NetBanking
                </div>
                <div className='bg-gray-800 p-2 rounded flex items-center justify-center text-xs font-semibold text-gray-500 border border-gray-700'>
                  Wallets
                </div>
              </div>

              <div className='space-y-3 text-sm text-gray-400'>
                <div className='flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-800'>
                  <Truck className='w-5 h-5 text-indigo-400' />
                  <span>Fast Delivery across India</span>
                </div>
                <div className='flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-800'>
                  <ShieldCheck className='w-5 h-5 text-green-400' />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-gray-950 py-6 border-t border-gray-900'>
        <div className='container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4'>
          <p>
            &copy; {new Date().getFullYear()} {appName}. All rights reserved.
          </p>

          {/* Made in India badge */}
          <div className='flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-700'>
            {/* Tricolour stripes */}
            <div className='flex flex-col gap-[3px]'>
              <div className='w-6 h-[3px] rounded-full bg-orange-500' />
              <div className='w-6 h-[3px] rounded-full bg-white' />
              <div className='w-6 h-[3px] rounded-full bg-green-600' />
            </div>
            <span className='text-gray-300 font-semibold text-[11px] tracking-wide'>
              Made in India
            </span>
            {/* Ashoka Chakra simplified */}
            <svg viewBox='0 0 24 24' className='w-4 h-4 text-blue-400' fill='currentColor'>
              <circle cx='12' cy='12' r='3' fill='none' stroke='currentColor' strokeWidth='1.5' />
              <circle cx='12' cy='12' r='10' fill='none' stroke='currentColor' strokeWidth='1' />
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 12 + 3.5 * Math.cos(angle);
                const y1 = 12 + 3.5 * Math.sin(angle);
                const x2 = 12 + 9.5 * Math.cos(angle);
                const y2 = 12 + 9.5 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke='currentColor'
                    strokeWidth='0.8'
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
