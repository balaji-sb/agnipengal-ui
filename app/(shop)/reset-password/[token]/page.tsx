'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setStatus('error');
        setMessage('Passwords do not match');
        return;
    }
    
    setStatus('loading');
    setMessage('');

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      if (res.data.success) {
          setStatus('success');
          setMessage('Password reset successful. Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">
                Enter your new password below.
            </p>
        </div>

        {status === 'success' ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center flex flex-col items-center">
                <CheckCircle className="w-12 h-12 mb-4" />
                <p className="font-medium text-lg">Password Reset Successfully!</p>
                <p className="text-sm mt-2">Redirecting you to login page...</p>
            </div>
        ) : (
             <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {message}
                    </div>
                )}
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            placeholder="To protect your account"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition disabled:opacity-70"
                >
                    {status === 'loading' ? <Loader2 className="animate-spin w-5 h-5" /> : 'Reset Password'}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}
