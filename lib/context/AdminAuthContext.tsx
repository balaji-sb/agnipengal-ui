'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
}

interface AdminAuthContextType {
  admin: User | null;
  loading: boolean;
  login: (userData: any, token?: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
    admin: null,
    loading: true,
    login: () => {},
    logout: () => {},
    checkAuth: () => {},
});

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
        const res = await api.get('/auth/admin/me');
        if (res.data.success) {
            setAdmin(res.data.user);
        } else {
            setAdmin(null);
            localStorage.removeItem('adminToken');
        }
    } catch (error) {
        setAdmin(null);
        localStorage.removeItem('adminToken');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User, token?: string) => {
    setAdmin(userData);
    if (token) {
        localStorage.setItem('adminToken', token);
    }
    router.push('/portal-secure-admin');
    router.refresh(); 
  };

  const logout = async () => {
    try {
        await api.post('/auth/admin/logout');
        setAdmin(null);
        localStorage.removeItem('adminToken');
        router.push('/portal-secure-admin/login');
        router.refresh();
    } catch (error) {
        console.error('Logout failed', error);
        setAdmin(null);
        localStorage.removeItem('adminToken');
        router.push('/portal-secure-admin/login');
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
