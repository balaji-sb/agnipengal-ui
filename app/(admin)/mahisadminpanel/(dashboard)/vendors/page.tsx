'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CheckCircle, XCircle, Shield, Store, CreditCard, UserX, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Vendor {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  storeName: string;
  storeDescription: string;
  phone: string;
  status: 'pending' | 'active' | 'rejected';
  subscription?: {
    plan: {
      name: string;
    };
    status: string;
    endDate: string;
  };
  createdAt: string;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  durationInMonths: number;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    fetchVendors();
    fetchPlans();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors/admin/all');
      setVendors(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscription-plans/admin');
      setPlans(response.data.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const toggleUserActive = async (userId: string, isActive: boolean) => {
    try {
      await api.put(`/vendors/admin/user/${userId}/toggle-active`, {
        isActive,
      });
      toast.success(isActive ? 'User activated' : 'User deactivated');
      fetchVendors();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to toggle user status');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/vendors/admin/${id}/status`, { status });
      toast.success(`Vendor marked as ${status}`);
      fetchVendors();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const assignPlan = async (planId: string) => {
    if (!selectedVendor) return;
    try {
      await api.post('/subscription-plans/assign', {
        vendorId: selectedVendor.user._id,
        planId,
      });
      toast.success('Subscription plan assigned');
      setShowPlanModal(false);
      fetchVendors();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to assign plan');
    }
  };

  const filteredVendors = vendors.filter((v) => filter === 'all' || v.status === filter);

  if (loading) return <div className='p-8 text-center text-gray-500'>Loading vendors...</div>;

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 flex items-center'>
          <Store className='mr-3 text-pink-600' /> Vendor Management
        </h1>
        <div className='flex space-x-2'>
          {['all', 'pending', 'active', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                filter === status
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-left'>
          <thead className='bg-gray-50 text-gray-600 text-sm font-semibold border-b border-gray-100'>
            <tr>
              <th className='p-4'>Store Name</th>
              <th className='p-4'>Owner Name</th>
              <th className='p-4'>Status</th>
              <th className='p-4'>Subscription</th>
              <th className='p-4'>User Login</th>
              <th className='p-4 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {filteredVendors.map((vendor) => (
              <tr key={vendor._id} className='hover:bg-gray-50 transition'>
                <td className='p-4 font-medium text-gray-800'>{vendor.storeName}</td>
                <td className='p-4 text-gray-600'>
                  <div>{vendor.user.name}</div>
                  <div className='text-xs text-gray-400'>{vendor.user.email}</div>
                  <div className='text-xs text-gray-400'>{vendor.phone}</div>
                </td>
                <td className='p-4'>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      vendor.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : vendor.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className='p-4'>
                  {vendor.subscription?.status === 'active' ? (
                    <div className='text-sm'>
                      <span className='font-semibold text-green-600'>
                        {vendor.subscription.plan?.name || 'Active Plan'}
                      </span>
                      <div className='text-xs text-gray-500'>
                        Exp: {new Date(vendor.subscription.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <span className='text-xs text-gray-400'>No Active Plan</span>
                  )}
                </td>
                <td className='p-4'>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                      vendor.user.isActive
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => toggleUserActive(vendor.user._id, !vendor.user.isActive)}
                    title={vendor.user.isActive ? 'Deactivate User Login' : 'Activate User Login'}
                  >
                    {vendor.user.isActive ? (
                      <UserCheck className='w-3 h-3' />
                    ) : (
                      <UserX className='w-3 h-3' />
                    )}
                    {vendor.user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className='p-4 text-right space-x-2'>
                  {/* <button
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setShowPlanModal(true);
                    }}
                    className='p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition'
                    title='Assign Plan'
                  >
                    <CreditCard className='w-5 h-5' />
                  </button> */}
                  {vendor.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(vendor._id, 'active')}
                      className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition'
                      title='Approve'
                    >
                      <CheckCircle className='w-5 h-5' />
                    </button>
                  )}
                  {vendor.status === 'active' && (
                    <button
                      onClick={() => updateStatus(vendor._id, 'rejected')}
                      className='p-2 text-red-500 hover:bg-red-50 rounded-lg transition'
                      title='Deactivate'
                    >
                      <Shield className='w-5 h-5' />
                    </button>
                  )}
                  {vendor.status === 'rejected' && (
                    <button
                      onClick={() => updateStatus(vendor._id, 'active')}
                      className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition'
                      title='Re-activate'
                    >
                      <CheckCircle className='w-5 h-5' />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredVendors.length === 0 && (
              <tr>
                <td colSpan={6} className='p-8 text-center text-gray-500'>
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPlanModal && selectedVendor && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-8 rounded-xl shadow-xl w-full max-w-md'>
            <h3 className='text-xl font-bold mb-4'>Assign Subscription</h3>
            <p className='text-gray-600 mb-6'>
              Select a plan for <span className='font-semibold'>{selectedVendor.storeName}</span>
            </p>

            <div className='space-y-3'>
              {plans.map((plan) => (
                <button
                  key={plan._id}
                  onClick={() => assignPlan(plan._id)}
                  className='w-full flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition'
                >
                  <span className='font-medium text-gray-800'>
                    {plan.name} ({plan.durationInMonths} Mo)
                  </span>
                  <span className='font-bold text-pink-600'>₹{plan.price}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPlanModal(false)}
              className='mt-6 w-full py-2 text-gray-600 hover:bg-gray-100 rounded-lg'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
