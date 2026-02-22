import React from 'react';
import { Check, ShieldCheck, Zap } from 'lucide-react';
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
    <div className='py-20 px-4 bg-[#FAF9F6] dark:bg-[#121212] relative overflow-hidden font-sans border-t border-gray-100 dark:border-gray-800'>
      {/* Subtle Background Pattern matching Hero */}
      <div
        className='absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]'
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <div className='container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16 max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 mb-6'>
            <ShieldCheck className='w-3.5 h-3.5 bg-orange-600 dark:text-orange-400' />
            <span className='text-sm font-medium text-orange-800 dark:text-orange-300 tracking-wide uppercase text-xs'>
              Partner Plans
            </span>
          </div>

          <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight'>
            Simple pricing for <br className='hidden sm:block' /> growing businesses
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 text-center'>
            Choose the perfect partnership plan to scale your artisan craft. Zero setup fees, cancel
            anytime.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto'>
          {sortedPlans.map((plan, index) => {
            // Highlight the middle plan or the most expensive one if only two
            const isHighlight =
              sortedPlans.length >= 3 ? index === 1 : index === sortedPlans.length - 1;

            return (
              <div
                key={plan._id}
                className={clsx(
                  'relative flex flex-col p-8 rounded-2xl bg-white dark:bg-[#1A1A1A] transition-all duration-300',
                  isHighlight
                    ? 'border-2 border-orange-500 shadow-xl shadow-orange-900/5 dark:shadow-orange-900/20 md:-mt-4 relative z-10'
                    : 'border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1',
                )}
              >
                {/* Highlight Badge */}
                {isHighlight && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md'>
                    <Zap className='w-3.5 h-3.5 fill-white' />
                    Recommended
                  </div>
                )}

                <div className='mb-6 border-b border-gray-100 dark:border-gray-800 pb-6'>
                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                    {plan.name}
                  </h3>
                  <div className='flex items-baseline gap-2 mt-4'>
                    <span className='text-4xl font-black text-gray-900 dark:text-white'>
                      ₹{plan.price}
                    </span>
                    <span className='text-sm font-medium text-gray-500'>
                      / {plan.durationInMonths} Month{plan.durationInMonths > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className='flex-grow'>
                  <p className='text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs'>
                    Plan Includes:
                  </p>
                  <ul className='space-y-4 mb-8'>
                    <li className='flex items-start gap-3'>
                      <div className='mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0'>
                        <Check className='w-3.5 h-3.5 text-green-600 dark:text-green-400' />
                      </div>
                      <span className='text-sm text-gray-700 dark:text-gray-300'>
                        List up to{' '}
                        <strong className='font-bold text-gray-900 dark:text-white'>
                          {plan.maxProducts}
                        </strong>{' '}
                        Products
                      </span>
                    </li>
                    {plan.features.map((feature, i) => (
                      <li key={i} className='flex items-start gap-3'>
                        <div className='mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0'>
                          <Check className='w-3.5 h-3.5 text-green-600 dark:text-green-400' />
                        </div>
                        <span className='text-sm text-gray-700 dark:text-gray-300'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href='/vendor/register'
                  className={clsx(
                    'w-full py-4 px-6 rounded-lg font-semibold text-center transition-all duration-200 flex items-center justify-center gap-2 border',
                    isHighlight
                      ? 'bg-orange-600 border-transparent text-white hover:bg-orange-700 shadow-md'
                      : 'bg-white dark:bg-[#1A1A1A] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800',
                  )}
                >
                  Get Started
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
