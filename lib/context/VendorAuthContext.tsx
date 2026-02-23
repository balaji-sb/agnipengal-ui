'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'vendor';
}

interface VendorProfile {
  _id: string;
  user: User;
  storeName: string;
  status: 'pending' | 'active' | 'suspended';
  shippingCharge?: number;
  [key: string]: any;
}

interface VendorAuthContextType {
  vendor: VendorProfile | null;
  user: User | null;
  loading: boolean;
  login: (vendorData: any, token?: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const VendorAuthContext = createContext<VendorAuthContextType>({
  vendor: null,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  checkAuth: () => {},
});

export const VendorAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      // Vendors use HttpOnly cookies (vendor_token), but we call /profile to get details
      const res = await api.get('/vendors/profile');
      if (res.data.success) {
        setVendor(res.data.data);
        setUser(res.data.data.user);
      } else {
        setVendor(null);
        setUser(null);
      }
    } catch (error) {
      setVendor(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (vendorData: any, token?: string) => {
    // Note: loginVendor API returns { success, user, token }
    // where user object contains storeName
    if (vendorData) {
      // We set basic user info, then checkAuth will pull the full vendor profile
      setUser(vendorData);
      Cookies.set('role', 'vendor', { expires: 30 });
      Cookies.set('userName', vendorData.name, { expires: 30 });
      checkAuth();
    }
    router.push('/vendor/dashboard');
    router.refresh();
  };

  const logout = async () => {
    try {
      await api.get('/vendors/logout');
      setVendor(null);
      setUser(null);
      Cookies.remove('role');
      Cookies.remove('userName');
      router.push('/vendor/login');
      router.refresh();
    } catch (error) {
      console.error('Vendor logout failed', error);
      setVendor(null);
      setUser(null);
      Cookies.remove('role');
      Cookies.remove('userName');
      router.push('/vendor/login');
    }
  };

  return (
    <VendorAuthContext.Provider value={{ vendor, user, loading, login, logout, checkAuth }}>
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => useContext(VendorAuthContext);
