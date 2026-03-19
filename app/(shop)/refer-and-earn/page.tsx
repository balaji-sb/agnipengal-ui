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
import { useTranslations } from 'next-intl';

export default function ReferAndEarn() {
  const t = useTranslations('ReferAndEarn');
  
  const steps = [
    {
      icon: <Share2 className='w-8 h-8 text-pink-500' />,
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      icon: <Users className='w-8 h-8 text-violet-500' />,
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      icon: <Gift className='w-8 h-8 text-orange-500' />,
      title: t('step3Title'),
      description: t('step3Desc'),
    },
  ];

  const rewards = [
    {
      plan: t('plan1Month'),
      referrer: t('bonusDays10'),
      referee: t('bonusDays5'),
      color: 'from-blue-400 to-indigo-500',
    },
    {
      plan: t('plan6Month'),
      referrer: t('bonusDays20'),
      referee: t('bonusDays10'),
      color: 'from-violet-400 to-fuchsia-500',
    },
    {
      plan: t('plan1Year'),
      referrer: t('bonusDays30'),
      referee: t('bonusDays15'),
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
              <Sparkles className='w-4 h-4' /> {t('badge')}
            </div>
            <h1 className='text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight'>
              {t('titleLine1')} <br className='hidden md:block' />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400'>
                {t('titleLine2')}
              </span>
            </h1>
            <p className='text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed'>
              {t('subtitle')}
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link
                href='/partnership/register'
                className='w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center'
              >
                {t('btnBecomePartner')} <ArrowRight className='w-5 h-5 ml-2' />
              </Link>
              <Link
                href='/vendor/login'
                className='w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center'
              >
                {t('btnGetCode')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 px-6 container mx-auto max-w-6xl'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>{t('howItWorksTitle')}</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            {t('howItWorksSubtitle')}
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
              <Award className='w-8 h-8 text-violet-600' /> {t('rewardStructureTitle')}
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              {t('rewardStructureSubtitle')}
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
                    {t('mostRewarding')}
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
                        {t('referrerGets')}
                      </p>
                      <p className='text-lg font-bold text-violet-700 flex items-center gap-2'>
                        <CheckCircle2 className='w-5 h-5 text-violet-500' /> +{reward.referrer}
                      </p>
                    </div>

                    <div className='bg-pink-50 rounded-xl p-4 border border-pink-100'>
                      <p className='text-xs text-gray-500 uppercase font-semibold mb-1'>
                        {t('newPartnerGets')}
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
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>{t('ctaTitle')}</h2>
        <p className='text-gray-600 mb-10 max-w-md mx-auto'>
          {t('ctaSubtitle')}
        </p>
        <Link
          href='/partnership/register'
          className='inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg'
        >
          {t('btnRegister')}
        </Link>
      </section>
    </div>
  );
}
