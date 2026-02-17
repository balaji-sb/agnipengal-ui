'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Check, Star, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';

interface Plan {
  _id: string;
  name: string;
  durationInMonths: number;
  price: number;
  description: string;
  isActive: boolean;
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
      setPlans(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 font-sans'>
      {/* Hero Section */}
      <div className='bg-violet-900 text-white py-20 px-8 text-center relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-violet-900 to-pink-800 opacity-90'></div>
        <div className='relative z-10 max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-extrabold mb-6 tracking-tight'>
            Grow Your Business with <span className='text-pink-400'>Agni Pengal</span>
          </h1>
          <p className='text-xl md:text-2xl text-violet-100 mb-8 max-w-2xl mx-auto'>
            Join thousands of vendors reaching new customers every day. Simple subscription,
            powerful tools, endless growth.
          </p>
        </div>
      </div>

      {/* Plans Section */}
      <div className='max-w-7xl mx-auto px-8 py-20'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-12'>
          Choose Your Subscription Plan
        </h2>

        {loading ? (
          <div className='text-center text-gray-500 text-xl'>Loading plans...</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {plans.map((plan) => (
              <div
                key={plan._id}
                className='bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col relative'
              >
                {plan.durationInMonths === 12 && (
                  <div className='absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10'>
                    BEST VALUE
                  </div>
                )}
                <div className='p-8 flex-grow'>
                  <h3 className='text-2xl font-bold text-gray-800 mb-2'>{plan.name}</h3>
                  <div className='flex items-baseline mb-6'>
                    <span className='text-4xl font-extrabold text-pink-600'>₹{plan.price}</span>
                    <span className='text-gray-500 ml-2'>/ {plan.durationInMonths} Mo</span>
                  </div>
                  <p className='text-gray-600 mb-8'>{plan.description}</p>

                  <ul className='space-y-3 mb-8'>
                    <li className='flex items-center text-gray-600'>
                      <Check className='w-5 h-5 text-green-500 mr-2' /> Unlimited Products
                    </li>
                    <li className='flex items-center text-gray-600'>
                      <Check className='w-5 h-5 text-green-500 mr-2' /> Vendor Dashboard
                    </li>
                    <li className='flex items-center text-gray-600'>
                      <Check className='w-5 h-5 text-green-500 mr-2' /> Priority Support
                    </li>
                    {plan.durationInMonths >= 6 && (
                      <li className='flex items-center text-gray-600'>
                        <Star className='w-5 h-5 text-yellow-500 mr-2' /> Featured Listing
                      </li>
                    )}
                  </ul>
                </div>
                <div className='p-8 pt-0 mt-auto'>
                  <button
                    onClick={() => router.push(`/partnership/register?planId=${plan._id}`)}
                    className='w-full bg-violet-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-violet-800 transition-colors flex items-center justify-center group'
                  >
                    Get Started{' '}
                    <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ / Info Section could go here */}
    </div>
  );
}
