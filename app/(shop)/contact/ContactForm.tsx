'use client';

import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  User,
  Mail,
  PhoneCall,
  Tag,
  Loader2,
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
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
        toast.success(res.data.message || 'Message sent successfully!');
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
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100'>
      <div className='mb-10'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>Send us a Message</h2>
        <p className='text-gray-500'>We usually respond within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
              <User className='w-4 h-4' /> Full Name
            </label>
            <input
              required
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Auroshi Sen'
              className='w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
              <Mail className='w-4 h-4' /> Email Address
            </label>
            <input
              required
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='hello@example.com'
              className='w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
              <PhoneCall className='w-4 h-4' /> Mobile Number
            </label>
            <input
              required
              type='tel'
              name='mobile'
              value={formData.mobile}
              onChange={handleChange}
              placeholder='+91 XXXXX XXXXX'
              className='w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
              <Tag className='w-4 h-4' /> Subject
            </label>
            <input
              required
              type='text'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              placeholder='How can we help?'
              className='w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none transition-all'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-bold text-gray-700 flex items-center gap-2'>
            <MessageSquare className='w-4 h-4' /> Message
          </label>
          <textarea
            required
            name='message'
            value={formData.message}
            onChange={handleChange}
            rows={6}
            placeholder='Tell us more about your inquiry...'
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
                Sending...
              </>
            ) : (
              <>
                <Send className='w-5 h-5' />
                Send Message
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
