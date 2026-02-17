'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { BarChart, Package, ShoppingBag, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

// Component for Vendor Dashboard Protection and Layout
export default function VendorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState<any>(null);

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    sales: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Profile
      const profileRes = await api.get('/vendors/profile');
      if (profileRes.data.success) {
        setVendorProfile(profileRes.data.data);
      }

      // 2. Fetch Products Count
      const productsRes = await api.get('/products/vendor');
      const productsCount = productsRes.data.data.length;

      // 3. Fetch Orders Count & Sales
      const ordersRes = await api.get('/orders/vendor');
      const ordersData = ordersRes.data.data || [];
      const ordersCount = ordersData.length;
      const totalSales = ordersData.reduce(
        (sum: number, order: any) => sum + (order.totalAmount || 0),
        0,
      );

      setStats({
        products: productsCount,
        orders: ordersCount,
        sales: totalSales,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error('Session expired or invalid. Please login again.');
      // Cookies.remove('vendor_token'); // Backend handles 401
      router.push('/vendor/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.get('/vendors/logout');
    } catch (error) {
      console.error('Logout failed', error);
    }

    Cookies.remove('role');
    Cookies.remove('userName');
    // Cookies.remove('vendor_token'); // Can't remove HttpOnly, relying on backend
    router.push('/vendor/login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600'></div>
      </div>
    );
  }

  if (!vendorProfile) return null; // Should redirect

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Main Content */}
      <main className='flex-1 p-8'>
        <div className='mb-8 flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold text-gray-800'>Welcome, {vendorProfile.storeName}</h2>
            <p className='text-gray-500'>Here is what's happening with your store today.</p>
          </div>
          <div className='md:hidden'>
            {/* Mobile Menu Toggle could go here */}
            <button onClick={handleLogout} className='text-red-600 text-sm font-medium'>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-sm font-medium mb-1'>Total Sales</div>
            <div className='text-3xl font-bold text-gray-900'>₹{stats.sales.toFixed(2)}</div>
            <div className='text-xs text-green-500 mt-2'>Lifetime Sales</div>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-sm font-medium mb-1'>Total Orders</div>
            <div className='text-3xl font-bold text-gray-900'>{stats.orders}</div>
            <div className='text-xs text-gray-400 mt-2'>
              {stats.orders === 0 ? 'No orders yet' : 'Orders received'}
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-sm font-medium mb-1'>Products</div>
            <div className='text-3xl font-bold text-gray-900'>{stats.products}</div>
            <div className='text-xs text-violet-500 mt-2'>
              {stats.products === 0 ? 'Add your first product' : 'Active products'}
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <h3 className='text-lg font-bold text-gray-800 mb-4'>Recent Orders</h3>
          <div className='text-center py-12 text-gray-500'>
            <ShoppingBag className='w-12 h-12 mx-auto text-gray-300 mb-3' />
            <p>No orders to display yet.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
