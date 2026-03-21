import React from 'react';
import type { Metadata } from 'next';
import api from '@/lib/api-server';
import { Check, Star, ArrowRight, Zap, Gift } from 'lucide-react';
import HeroSection from '@/components/shop/sections/HeroSection';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return {
    title: 'Partnership Program | Agnipengal – Join as a Seller',
    description:
      'Become a partner with Agnipengal and grow your business. Choose from flexible subscription plans and reach thousands of customers who support women-owned businesses.',
    keywords: [
      'Agnipengal partnership',
      'sell on Agnipengal',
      'women entrepreneur program India',
      'seller registration Agnipengal',
      'grow business women India',
      'marketplace for women artisans',
    ],
    openGraph: {
      title: 'Partnership Program | Agnipengal',
      description: 'Empowering women entrepreneurs with a premium marketplace and growth tools.',
      url: `${siteUrl}/partnership`,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@agnipengal',
      title: 'Partnership Program | Agnipengal',
      description: 'Join thousands of women entrepreneurs on Agnipengal.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/partnership`,
    },
  };
}

interface Plan {
  _id: string;
  name: string;
  durationInMonths: number;
  price: number;
  description: string;
  isActive: boolean;
  isFreeTrialPlan: boolean;
  trialPeriodDays: number;
}

async function getPlans() {
  try {
    const res = await api.get('/subscription-plans');
    const plans = res.data?.data || [];
    return [...plans].sort((a: Plan, b: Plan) => a.price - b.price);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

export default async function PartnershipPage() {
  const plans = await getPlans();
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return (
    <div className='min-h-screen bg-gray-50 font-sans'>
      {/* BreadcrumbList Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Partnership',
                item: `${siteUrl}/partnership`,
              },
            ],
          }),
        }}
      />

      <HeroSection />

      {/* Plans */}
      <div className='max-w-7xl mx-auto px-8 py-20'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-2'>
          Choose Your Partnership Plan
        </h2>
        <p className='text-center text-gray-500 mb-16'>
          Zero setup fees · Cancel anytime · Join our community of empowered women entrepreneurs
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center pt-8'>
          {plans.map((plan: Plan) => {
            const paidPlans = plans.filter((p: Plan) => !p.isFreeTrialPlan);
            const bestPlanId =
              paidPlans.length >= 3
                ? paidPlans[Math.floor(paidPlans.length / 2)]._id
                : paidPlans[paidPlans.length - 1]?._id;
            // const isHighlight = !plan.isFreeTrialPlan && plan._id === bestPlanId;
            const isHighlight = false;

            return (
              <div
                key={plan._id}
                className={`relative flex flex-col rounded-2xl overflow-visible transition-all duration-300 ${
                  isHighlight
                    ? 'bg-gradient-to-b from-orange-50 to-white border-2 border-orange-500 shadow-2xl shadow-orange-200 scale-105 z-10'
                    : plan.isFreeTrialPlan || plan.price === 0
                      ? 'bg-green-50 border-2 border-green-300 shadow-lg'
                      : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Top badge */}
                {isHighlight && (
                  <div className='absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg ring-4 ring-white whitespace-nowrap'>
                    <Star className='w-3.5 h-3.5 fill-white' /> Best Value
                  </div>
                )}
                {(plan.isFreeTrialPlan || plan.price === 0) && (
                  <div className='absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg ring-4 ring-white whitespace-nowrap'>
                    <Gift className='w-3.5 h-3.5' />{' '}
                    {plan.price === 0 && !plan.isFreeTrialPlan ? '1 Month Free' : 'Free Trial'}
                  </div>
                )}

                <div className='p-8 flex-grow'>
                  {/* Name */}
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      isHighlight
                        ? 'text-orange-600'
                        : plan.isFreeTrialPlan
                          ? 'text-green-700'
                          : 'text-gray-800'
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className='mb-5'>
                    {plan.isFreeTrialPlan || plan.price === 0 ? (
                      <>
                        <span className='text-4xl font-extrabold text-green-600'>Free</span>
                        <p className='text-sm text-gray-500 mt-1'>
                          {plan.isFreeTrialPlan
                            ? `${plan.trialPeriodDays} days trial`
                            : 'No renewal fees'}{' '}
                          · no credit card required
                        </p>
                      </>
                    ) : (
                      <div className='flex items-baseline gap-1'>
                        <span
                          className={`text-4xl font-extrabold ${
                            isHighlight ? 'text-orange-600' : 'text-gray-900'
                          }`}
                        >
                          ₹{plan.price}
                        </span>
                        <span className='text-gray-400 text-sm'>/ {plan.durationInMonths} Mo</span>
                      </div>
                    )}
                  </div>

                  {isHighlight && (
                    <p className='text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full inline-block mb-5'>
                      Most popular among sellers
                    </p>
                  )}

                  <p className='text-gray-600 text-sm mb-6'>{plan.description}</p>

                  {/* Features */}
                  <ul className='space-y-2.5'>
                    <li className='flex items-center text-sm text-gray-600 gap-2'>
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          isHighlight ? 'text-orange-500' : 'text-green-500'
                        }`}
                      />
                      Unlimited Products
                    </li>
                    <li className='flex items-center text-sm text-gray-600 gap-2'>
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          isHighlight ? 'text-orange-500' : 'text-green-500'
                        }`}
                      />
                      Vendor Dashboard
                    </li>
                    <li className='flex items-center text-sm text-gray-600 gap-2'>
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          isHighlight ? 'text-orange-500' : 'text-green-500'
                        }`}
                      />
                      Priority Support
                    </li>
                    {plan.durationInMonths >= 6 && (
                      <li className='flex items-center text-sm text-gray-600 gap-2'>
                        <Star className='w-4 h-4 shrink-0 text-yellow-500' />
                        Featured Listing
                      </li>
                    )}
                    {plan.durationInMonths > 6 && (
                      <li className='flex items-center text-sm text-gray-600 gap-2'>
                        <Star className='w-4 h-4 shrink-0 text-yellow-500' />
                        Agnipengal based website
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA link */}
                <div className='p-8 pt-0'>
                  <Link
                    href={`/partnership/register?planId=${plan._id}`}
                    className={`w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group ${
                      plan.isFreeTrialPlan
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : isHighlight
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-200'
                          : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
                    }`}
                  >
                    {plan.isFreeTrialPlan || plan.price === 0 ? (
                      <>
                        <Gift className='w-4 h-4' />
                        {plan.price === 0 ? 'Get Started for Free' : 'Start Free Trial'}
                      </>
                    ) : isHighlight ? (
                      <>
                        <Zap className='w-4 h-4 fill-white' />
                        Get Started
                      </>
                    ) : (
                      <>Select Plan</>
                    )}
                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <p className='text-gray-400 text-sm text-center mt-16'>
          Need a custom plan?{' '}
          <Link href='/account/support/new' className='text-orange-600 hover:underline font-medium'>
            Contact our partnership team →
          </Link>
        </p>
      </div>
    </div>
  );
}
