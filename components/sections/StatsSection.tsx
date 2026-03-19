'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Zap, Award } from 'lucide-react';
import api from '@/lib/api';
import { useTranslations } from 'next-intl';

interface Stats {
  orderCount: number;
  visitorCount: number;
  activeUsers: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('Homepage');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/config/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds for real-time feel
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      label: t('ordersPlaced'),
      value: stats?.orderCount || 0,
      icon: <ShoppingBag className='w-6 h-6 text-orange-600' />,
      suffix: '+',
    },
    {
      label: t('totalVisits'),
      value: stats?.visitorCount || 0,
      icon: <Users className='w-6 h-6 text-blue-600' />,
      suffix: '',
    },
    {
      label: t('liveVisitors'),
      value: stats?.activeUsers || 0,
      icon: <Zap className='w-6 h-6 text-yellow-500 animate-pulse' />,
      suffix: '',
    },
    {
      label: t('happyCustomers'),
      value: (stats?.orderCount || 0) + 150, // Simulated based on orders
      icon: <Award className='w-6 h-6 text-green-600' />,
      suffix: '+',
    },
  ];

  return (
    <section className='py-12 bg-white flex justify-center'>
      <div className='container mx-auto px-6 max-w-7xl'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8'>
          {statItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className='bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300'
            >
              <div className='mb-4 p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300'>
                {item.icon}
              </div>
              <div className='flex items-baseline justify-center gap-0.5 mb-1'>
                <span className='text-2xl md:text-3xl font-black text-gray-900 tracking-tight'>
                  {item.value}
                </span>
                <span className='text-xl font-bold text-orange-600'>{item.suffix}</span>
              </div>
              <p className='text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest'>
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
