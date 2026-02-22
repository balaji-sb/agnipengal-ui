'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CreditCard, Plus, Trash2, CheckCircle, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Plan {
  _id: string;
  name: string;
  durationInMonths: number;
  price: number;
  description: string;
  isActive: boolean;
}

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    durationInMonths: '1',
    price: '',
    description: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscription-plans/admin');
      setPlans(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load plans');
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/subscription-plans', {
        ...formData,
        price: Number(formData.price),
        durationInMonths: Number(formData.durationInMonths),
      });
      toast.success('Plan created successfully');
      setShowModal(false);
      setFormData({ name: '', durationInMonths: '1', price: '', description: '' });
      fetchPlans();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create plan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/subscription-plans/${id}`);
      toast.success('Plan deleted');
      fetchPlans();
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  if (loading) return <div className='p-8'>Loading...</div>;

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 flex items-center'>
          <CreditCard className='mr-3 text-pink-600' /> Subscription Plans
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className='bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-pink-700 transition'
        >
          <Plus className='w-5 h-5 mr-2' />
          Create Plan
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {plans.map((plan) => (
          <div
            key={plan._id}
            className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col'
          >
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-xl font-bold text-gray-800'>{plan.name}</h3>
                <p className='text-sm text-gray-500'>{plan.durationInMonths} Months</p>
              </div>
              <h3 className='text-2xl font-bold text-pink-600'>₹{plan.price}</h3>
            </div>
            <p className='text-gray-600 mb-6 flex-grow'>{plan.description}</p>

            <div className='flex justify-end pt-4 border-t border-gray-100 space-x-2'>
              <button
                onClick={() => handleDelete(plan._id)}
                className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition'
              >
                <Trash2 className='w-5 h-5' />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-8 rounded-xl shadow-xl w-full max-w-md'>
            <h2 className='text-2xl font-bold mb-6'>Create Subscription Plan</h2>
            <form onSubmit={handleCreate} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Plan Name</label>
                <input
                  type='text'
                  required
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='e.g. Gold Plan'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Duration (Months)
                  </label>
                  <select
                    className='w-full px-4 py-2 border border-gray-200 rounded-lg'
                    value={formData.durationInMonths}
                    onChange={(e) => setFormData({ ...formData, durationInMonths: e.target.value })}
                  >
                    <option value='1'>1 Month</option>
                    <option value='3'>3 Months</option>
                    <option value='6'>6 Months</option>
                    <option value='12'>12 Months</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Price (₹)</label>
                  <input
                    type='number'
                    required
                    className='w-full px-4 py-2 border border-gray-200 rounded-lg'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder='999'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <textarea
                  required
                  rows={3}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Plan details...'
                />
              </div>
              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700'
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
