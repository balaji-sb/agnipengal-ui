'use client';

import React from 'react';
import Link from 'next/link';
import {
  Gift,
  Users,
  Clock,
  ArrowRight,
  Share2,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReferAndEarn() {
  const steps = [
    {
      icon: <Share2 className='w-8 h-8 text-pink-500' />,
      title: '1. Share Your Code',
      description:
        'Find your unique referral code in your Partner Dashboard and share it with your network.',
    },
    {
      icon: <Users className='w-8 h-8 text-violet-500' />,
      title: '2. Friend Registers',
      description:
        'When they sign up for a Partner subscription, they enter your code at checkout.',
    },
    {
      icon: <Gift className='w-8 h-8 text-orange-500' />,
      title: '3. Both Earn Rewards',
      description: 'You both get bonus subscription days added automatically to your accounts!',
    },
  ];

  const rewards = [
    {
      plan: '1-Month Plan',
      referrer: '10 Bonus Days',
      referee: '5 Bonus Days',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      plan: '6-Month Plan',
      referrer: '20 Bonus Days',
      referee: '10 Bonus Days',
      color: 'from-violet-400 to-fuchsia-500',
    },
    {
      plan: '1-Year Plan',
      referrer: '30 Bonus Days (1 Month)',
      referee: '15 Bonus Days',
      color: 'from-orange-400 to-pink-500',
      popular: true,
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 font-sans pb-20'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-900 text-white py-24 px-6'>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className='absolute -top-24 -right-24 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob'></div>
        <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000'></div>

        <div className='container mx-auto max-w-5xl relative z-10 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 text-pink-200 text-sm font-semibold tracking-wide uppercase'>
              <Sparkles className='w-4 h-4' /> Partner Rewards Program
            </div>
            <h1 className='text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight'>
              Grow Together, <br className='hidden md:block' />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400'>
                Earn Together.
              </span>
            </h1>
            <p className='text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed'>
              Invite other businesses to join our vibrant marketplace. When they subscribe using
              your referral code, both of you get free bonus days added to your subscription!
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link
                href='/partnership/register'
                className='w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center'
              >
                Become a Partner <ArrowRight className='w-5 h-5 ml-2' />
              </Link>
              <Link
                href='/vendor/login'
                className='w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center'
              >
                Get Your Code
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 px-6 container mx-auto max-w-6xl'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>How It Works</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Three simple steps to start earning free subscription extensions for your business.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className='bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-center border border-gray-100 relative'
            >
              <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center shadow-sm'>
                {step.icon}
              </div>
              <h3 className='text-xl font-bold text-gray-900 mt-8 mb-3'>{step.title}</h3>
              <p className='text-gray-600 leading-relaxed'>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rewards Structure */}
      <section className='py-20 px-6 bg-white border-y border-gray-100'>
        <div className='container mx-auto max-w-5xl'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3'>
              <Award className='w-8 h-8 text-violet-600' /> Reward Structure
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              The longer the subscription plan your friend chooses, the bigger the reward for both
              of you! There is no limit to how many businesses you can refer.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            {rewards.map((reward, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`relative rounded-2xl overflow-hidden border ${reward.popular ? 'border-pink-300 shadow-xl shadow-pink-100' : 'border-gray-200 shadow-sm'}`}
              >
                {reward.popular && (
                  <div className='absolute top-0 inset-x-0 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[10px] font-bold py-1.5 text-center uppercase tracking-wider'>
                    Most Rewarding
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${reward.color}`}></div>
                <div className={`p-6 ${reward.popular ? 'pt-10' : ''}`}>
                  <h3 className='text-xl font-bold text-gray-900 mb-6 text-center'>
                    {reward.plan}
                  </h3>

                  <div className='space-y-4'>
                    <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
                      <p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
                        Referrer Gets
                      </p>
                      <p className='text-lg font-bold text-violet-700 flex items-center gap-2'>
                        <CheckCircle2 className='w-5 h-5 text-violet-500' /> +{reward.referrer}
                      </p>
                    </div>

                    <div className='bg-pink-50 rounded-xl p-4 border border-pink-100'>
                      <p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
                        New Partner Gets
                      </p>
                      <p className='text-lg font-bold text-pink-700 flex items-center gap-2'>
                        <CheckCircle2 className='w-5 h-5 text-pink-500' /> +{reward.referee}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-24 px-6 text-center'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Ready to expand your business?</h2>
        <p className='text-gray-600 mb-10 max-w-md mx-auto'>
          Join our platform today, grab your referral code, and start growing your network while
          earning free subscription days.
        </p>
        <Link
          href='/partnership/register'
          className='inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg'
        >
          Register as Partner
        </Link>
      </section>
    </div>
  );
}
