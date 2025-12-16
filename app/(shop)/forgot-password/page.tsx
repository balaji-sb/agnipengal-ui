'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
          setStatus('success');
          setMessage('Check your email for a password reset link.');
      }
    } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-pink-600 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Forgot password?</h2>
            <p className="mt-2 text-sm text-gray-600">
                No worries, we'll send you reset instructions.
            </p>
        </div>

        {status === 'success' ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                <p className="font-medium">{message}</p>
                <Link href="/login" className="mt-4 inline-flex items-center text-green-700 hover:text-green-800 font-medium">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Back to log in
                </Link>
            </div>
        ) : (
             <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        {message}
                    </div>
                )}
                
                <div>
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition disabled:opacity-70"
                >
                    {status === 'loading' ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Reset Link'}
                </button>
                
                <div className="text-center">
                    <Link href="/login" className="font-medium text-gray-600 hover:text-pink-500 transition flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                        Back to log in
                    </Link>
                </div>
            </form>
        )}
      </div>
    </div>
  );
}
