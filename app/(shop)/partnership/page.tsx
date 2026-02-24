'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Check, Star, ArrowRight, Zap, Gift } from 'lucide-react';

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

export default function PartnershipPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription-plans`);
      const sorted = [...(response.data.data || [])].sort((a: Plan, b: Plan) => a.price - b.price);
      setPlans(sorted);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 font-sans'>
      {/* Hero — site theme orange/red */}
      <div className='bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 px-8 text-center relative overflow-hidden'>
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className='relative z-10 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-extrabold mb-6 tracking-tight'>
            Grow Your Business with <span className='text-yellow-300'>Agni Pengal</span>
          </h1>
          <p className='text-xl md:text-2xl text-orange-100 mb-8 max-w-2xl mx-auto'>
            Join women entrepreneurs reaching new customers every day. Simple subscription, powerful
            tools, endless growth.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className='max-w-7xl mx-auto px-8 py-20'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-2'>
          Choose Your Partnership Plan
        </h2>
        <p className='text-center text-gray-500 mb-16'>
          Zero setup fees · Cancel anytime · Join our community of empowered women entrepreneurs
        </p>

        {loading ? (
          <div className='text-center text-gray-400 text-xl py-20'>Loading plans...</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center pt-8'>
            {plans.map((plan, index) => {
              const paidPlans = plans.filter((p) => !p.isFreeTrialPlan);
              const bestPlanId =
                paidPlans.length >= 3
                  ? paidPlans[Math.floor(paidPlans.length / 2)]._id
                  : paidPlans[paidPlans.length - 1]?._id;
              const isHighlight = !plan.isFreeTrialPlan && plan._id === bestPlanId;

              return (
                <div
                  key={plan._id}
                  className={`relative flex flex-col rounded-2xl overflow-visible transition-all duration-300 ${
                    isHighlight
                      ? 'bg-gradient-to-b from-orange-50 to-white border-2 border-orange-500 shadow-2xl shadow-orange-200 scale-105 z-10'
                      : plan.isFreeTrialPlan
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
                  {plan.isFreeTrialPlan && (
                    <div className='absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg ring-4 ring-white whitespace-nowrap'>
                      <Gift className='w-3.5 h-3.5' /> Free Trial
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
                      {plan.isFreeTrialPlan ? (
                        <>
                          <span className='text-4xl font-extrabold text-green-600'>Free</span>
                          <p className='text-sm text-gray-500 mt-1'>
                            {plan.trialPeriodDays} days · no credit card required
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
                          <span className='text-gray-400 text-sm'>
                            / {plan.durationInMonths} Mo
                          </span>
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
                    </ul>
                  </div>

                  {/* CTA button */}
                  <div className='p-8 pt-0'>
                    <button
                      onClick={() => router.push(`/partnership/register?planId=${plan._id}`)}
                      className={`w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group ${
                        plan.isFreeTrialPlan
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : isHighlight
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-200'
                            : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {plan.isFreeTrialPlan ? (
                        <>
                          <Gift className='w-4 h-4' />
                          Start Free Trial
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
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className='text-gray-400 text-sm text-center mt-16'>
          Need a custom plan?{' '}
          <a href='/account/support/new' className='text-orange-600 hover:underline font-medium'>
            Contact our partnership team →
          </a>
        </p>
      </div>
    </div>
  );
}
