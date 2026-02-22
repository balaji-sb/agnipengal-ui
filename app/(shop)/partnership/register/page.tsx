'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Link from 'next/link';

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
}

export default function PartnershipRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planIdParam = searchParams.get('planId');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    storeDescription: '',
    phone: '',
    category: '',
    planId: planIdParam || '',
  });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch plans & categories
    const fetchData = async () => {
      try {
        const [plansRes, catsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription-plans`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vendor-categories`),
        ]);

        setPlans(plansRes.data.data);
        setCategories(catsRes.data.data);

        if (!planIdParam && plansRes.data.data.length > 0) {
          // Default to first plan if none selected
          setFormData((prev) => ({ ...prev, planId: plansRes.data.data[0]._id }));
        }
        if (catsRes.data.data.length > 0) {
          // Default to a category if needed, OR force user to pick
          // setFormData((prev) => ({ ...prev, category: catsRes.data.data[0]._id }));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    return () => {
      document.body.removeChild(script);
    };
  }, [planIdParam]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedPlan = plans.find((p) => p._id === formData.planId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    if (!selectedPlan) {
      toast.error('Please select a plan');
      setLoading(false);
      return;
    }

    try {
      // 0. Check Availability First
      const checkRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/vendors/check-availability`,
        {
          email: formData.email,
          storeName: formData.storeName,
        },
      );

      if (!checkRes.data.success || !checkRes.data.available) {
        toast.error(checkRes.data.error || 'Email or Store Name already exists');
        setLoading(false);
        return;
      }

      // 1. Create Order
      const orderRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/vendors/create-registration-order`,
        {
          planId: selectedPlan._id,
        },
      );

      const { id: order_id, amount, currency, key } = orderRes.data.data;

      // 2. Open Razorpay
      const options = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use backend key preferably
        amount: amount,
        currency: currency,
        name: 'Agni Pengal',
        description: `Subscription for ${selectedPlan.name}`,
        order_id: order_id,
        handler: async function (response: any) {
          // 3. On Success -> Register Vendor with Payment Details
          setProcessingPayment(true);
          try {
            const registerRes = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/vendors/register`,
              {
                ...formData,
                subscription: {
                  planId: selectedPlan._id,
                  paymentDetails: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  },
                },
              },
            );

            if (registerRes.data.success) {
              toast.success(
                'Registration and Payment Successful! Please check your email for the login link.',
                { duration: 6000 },
              );
              // Do not automatically log in the vendor. Redirect to login page.
              // router.push('/vendor/login');
            }
          } catch (regError: any) {
            toast.error(
              regError.response?.data?.error ||
                'Registration failed after payment. Please contact support.',
            );
            console.error('Registration Error', regError);
          } finally {
            setProcessingPayment(false);
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#7C3AED', // Violet-600
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast('Payment cancelled');
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Partner Registration
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Complete your profile and subscription to start selling.
        </p>
      </div>

      {/* Overlay Loader */}
      {processingPayment && (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm'>
          <div className='w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin'></div>
          <h3 className='mt-4 text-xl font-bold text-gray-800'>Finalizing Your Registration...</h3>
          <p className='mt-2 text-gray-600 text-center max-w-sm px-4'>
            Please don't close this window. We are creating your partner portal and sending your
            login details securely.
          </p>
        </div>
      )}

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-xl'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Full Name</label>
                <input
                  name='name'
                  type='text'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500'
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Email address</label>
                <input
                  name='email'
                  type='email'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Password</label>
                <input
                  name='password'
                  type='password'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Confirm Password</label>
                <input
                  name='confirmPassword'
                  type='password'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Store Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Store Name</label>
                <input
                  name='storeName'
                  type='text'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500'
                  value={formData.storeName}
                  onChange={handleChange}
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700'>Business Category</label>
                <select
                  name='category'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500'
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value=''>Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Phone Number</label>
                <input
                  name='phone'
                  type='text'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500'
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Store Description</label>
              <textarea
                name='storeDescription'
                rows={3}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500'
                placeholder='Tell us about your products...'
                value={formData.storeDescription}
                onChange={handleChange}
              />
            </div>

            {/* Plan Selection */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Selected Plan</label>
              <div className='grid grid-cols-1 gap-3'>
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition ${
                      formData.planId === plan._id
                        ? 'border-violet-600 bg-violet-50 ring-1 ring-violet-600'
                        : 'border-gray-200 hover:border-violet-300'
                    }`}
                    onClick={() => setFormData({ ...formData, planId: plan._id })}
                  >
                    <div>
                      <span className='font-bold text-gray-800'>{plan.name}</span>
                      <span className='text-gray-500 text-sm ml-2'>
                        ({plan.durationInMonths} Mo)
                      </span>
                    </div>
                    <span className='font-bold text-pink-600'>₹{plan.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Submit */}
            <div className='pt-4 border-t border-gray-100'>
              <div className='flex justify-between items-center mb-6'>
                <span className='text-lg font-bold text-gray-700'>Total Payable</span>
                <span className='text-2xl font-extrabold text-gray-900'>
                  ₹{selectedPlan ? selectedPlan.price : 0}
                </span>
              </div>

              <button
                type='submit'
                disabled={loading || !selectedPlan}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500'
                }`}
              >
                {loading ? 'Processing...' : 'Pay & Register'}
              </button>
            </div>

            <div className='text-center text-sm'>
              Already have an account?{' '}
              <Link
                href='/vendor/login'
                className='font-medium text-violet-600 hover:text-violet-500'
              >
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
