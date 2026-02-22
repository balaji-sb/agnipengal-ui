'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message || 'Email verified successfully!');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.error || 'Verification failed. The link may be invalid or expired.',
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4'>
      <div className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center'>
        {status === 'loading' && (
          <div className='flex flex-col items-center'>
            <Loader2 className='w-16 h-16 text-pink-600 animate-spin mb-4' />
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Verifying Email...</h2>
            <p className='text-gray-500'>Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className='flex flex-col items-center'>
            <CheckCircle className='w-16 h-16 text-green-500 mb-4' />
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Email Verified!</h2>
            <p className='text-gray-600 mb-6'>{message}</p>
            <Link
              href='/login'
              className='w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition'
            >
              Continue to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className='flex flex-col items-center'>
            <XCircle className='w-16 h-16 text-red-500 mb-4' />
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Verification Failed</h2>
            <p className='text-gray-600 mb-6'>{message}</p>
            <Link href='/login' className='text-pink-600 font-medium hover:underline'>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
