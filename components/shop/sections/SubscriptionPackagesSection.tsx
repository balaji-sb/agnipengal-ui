import React from 'react';
import { Check, ShieldCheck, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

interface Plan {
  _id: string;
  name: string;
  price: number;
  durationInMonths: number;
  features: string[];
  maxProducts: number;
  isActive: boolean;
  priority: number;
}

interface SubscriptionPackagesSectionProps {
  plans: Plan[];
}

export default function SubscriptionPackagesSection({ plans }: SubscriptionPackagesSectionProps) {
  if (!plans || plans.length === 0) return null;

  // Sort plans by price
  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  return (
    <div className='py-24 px-4 bg-gradient-to-b from-[#FAF9F6] to-white dark:from-[#121212] dark:to-black relative overflow-hidden font-sans border-t border-gray-100 dark:border-gray-800'>
      {/* Subtle Background Pattern matching Hero */}
      <div
        className='absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.08]'
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      {/* Decorative blurred background blobs */}
      <div className='absolute top-0 left-1/4 w-96 h-96 bg-orange-200/20 dark:bg-orange-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob'></div>
      <div className='absolute top-0 right-1/4 w-96 h-96 bg-pink-200/20 dark:bg-pink-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000'></div>

      <div className='container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-20 max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/40 dark:to-pink-950/40 border border-orange-100/50 dark:border-orange-900/50 mb-8 shadow-sm'>
            <ShieldCheck className='w-4 h-4 text-orange-600 dark:text-orange-400' />
            <span className='text-sm font-semibold text-orange-800 dark:text-orange-300 tracking-wide uppercase'>
              Agnipengal Partnership
            </span>
          </div>

          <h2 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight'>
            Simple pricing for <br className='hidden sm:block' />{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600'>
              growing businesses
            </span>
          </h2>
          <p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto leading-relaxed'>
            Choose the perfect partnership plan to scale your artisan craft. Zero setup fees, cancel
            anytime. Join our community of empowered women entrepreneurs.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto'>
          {sortedPlans.map((plan, index) => {
            // Highlight the middle plan or the most expensive one if only two
            const isHighlight =
              sortedPlans.length >= 3 ? index === 1 : index === sortedPlans.length - 1;

            return (
              <div
                key={plan._id}
                className={clsx(
                  'relative flex flex-col p-8 rounded-3xl transition-all duration-300 h-full',
                  isHighlight
                    ? 'bg-gradient-to-b from-white to-orange-50/30 dark:from-[#1A1A1A] dark:to-[#221511] border-2 border-orange-500 shadow-2xl shadow-orange-900/10 dark:shadow-orange-900/30 md:-mt-8 md:mb-8 relative z-20 scale-100 md:scale-105'
                    : 'bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:-translate-y-2 z-10',
                )}
              >
                {/* Highlight Badge */}
                {isHighlight && (
                  <div className='absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-6 py-2 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg ring-4 ring-white dark:ring-[#121212] whitespace-nowrap'>
                    <Star className='w-4 h-4 fill-white text-white' />
                    Highly Recommended
                  </div>
                )}

                <div className='mb-8 border-b border-gray-100 dark:border-gray-800 pb-8 text-center'>
                  <h3
                    className={clsx(
                      'text-2xl font-bold mb-3',
                      isHighlight
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-900 dark:text-white',
                    )}
                  >
                    {plan.name}
                  </h3>
                  <div className='flex items-end justify-center gap-1 mt-4'>
                    <span className='text-5xl font-black text-gray-900 dark:text-white tracking-tight'>
                      ₹{plan.price}
                    </span>
                    <span className='text-base font-medium text-gray-500 dark:text-gray-400 mb-1'>
                      / {plan.durationInMonths} Month{plan.durationInMonths > 1 ? 's' : ''}
                    </span>
                  </div>
                  {isHighlight && (
                    <p className='text-sm font-medium text-orange-600 dark:text-orange-400 mt-3 bg-orange-50 dark:bg-orange-900/20 inline-block px-3 py-1 rounded-full'>
                      Best value for money
                    </p>
                  )}
                </div>

                <div className='flex-grow'>
                  <p className='text-sm font-bold text-gray-900 dark:text-gray-200 mb-6 uppercase tracking-wider text-center'>
                    What&apos;s included
                  </p>
                  <ul className='space-y-4 mb-8'>
                    <li className='flex items-start gap-3'>
                      <div
                        className={clsx(
                          'mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                          isHighlight
                            ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                        )}
                      >
                        <Check className='w-3.5 h-3.5' strokeWidth={3} />
                      </div>
                      <span className='text-base text-gray-700 dark:text-gray-300'>
                        List up to{' '}
                        <strong className='font-bold text-gray-900 dark:text-white'>
                          {plan.maxProducts}
                        </strong>{' '}
                        Products
                      </span>
                    </li>
                    {plan.features.map((feature, i) => (
                      <li key={i} className='flex items-start gap-3'>
                        <div
                          className={clsx(
                            'mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                            isHighlight
                              ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                          )}
                        >
                          <Check className='w-3.5 h-3.5' strokeWidth={3} />
                        </div>
                        <span className='text-base text-gray-700 dark:text-gray-300'>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href='/vendor/register'
                  className={clsx(
                    'w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 text-lg transform hover:scale-[1.02] active:scale-100',
                    isHighlight
                      ? 'bg-gradient-to-r from-orange-600 to-pink-600 border-transparent text-white hover:from-orange-700 hover:to-pink-700 shadow-xl shadow-orange-900/20'
                      : 'bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#333]',
                  )}
                >
                  {isHighlight ? (
                    <>
                      <Zap className='w-5 h-5 fill-white' />
                      Get Started Now
                    </>
                  ) : (
                    'Select Plan'
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className='mt-20 text-center'>
          <p className='text-gray-500 dark:text-gray-400 text-sm'>
            Need a custom enterprise plan?{' '}
            <Link
              href='/account/support/new'
              className='text-orange-600 dark:text-orange-400 hover:underline font-medium'
            >
              Contact our artisan partnership team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
