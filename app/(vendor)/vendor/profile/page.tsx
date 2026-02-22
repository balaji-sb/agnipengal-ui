'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Save, LogOut, Store, Mail, Phone, MapPin, Tag } from 'lucide-react';
import Cookies from 'js-cookie';

interface VendorProfile {
  _id: string;
  storeName: string;
  storeDescription: string;
  phone: string;
  status: string;
  category: string | { _id: string; name: string };
  user: {
    name: string;
    email: string;
  };
  subscription?: {
    plan: {
      name: string;
      price: number;
    };
    status: string;
    endDate: string;
  };
}

interface VendorCategory {
  _id: string;
  name: string;
}

export default function VendorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [categories, setCategories] = useState<VendorCategory[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    phone: '',
    category: '',
    name: '', // User name
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, categoriesRes] = await Promise.all([
        api.get('/vendors/profile'),
        api.get('/vendor-categories'),
      ]);

      if (profileRes.data.success) {
        const data = profileRes.data.data;
        setProfile(data);
        setFormData({
          storeName: data.storeName || '',
          storeDescription: data.storeDescription || '',
          phone: data.phone || '',
          category: typeof data.category === 'object' ? data.category?._id : data.category || '',
          name: data.user?.name || '',
        });
      }

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.put('/vendors/profile', formData);
      if (res.data.success) {
        toast.success('Profile updated successfully');
        // Update local state if needed
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
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
    router.push('/vendor/login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600'></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Store Profile</h1>
            <p className='text-gray-500'>Manage your store information and settings</p>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center px-4 py-2 text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors'
          >
            <LogOut className='w-4 h-4 mr-2' />
            Logout
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Main Profile Form */}
          <div className='md:col-span-2 space-y-6'>
            <form
              onSubmit={handleSubmit}
              className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
            >
              <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center'>
                <Store className='w-5 h-5 mr-2 text-violet-600' />
                Store Details
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Store Name</label>
                  <input
                    type='text'
                    name='storeName'
                    value={formData.storeName}
                    onChange={handleChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Owner Name</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Store Description
                  </label>
                  <textarea
                    name='storeDescription'
                    value={formData.storeDescription}
                    onChange={handleChange}
                    rows={4}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all'
                    placeholder='Tell us about your store...'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                  <div className='relative'>
                    <Tag className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <select
                      name='category'
                      value={formData.category}
                      onChange={handleChange}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none bg-white'
                    >
                      <option value=''>Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Phone Number
                  </label>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all'
                    />
                  </div>
                </div>
              </div>

              <div className='mt-8 flex justify-end'>
                <button
                  type='submit'
                  disabled={saving}
                  className={`flex items-center px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {saving ? (
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
                  ) : (
                    <Save className='w-4 h-4 mr-2' />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className='space-y-6'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
              <h3 className='font-bold text-gray-800 mb-4'>Account Information</h3>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Mail className='w-5 h-5 text-gray-400 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Email Address</p>
                    <p className='text-sm text-gray-500'>{profile.user.email}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div
                    className={`w-2 h-2 mt-1.5 rounded-full ${profile.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}
                  />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Account Status</p>
                    <p className='text-sm text-gray-500 capitalize'>{profile.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {profile.subscription ? (
              <div className='bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white'>
                <h3 className='font-bold mb-1 opacity-90'>Current Plan</h3>
                <p className='text-2xl font-bold mb-4'>{profile.subscription.plan.name}</p>

                <div className='space-y-2 text-sm opacity-80'>
                  <div className='flex justify-between'>
                    <span>Status</span>
                    <span className='capitalize font-medium'>{profile.subscription.status}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Expires On</span>
                    <span className='font-medium'>
                      {new Date(profile.subscription.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='bg-orange-50 rounded-xl shadow-sm border border-orange-100 p-6'>
                <h3 className='font-bold text-orange-800 mb-2'>No Active Subscription</h3>
                <p className='text-sm bg-orange-600 mb-4'>Subscribe to a plan to start selling.</p>
                {/* Link to subscription page if it exists */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
