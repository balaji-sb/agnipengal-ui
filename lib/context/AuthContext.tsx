
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
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
  login: (userData: any) => void;
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
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
            setUser(res.data.user);
        } else {
            setUser(null);
        }
    } catch (error) {
        setUser(null);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    router.push('/');
    router.refresh(); 
  };

  const register = (userData: User) => {
      setUser(userData);
      router.push('/');
      router.refresh();
  };

  const logout = async () => {
    try {
        await axios.post('/api/auth/logout');
        setUser(null);
        router.push('/login');
        router.refresh();
    } catch (error) {
        console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
