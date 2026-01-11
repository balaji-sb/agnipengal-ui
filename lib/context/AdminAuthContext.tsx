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
            console.log('AdminAuthContext: checkAuth success', res.data.user);
            setAdmin(res.data.user);
        } else {
            console.log('AdminAuthContext: checkAuth failed (success=false)');
            setAdmin(null);
            localStorage.removeItem('adminToken'); 
        }
    } catch (error) {
        console.error('AdminAuthContext: checkAuth error', error);
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
    console.log('AdminAuthContext: login called', userData);
    setAdmin(userData);
    if (token) {
        localStorage.setItem('adminToken', token);
    }
    console.log('AdminAuthContext: Redirecting to /mahisadminpanel');
    router.push('/mahisadminpanel');
  };

  const logout = async () => {
    try {
        await api.post('/auth/admin/logout');
        setAdmin(null);
        localStorage.removeItem('adminToken');
        router.push('/mahisadminpanel/login');
        router.refresh();
    } catch (error) {
        await api.post('/auth/admin/logout');
        setAdmin(null);
        localStorage.removeItem('adminToken');
        router.push('/mahisadminpanel/login');
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
