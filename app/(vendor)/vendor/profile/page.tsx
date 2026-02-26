'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import {
  Save,
  Store,
  Mail,
  Phone,
  Tag,
  RefreshCw,
  X,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Wallet,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useVendorAuth } from '@/lib/context/VendorAuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  durationInMonths: number;
  description: string;
  features: string[];
  isFreeTrialPlan?: boolean;
  trialPeriodDays?: number;
}

interface VendorCategory {
  _id: string;
  name: string;
}

export default function VendorProfilePage() {
  const { vendor, checkAuth, loading: authLoading } = useVendorAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<VendorCategory[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    phone: '',
    category: '',
    shippingCharge: 0,
    name: '',
  });

  // Renewal Modal State
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [upiHolderName, setUpiHolderName] = useState('');
  const [savingUpi, setSavingUpi] = useState(false);
  const [verifyingUpi, setVerifyingUpi] = useState(false);

  useEffect(() => {
    fetchCategories();
    // Load Razorpay script on mount
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (vendor) {
      setFormData({
        storeName: vendor.storeName || '',
        storeDescription: vendor.storeDescription || '',
        phone: vendor.phone || '',
        shippingCharge: vendor.shippingCharge || 0,
        category:
          typeof vendor.category === 'object' ? vendor.category?._id : vendor.category || '',
        name: vendor.user?.name || '',
      });
      // Seed UPI fields from vendor context
      setUpiId((vendor as any).upiId || '');
      setUpiVerified((vendor as any).upiVerified || false);
      setUpiHolderName((vendor as any).upiHolderName || '');
    }
  }, [vendor]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/vendor-categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
        checkAuth();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // ─── Renewal ───────────────────────────────────────────────────────────────

  const openRenewalModal = async () => {
    setShowRenewalModal(true);
    setLoadingPlans(true);
    try {
      const res = await api.get('/subscription-plans');
      const sorted: Plan[] = (res.data.data || []).sort((a: Plan, b: Plan) => a.price - b.price);
      setPlans(sorted);
      // Pre-select current plan if found, else highest-value plan
      const currentPlanId = (vendor as any)?.subscription?.plan?._id;
      const defaultPlan = sorted.find((p) => p._id === currentPlanId) ?? sorted[sorted.length - 1];
      if (defaultPlan) setSelectedPlanId(defaultPlan._id);
    } catch (err) {
      toast.error('Failed to load plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  const selectedPlan = plans.find((p) => p._id === selectedPlanId);

  const handleRenew = async () => {
    if (!selectedPlan) return;
    setProcessingPayment(true);

    try {
      // 1. Create renewal Razorpay order
      const orderRes = await api.post('/vendors/create-renewal-order', {
        planId: selectedPlan._id,
      });
      const { id: order_id, amount, currency, key, freePayment } = orderRes.data.data;

      const doRenew = async (paymentDetails: any) => {
        const renewRes = await api.post('/vendors/renew-subscription', {
          planId: selectedPlan._id,
          paymentDetails,
        });
        if (renewRes.data.success) {
          toast.success('Subscription renewed successfully! 🎉');
          setShowRenewalModal(false);
          checkAuth(); // refresh vendor context
        }
      };

      if (freePayment) {
        await doRenew({
          razorpay_order_id: order_id,
          razorpay_payment_id: 'free_payment',
          razorpay_signature: 'free_payment',
        });
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Agni Pengal',
        description: `Renew — ${selectedPlan.name}`,
        order_id,
        handler: async function (response: any) {
          try {
            await doRenew({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          } catch (err: any) {
            toast.error(
              err.response?.data?.error || 'Renewal failed after payment. Contact support.',
            );
          }
        },
        prefill: {
          name: vendor?.user?.name,
          email: vendor?.user?.email,
          contact: vendor?.phone,
        },
        theme: { color: '#ea580c' },
        modal: {
          ondismiss: () => toast('Payment cancelled'),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to initiate renewal');
    } finally {
      setProcessingPayment(false);
    }
  };

  // ─── Subscription card helpers ────────────────────────────────────────────

  const sub = (vendor as any)?.subscription;
  const daysLeft = sub
    ? Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86_400_000)
    : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 30 && daysLeft > 0;
  const isExpired = vendor?.status === 'expired' || (daysLeft !== null && daysLeft <= 0);

  if (loading || authLoading) {
    return (
      <div className='flex justify-center items-center h-screen bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600'></div>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      {/* Processing overlay */}
      {processingPayment && (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm'>
          <div className='w-14 h-14 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin' />
          <p className='mt-4 text-lg font-bold text-gray-800'>Processing Payment…</p>
          <p className='text-sm text-gray-500 mt-1'>Please don't close this window.</p>
        </div>
      )}

      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Store Profile</h1>
            <p className='text-gray-500'>Manage your store information and settings</p>
          </div>
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

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Shipping Charge (₹)
                  </label>
                  <input
                    type='number'
                    name='shippingCharge'
                    value={formData.shippingCharge}
                    onChange={handleChange}
                    min='0'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all'
                    placeholder='e.g. 50'
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    Set this as 0 to offer free shipping.
                  </p>
                </div>
              </div>

              <div className='mt-8 flex justify-end'>
                <button
                  type='submit'
                  disabled={saving}
                  className={`flex items-center px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {saving ? (
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2' />
                  ) : (
                    <Save className='w-4 h-4 mr-2' />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Account Info */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
              <h3 className='font-bold text-gray-800 mb-4'>Account Information</h3>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Mail className='w-5 h-5 text-gray-400 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Email Address</p>
                    <p className='text-sm text-gray-500'>{vendor.user.email}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div
                    className={`w-2 h-2 mt-1.5 rounded-full ${
                      vendor.status === 'active'
                        ? 'bg-green-500'
                        : vendor.status === 'expired'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                    }`}
                  />
                  <div>
                    <p className='text-sm font-medium text-gray-900'>Account Status</p>
                    <p className='text-sm text-gray-500 capitalize'>{vendor.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            {sub ? (
              <div
                className={`rounded-xl shadow-lg p-6 text-white ${
                  isExpired
                    ? 'bg-gradient-to-br from-red-600 to-red-800'
                    : isExpiringSoon
                      ? 'bg-gradient-to-br from-orange-500 to-red-600'
                      : 'bg-gradient-to-br from-violet-600 to-indigo-700'
                }`}
              >
                <div className='flex items-center justify-between mb-1'>
                  <h3 className='font-bold opacity-90'>Current Plan</h3>
                  {isExpired && <AlertTriangle className='w-5 h-5 text-red-200' />}
                  {isExpiringSoon && !isExpired && (
                    <AlertTriangle className='w-5 h-5 text-orange-200' />
                  )}
                  {!isExpired && !isExpiringSoon && (
                    <CheckCircle className='w-5 h-5 text-green-300' />
                  )}
                </div>
                <p className='text-2xl font-bold mb-4'>{sub.plan.name}</p>

                <div className='space-y-2 text-sm opacity-90 mb-5'>
                  <div className='flex justify-between'>
                    <span>Status</span>
                    <span className='capitalize font-medium'>{sub.status}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Expires On</span>
                    <span className='font-medium'>
                      {new Date(sub.endDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {daysLeft !== null && (
                    <div className='flex justify-between'>
                      <span>Days Left</span>
                      <span
                        className={`font-bold ${daysLeft <= 0 ? 'text-red-300' : daysLeft <= 30 ? 'text-orange-200' : 'text-green-300'}`}
                      >
                        {daysLeft <= 0 ? 'Expired' : `${daysLeft} days`}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={openRenewalModal}
                  className='w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 active:bg-white/10 transition-colors rounded-lg py-2.5 font-bold text-sm border border-white/30'
                >
                  <RefreshCw className='w-4 h-4' />
                  {isExpired ? 'Reactivate Subscription' : 'Renew Subscription'}
                </button>
              </div>
            ) : (
              <div className='bg-orange-50 rounded-xl shadow-sm border border-orange-100 p-6'>
                <h3 className='font-bold text-orange-800 mb-2'>No Active Subscription</h3>
                <p className='text-sm text-orange-600 mb-4'>
                  Subscribe to a plan to start selling.
                </p>
                <button
                  onClick={openRenewalModal}
                  className='w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 font-bold text-sm transition-colors'
                >
                  <CreditCard className='w-4 h-4' />
                  Subscribe Now
                </button>
              </div>
            )}

            {/* Payment Details — UPI */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
              <h3 className='font-bold text-gray-800 mb-1 flex items-center gap-2'>
                <Wallet className='w-4 h-4 text-violet-600' />
                Payment Details
              </h3>
              <p className='text-xs text-gray-400 mb-4'>Add your UPI ID to receive payouts</p>

              {/* Current UPI status */}
              {upiId && (
                <div
                  className={`flex items-center gap-2 mb-3 p-2.5 rounded-lg text-sm ${
                    upiVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}
                >
                  {upiVerified ? (
                    <ShieldCheck className='w-4 h-4 flex-shrink-0' />
                  ) : (
                    <ShieldAlert className='w-4 h-4 flex-shrink-0' />
                  )}
                  <div>
                    <p className='font-medium'>{upiId}</p>
                    {upiVerified && upiHolderName && (
                      <p className='text-xs opacity-75'>{upiHolderName}</p>
                    )}
                    <p className='text-xs opacity-75'>
                      {upiVerified ? '✅ Verified' : '⚠ Not verified'}
                    </p>
                  </div>
                </div>
              )}

              <input
                type='text'
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setUpiVerified(false);
                }}
                placeholder='yourname@upi'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent mb-3'
              />

              <div className='flex gap-2'>
                {/* Save without verifying */}
                <button
                  onClick={async () => {
                    if (!upiId.trim()) return toast.error('Enter a UPI ID first');
                    setSavingUpi(true);
                    try {
                      const res = await api.put('/vendors/upi', { upiId: upiId.trim() });
                      if (res.data.success) {
                        toast.success('UPI ID saved');
                        setUpiVerified(false);
                        checkAuth();
                      }
                    } catch (err: any) {
                      toast.error(err.response?.data?.error || 'Failed to save UPI');
                    } finally {
                      setSavingUpi(false);
                    }
                  }}
                  disabled={savingUpi || verifyingUpi}
                  className='flex-1 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition'
                >
                  {savingUpi ? 'Saving…' : 'Save UPI'}
                </button>

                {/* Verify with ₹1 */}
                <button
                  onClick={async () => {
                    if (!upiId.trim()) return toast.error('Enter a UPI ID first');
                    setVerifyingUpi(true);
                    try {
                      // 1. Create ₹1 Order
                      const orderRes = await api.post('/vendors/upi/create-verify-order', {
                        upiId: upiId.trim(),
                      });

                      if (!orderRes.data.success) {
                        toast.error(orderRes.data.error || 'Failed to initiate verification');
                        setVerifyingUpi(false);
                        return;
                      }

                      const { order, key } = orderRes.data.data;

                      // 2. Open Razorpay Checkout for ₹1
                      const options = {
                        key,
                        amount: order.amount,
                        currency: order.currency,
                        name: 'Agni Pengal',
                        description: 'UPI Verification (₹1)',
                        order_id: order.id,
                        prefill: {
                          name: vendor?.user?.name || '',
                          email: vendor?.user?.email || '',
                          contact: vendor?.phone || '',
                        },
                        handler: async function (response: any) {
                          try {
                            // 3. Complete Verification on Success
                            const verifyRes = await api.post('/vendors/upi/complete-verify', {
                              razorpay_order_id: response.razorpay_order_id,
                              razorpay_payment_id: response.razorpay_payment_id,
                              razorpay_signature: response.razorpay_signature,
                            });

                            if (verifyRes.data.success) {
                              toast.success('₹1 payment successful. UPI verified!');
                              setUpiVerified(true);
                              setUpiHolderName(
                                verifyRes.data.data?.upiHolderName || vendor?.user?.name || '',
                              );
                              checkAuth();
                            } else {
                              toast.error(verifyRes.data.error || 'Verification failed');
                            }
                          } catch (err: any) {
                            toast.error(err.response?.data?.error || 'Verification error');
                          } finally {
                            setVerifyingUpi(false);
                          }
                        },
                        modal: {
                          ondismiss: function () {
                            setVerifyingUpi(false);
                            toast.error('Payment cancelled');
                          },
                        },
                        theme: {
                          color: '#7c3aed', // violet-600
                        },
                      };

                      const rzp = new window.Razorpay(options);
                      rzp.open();
                    } catch (err: any) {
                      toast.error(err.response?.data?.error || 'Failed to initiate payment');
                      setVerifyingUpi(false);
                    }
                  }}
                  disabled={savingUpi || verifyingUpi}
                  className='flex-1 py-2 text-xs font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 transition'
                >
                  {verifyingUpi ? (
                    <span className='flex items-center justify-center gap-1'>
                      <span className='w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block' />
                      Verifying…
                    </span>
                  ) : (
                    'Verify with ₹1'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Renewal Modal ─────────────────────────────────────────────────── */}
      {showRenewalModal && (
        <div className='fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-100'>
              <div>
                <h2 className='text-xl font-bold text-gray-900'>
                  {sub ? 'Renew Subscription' : 'Subscribe to a Plan'}
                </h2>
                <p className='text-sm text-gray-500 mt-0.5'>
                  Choose a plan that suits your business
                </p>
              </div>
              <button
                onClick={() => setShowRenewalModal(false)}
                className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-6 space-y-5'>
              {loadingPlans ? (
                <div className='flex justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500' />
                </div>
              ) : (
                <>
                  {/* Plan list */}
                  <div className='space-y-3'>
                    {plans.map((plan) => {
                      const isSelected = selectedPlanId === plan._id;
                      return (
                        <div
                          key={plan._id}
                          onClick={() => setSelectedPlanId(plan._id)}
                          className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-300'
                              : 'border-gray-200 hover:border-orange-200 bg-white'
                          }`}
                        >
                          <div className='flex justify-between items-center'>
                            <div>
                              <p
                                className={`font-bold ${isSelected ? 'text-orange-700' : 'text-gray-800'}`}
                              >
                                {plan.name}
                              </p>
                              <p className='text-xs text-gray-400 mt-0.5'>
                                {plan.durationInMonths} month{plan.durationInMonths > 1 ? 's' : ''}
                              </p>
                            </div>
                            <span
                              className={`text-lg font-extrabold ${isSelected ? 'text-orange-600' : 'text-gray-700'}`}
                            >
                              {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                            </span>
                          </div>
                          {plan.features && plan.features.length > 0 && (
                            <ul className='mt-2 space-y-0.5'>
                              {plan.features.slice(0, 3).map((f, i) => (
                                <li
                                  key={i}
                                  className='text-xs text-gray-500 flex items-center gap-1'
                                >
                                  <CheckCircle className='w-3 h-3 text-green-500 flex-shrink-0' />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  {selectedPlan && (
                    <div className='border-t border-gray-100 pt-4 space-y-2'>
                      <div className='flex justify-between text-sm text-gray-600'>
                        <span>Plan Price</span>
                        <span>{selectedPlan.price === 0 ? 'Free' : `₹${selectedPlan.price}`}</span>
                      </div>
                      <div className='flex justify-between text-base font-bold text-gray-900'>
                        <span>Total Payable</span>
                        <span>{selectedPlan.price === 0 ? '₹0' : `₹${selectedPlan.price}`}</span>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={handleRenew}
                    disabled={!selectedPlan || processingPayment}
                    className='w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2'
                  >
                    {processingPayment ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        Processing…
                      </>
                    ) : (
                      <>
                        <CreditCard className='w-4 h-4' />
                        {selectedPlan?.price === 0
                          ? 'Activate Free Plan'
                          : `Pay ₹${selectedPlan?.price} & Renew`}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
