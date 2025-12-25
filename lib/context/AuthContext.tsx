
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: any, token?: string) => void;
  register: (userData: any) => void; // Or just rely on component to call api and then reload
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => {},
    register: () => {},
    logout: () => {},
    checkAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
            setUser(res.data.user);
        } else {
            setUser(null);
            localStorage.removeItem('authToken');
        }
    } catch (error) {
        setUser(null);
        localStorage.removeItem('authToken');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User, token?: string) => {
    setUser(userData);
    if (token) {
        localStorage.setItem('authToken', token);
    }
    router.push('/');
    router.refresh(); 
  };

  const register = (userData: User) => {
      // Registration doesn't return token usually (verification needed)
      setUser(userData);
      router.push('/');
      router.refresh();
  };

  const logout = async () => {
    try {
        await api.post('/auth/logout');
        setUser(null);
        localStorage.removeItem('authToken');
        router.push('/login');
        router.refresh();
    } catch (error) {
        console.error('Logout failed', error);
        // Force logout locally even if API fails
        setUser(null);
        localStorage.removeItem('authToken');
        router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
