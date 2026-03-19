'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  User,
  Tag,
  PhoneCall,
  Loader2,
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations('Contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/contacts', formData);
      if (res.data.success) {
        toast.success(res.data.message || t('successMessage'));
        setFormData({
          name: '',
          email: '',
          mobile: '',
          subject: '',
          message: '',
        });
      }
    } catch (error: any) {
      console.error('Contact error:', error);
      toast.error(error.response?.data?.message || t('errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen pb-20'>
      {/* Hero Section */}
      <div className='bg-white border-b border-gray-100'>
        <div className='container mx-auto px-4 py-20 text-center relative overflow-hidden'>
          <div className='absolute top-0 left-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 animate-blob' />
          <div className='absolute bottom-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000' />

          <h1 className='text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight relative z-10'>
            {t('title1')}{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600'>
              {t('title2')}
            </span>
          </h1>
          <p className='text-gray-500 text-lg md:text-xl max-w-2xl mx-auto relative z-10'>
            {t('description')}
          </p>
        </div>
      </div>

      <div className='container mx-auto px-4 -mt-10 overflow-x-hidden'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Contact Info Cards */}
          <div className='lg:col-span-4 space-y-6'>
            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1'>
              <div className='w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-6'>
                <Mail className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>{t('emailUs')}</h3>
              <p className='text-gray-500 mb-4'>{t('emailUsText')}</p>
              <a
                href='mailto:agnipengal16@gmail.com'
                className='text-pink-600 font-bold hover:underline'
              >
                agnipengal16@gmail.com
              </a>
            </div>

            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1'>
              <div className='w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6'>
                <Phone className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>{t('callUs')}</h3>
              <p className='text-gray-500 mb-4'>{t('callUsText')}</p>
              <a href='tel:+918088663116' className='text-orange-600 font-bold hover:underline'>
                +91 8088663116
              </a>
            </div>

            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1'>
              <div className='w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6'>
                <MapPin className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>{t('office')}</h3>
              <p className='text-gray-500 mb-4'>{t('officeText')}</p>
              <p className='text-gray-900 font-medium'>
                {t('address1')}
                <br />
                {t('address2')}
              </p>
            </div>

            {/* Social Media Links */}
            <div className='bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl text-white'>
              <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                <Send className='w-5 h-5 text-pink-500' />
                {t('followUs')}
              </h3>
              <div className='grid grid-cols-3 gap-4'>
                <a
                  href='https://www.instagram.com/agnipengal/'
                  target='_blank'
                  className='flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-pink-600/20 transition-all border border-white/10'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-pink-500'
                  >
                    <rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
                    <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                    <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
                  </svg>
                  <span className='text-[10px] uppercase tracking-wider font-bold opacity-60'>
                    Insta
                  </span>
                </a>
                <a
                  href='https://www.facebook.com/agnipengal'
                  target='_blank'
                  className='flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-blue-600/20 transition-all border border-white/10'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-blue-500'
                  >
                    <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
                  </svg>
                  <span className='text-[10px] uppercase tracking-wider font-bold opacity-60'>
                    FB
                  </span>
                </a>
                <a
                  href='https://www.youtube.com/@agnipengaldotcom'
                  target='_blank'
                  className='flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-red-600/20 transition-all border border-white/10'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-red-500'
                  >
                    <path d='M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17' />
                    <path d='m10 15 5-3-5-3z' />
                  </svg>
                  <span className='text-[10px] uppercase tracking-wider font-bold opacity-60'>
                    YT
                  </span>
                </a>
                <a
                  href='https://x.com/agnipengal'
                  target='_blank'
                  className='flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-gray-600/20 transition-all border border-white/10'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='text-white'
                  >
                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.63 5.907-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                  </svg>
                  <span className='text-[10px] uppercase tracking-wider font-bold opacity-60'>
                    X
                  </span>
                </a>
                <a
                  href='https://www.pinterest.com/agnipengaldotcom/'
                  target='_blank'
                  className='flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-red-700/20 transition-all border border-white/10'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='text-red-600'
                  >
                    <path d='M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z' />
                  </svg>
                  <span className='text-[10px] uppercase tracking-wider font-bold opacity-60'>
                    Pinterest
                  </span>
                </a>
                <a
                  href='https://www.reddit.com/user/Aggravating_Award787/'
                  target='_blank'
                  className='flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-orange-500/20 transition-all border border-white/10'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='text-orange-500'
                  >
                    <path d='M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z' />
                  </svg>
                  <span className='text-[10px] uppercase tracking-wider font-bold opacity-60'>
                    Reddit
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:col-span-8'>
            <div className='bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100'>
              <div className='mb-10'>
                <h2 className='text-3xl font-bold text-gray-900 mb-2'>{t('sendMessageTitle')}</h2>
                <p className='text-gray-500'>{t('sendMessageDesc')}</p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
                      <User className='w-4 h-4' /> {t('fullName')}
                    </label>
                    <input
                      required
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('fullNamePlaceholder')}
                      className='w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
                      <Mail className='w-4 h-4' /> {t('emailAddress')}
                    </label>
                    <input
                      required
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('emailPlaceholder')}
                      className='w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
                      <PhoneCall className='w-4 h-4' /> {t('mobileNumber')}
                    </label>
                    <input
                      required
                      type='tel'
                      name='mobile'
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder={t('mobilePlaceholder')}
                      className='w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
                      <Tag className='w-4 h-4' /> {t('subject')}
                    </label>
                    <input
                      required
                      type='text'
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('subjectPlaceholder')}
                      className='w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
                    <MessageSquare className='w-4 h-4' /> {t('message')}
                  </label>
                  <textarea
                    required
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder={t('messagePlaceholder')}
                    className='w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all resize-none'
                  />
                </div>

                <div className='pt-4'>
                  <button
                    disabled={loading}
                    type='submit'
                    className='w-full md:w-auto px-12 py-4 bg-gradient-to-r from-pink-600 to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none'
                  >
                    {loading ? (
                      <>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        {t('sending')}
                      </>
                    ) : (
                      <>
                        <Send className='w-5 h-5' />
                        {t('sendMessageBtn')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
