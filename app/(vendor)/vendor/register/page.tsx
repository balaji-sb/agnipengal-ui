'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Store, User, Mail, Lock, Phone, FileText } from 'lucide-react';

export default function VendorRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
    storeDescription: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vendors/register`,
        formData,
      );
      if (response.data.success) {
        toast.success('Registration successful! Please wait for admin approval.');
        router.push('/vendor/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center'>
            <Store className='h-6 w-6 text-pink-600' />
          </div>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>Become a Vendor</h2>
          <p className='mt-2 text-sm text-gray-600'>Start selling your products on Agni Pengal</p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div className='relative'>
              <User className='absolute top-3 left-3 h-5 w-5 text-gray-400' />
              <input
                name='name'
                type='text'
                required
                className='appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm'
                placeholder='Full Name'
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className='relative'>
              <Mail className='absolute top-3 left-3 h-5 w-5 text-gray-400' />
              <input
                name='email'
                type='email'
                required
                className='appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm'
                placeholder='Email address'
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className='relative'>
              <Lock className='absolute top-3 left-3 h-5 w-5 text-gray-400' />
              <input
                name='password'
                type='password'
                required
                className='appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className='relative'>
              <Store className='absolute top-3 left-3 h-5 w-5 text-gray-400' />
              <input
                name='storeName'
                type='text'
                required
                className='appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm'
                placeholder='Store Name'
                value={formData.storeName}
                onChange={handleChange}
              />
            </div>
            <div className='relative'>
              <Phone className='absolute top-3 left-3 h-5 w-5 text-gray-400' />
              <input
                name='phone'
                type='text'
                required
                className='appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm'
                placeholder='Phone Number'
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className='relative'>
              <FileText className='absolute top-3 left-3 h-5 w-5 text-gray-400' />
              <textarea
                name='storeDescription'
                rows={3}
                className='appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm'
                placeholder='Store Description (Optional)'
                value={formData.storeDescription}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 transition-colors'
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <div className='text-center text-sm'>
            Already have an account?{' '}
            <Link href='/vendor/login' className='font-medium text-pink-600 hover:text-pink-500'>
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
