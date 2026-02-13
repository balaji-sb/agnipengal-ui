'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';

import { useConfig } from '@/lib/context/ConfigContext';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const { config } = useConfig();
  const logoSrc = config?.logo || null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/admin-login', { email, password });
      
      if (res.data.success) {
        toast.success("Login Successful");
        // Use context login to update state and redirect
        // Backend returns: { success: true, user: {...}, admin_token: "..." }
        login(res.data.user, res.data.admin_token);
      } else {
        toast.error(res.data.error || "Login Failed");
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || 'An unexpected error occurred';
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden p-2">
             {logoSrc ? (
                 <Image src={logoSrc} alt="Admin Logo" width={120} height={100} className="object-contain w-full h-full" />
             ) : (
                 <Lock className="text-pink-600 w-8 h-8" />
             )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 mt-2">Secure access for administrators</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
              placeholder="admin@example.com"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
             <input 
               type="password" 
               required 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
               placeholder="••••••••"
             />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
