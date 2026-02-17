'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useConfig } from '@/lib/context/ConfigContext';
import { LogIn } from 'lucide-react';

export default function VendorLoginPage() {
  const { config } = useConfig();
  const logoSrc = config?.logo || null;
  const appName = config?.appName || 'Agni Pengal';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // We might need to adjust AuthContext if it hardcodes /auth/login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct call to vendor login API
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/vendors/login`,
        { email, password },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success('Login successful');
        const { token, user } = res.data;

        // Manually setting cookies/state if AuthContext doesn't support custom endpoints easily
        // But optimally AuthContext should be flexible.
        // For now, let's assume we can manually set cookies and redirect,
        // OR use the login function if it accepts a role or endpoint.

        // Let's set cookies manually as per other parts of the app
        // Cookies.set('vendor_token', token, { expires: 30 }); // Using HttpOnly from backend
        Cookies.set('role', 'vendor', { expires: 30 });
        Cookies.set('userName', user.name, { expires: 30 });

        // Force reload or state update?
        // Ideally we should use the context.
        // If AuthContext reads from cookies on mount, a hard reload or router.refresh might work.
        // Let's try router.push first.

        window.location.href = '/vendor/dashboard'; // Force reload to update context
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen grid grid-cols-1 md:grid-cols-2'>
      {/* Left Side - Image/Branding */}
      <div className='hidden md:flex flex-col justify-center items-center bg-violet-900 text-white p-12 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-violet-900 to-pink-900 opacity-90'></div>
        <div className='relative z-10 text-center'>
          <div className='mx-auto h-64 w-64 flex items-center justify-center '>
            {logoSrc ? (
              <Image
                src={config?.logo || '/logo.jpg'}
                alt={`${appName} Logo`}
                width={240}
                height={280}
                className='object-contain p-1 rounded-xl'
              />
            ) : (
              <LogIn className='h-8 w-8 text-white' />
            )}
          </div>
          <h1 className='text-5xl font-extrabold mb-6'>Agin Pengal Vendor Portal</h1>
          <p className='text-xl text-violet-100 mb-8'>
            Manage your store, track orders, and grow your business.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className='flex flex-col justify-center items-center p-8 bg-gray-50'>
        <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-xl'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900'>Welcome Back</h2>
            <p className='text-gray-500 mt-2'>Sign in to your vendor account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email Address</label>
              <input
                type='email'
                required
                className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500 transition'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Password</label>
              <input
                type='password'
                required
                className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500 transition'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className={`w-full py-3 px-4 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-700 active:scale-95'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className='mt-8 text-center text-sm'>
            <p className='text-gray-600'>
              Don't have a vendor account?{' '}
              <Link href='/partnership' className='font-bold text-violet-600 hover:text-violet-500'>
                Become a Partner
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
