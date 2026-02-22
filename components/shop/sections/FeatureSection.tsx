'use client';

import React from 'react';
import { Heart, ShieldCheck, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Heart className='w-8 h-8 text-rose-500' />,
    title: 'Handcrafted by Women',
    description:
      'Every product tells a story of passion, skill, and dedication from talented women artisans.',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    icon: <Gem className='w-8 h-8 text-amber-500' />,
    title: 'Premium Quality',
    description:
      'We source only the finest materials to ensure our handcrafted items stand the test of time.',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: <ShieldCheck className='w-8 h-8 text-emerald-500' />,
    title: 'Authentic & Ethical',
    description:
      'Directly supporting independent makers with fair compensation and sustainable practices.',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
];

export default function FeatureSection() {
  return (
    <section className='py-12 bg-white relative z-10 border-b border-gray-100'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`p-8 rounded-3xl ${feature.bg} ${feature.border} border border-transparent hover:border-solid transition-colors duration-300`}
            >
              <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6'>
                {feature.icon}
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>{feature.title}</h3>
              <p className='text-gray-600 leading-relaxed'>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
