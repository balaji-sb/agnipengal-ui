'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
}

interface AdminAuthContextType {
  admin: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
    admin: null,
    loading: true,
    login: () => {},
    logout: () => {},
    checkAuth: async () => {},
});

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
        const token = localStorage.getItem('adminToken');
        // Also check cookie for middleware consistency
        const cookieToken = Cookies.get('admin_auth_token');

        if (!token && !cookieToken) {
            setAdmin(null);
            setLoading(false);
            return;
        }

        const res = await api.get('/auth/admin/me');
        if (res.data.success) {
            setAdmin(res.data.user);
        } else {
            setAdmin(null);
            cleanupAuth();
        }
    } catch (error) {
        setAdmin(null);
        cleanupAuth();
    } finally {
        setLoading(false);
    }
  };

  const cleanupAuth = () => {
      localStorage.removeItem('adminToken');
      Cookies.remove('admin_auth_token');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setAdmin(userData);
    localStorage.setItem('adminToken', token);
    Cookies.set('admin_auth_token', token, { expires: 1 }); // 1 day
    router.push('/mahisadminpanel');
    router.refresh(); 
  };

  const logout = async () => {
    try {
        await api.post('/auth/admin/logout');
    } catch (error) {
        console.error('Logout failed', error);
    } finally {
        setAdmin(null);
        cleanupAuth();
        router.push('/mahisadminpanel/login');
        router.refresh();
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
