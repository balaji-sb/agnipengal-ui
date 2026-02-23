'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import Script from 'next/script';
import Confetti from 'react-confetti';
import { useAuth } from '@/lib/context/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function OrderSummaryPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<any>(null);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [shippingCharge, setShippingCharge] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Load address from session storage
    const storedAddress = sessionStorage.getItem('checkoutAddress');
    if (!storedAddress) {
      router.push('/checkout');
      return;
    }
    setShippingAddress(JSON.parse(storedAddress));

    // Fetch shipping charge
    fetchShippingCharge(JSON.parse(storedAddress), totalPrice, items);
  }, [totalPrice, items, router]);

  const fetchShippingCharge = async (address: any, total: number, cartItems: any[]) => {
    try {
      console.log('Fetching shipping charge, total:', total, 'items:', cartItems);
      const { data } = await api.post('/shipping/calculate', {
        pincode: address.pincode,
        totalAmount: total,
        items: cartItems,
      });
      console.log('Shipping calculation response:', data);
      if (data.success) {
        setShippingCharge(data.shippingCharge);
      }
    } catch (error) {
      console.error('Error fetching shipping', error);
    }
  };

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode) return;

    try {
      const { data } = await api.post('/coupons/validate', {
        code: couponCode,
        cartTotal: totalPrice,
      });

      if (data.success) {
        setDiscount(data.discount);
        setAppliedCoupon(data.code);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setCouponError(data.error || 'Invalid coupon');
        setDiscount(0);
        setAppliedCoupon('');
      }
    } catch (error: any) {
      setCouponError(error.response?.data?.error || 'Failed to apply coupon');
      setDiscount(0);
      setAppliedCoupon('');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon('');
    setCouponCode('');
    setCouponError('');
  };

  const finalTotal = totalPrice + shippingCharge - discount;

  const handlePayment = async () => {
    if (!user) {
      alert('Please login');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer: shippingAddress,
        user: user._id,
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.offerPrice > 0 ? item.product.offerPrice : item.product.price,
          image: item.product.images[0],
          name: item.product.name,
        })),
        totalAmount: finalTotal,
        subTotal: totalPrice,
        shippingCharge,
        discount,
        couponCode: appliedCoupon || null,
      };

      const { data } = await api.post('/orders', orderData);
      if (!data.success) throw new Error(data.error);

      // Open Razorpay
      const options = {
        key: data.key, // Key from server response
        amount: data.amount,
        currency: 'INR',
        name: 'Agni Pengal',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            console.log('Razorpay response received', response);
            setProcessingPayment(true);
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              console.log('Payment success, orders:', verifyRes.data.orderIds);

              // Store per-vendor order IDs for the success page to display
              if (verifyRes.data.orderIds && verifyRes.data.orderIds.length > 0) {
                sessionStorage.setItem(
                  'confirmedOrderIds',
                  JSON.stringify(verifyRes.data.orderIds),
                );
                sessionStorage.setItem(
                  'confirmedOrderCount',
                  String(verifyRes.data.orderCount || 1),
                );
              } else if (data.dbOrderIds) {
                sessionStorage.setItem('confirmedOrderIds', JSON.stringify(data.dbOrderIds));
                sessionStorage.setItem('confirmedOrderCount', String(data.dbOrderIds.length));
              }

              // Log Firebase Analytics Event
              import('@/lib/firebase').then(({ analytics }) => {
                if (analytics) {
                  import('firebase/analytics').then(({ logEvent }) => {
                    logEvent(analytics, 'purchase', {
                      transaction_id: response.razorpay_payment_id,
                      value: finalTotal,
                      currency: 'INR',
                      tax: 0,
                      shipping: shippingCharge,
                      coupon: appliedCoupon,
                      items: items.map((item) => ({
                        item_id: item.variant
                          ? `${item.product._id}-${item.variant.name}`
                          : item.product._id,
                        item_name: item.product.name,
                        item_variant: item.variant?.name,
                        price: item.variant
                          ? item.variant.price
                          : item.product.offerPrice > 0
                            ? item.product.offerPrice
                            : item.product.price,
                        quantity: item.quantity,
                      })),
                    });
                  });
                }
              });

              clearCart();
              window.location.href = '/checkout/success';
              sessionStorage.removeItem('checkoutAddress');
            } else {
              console.error('Payment verification failed backend', verifyRes.data);
              alert('Payment verification failed: ' + (verifyRes.data.error || 'Unknown error'));
              setProcessingPayment(false);
            }
          } catch (error: any) {
            console.error('Verification error catch', error);
            alert('Payment verification failed: ' + (error.message || 'Network error'));
            setProcessingPayment(false);
          }
        },

        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.mobile,
        },
        theme: {
          color: '#D946EF',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment Error', error);
      alert('Payment initialization failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!shippingAddress) return <div className='p-20 text-center'>Loading...</div>;

  return (
    <div className='container mx-auto px-4 py-12'>
      <Script src='https://checkout.razorpay.com/v1/checkout.js' />
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <h1 className='text-3xl font-bold mb-8 text-center'>Order Summary</h1>

      <div className='flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto'>
        <div className='flex-1 space-y-8'>
          {/* Address Section */}
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-start mb-4'>
              <h2 className='text-lg font-bold text-gray-800'>Shipping Address</h2>
              <button
                onClick={() => router.push('/checkout')}
                className='text-pink-600 text-sm font-medium hover:underline'
              >
                Edit
              </button>
            </div>
            <div className='text-gray-600'>
              <p className='font-semibold text-gray-900'>{shippingAddress.name}</p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
              </p>
              <p>{shippingAddress.country}</p>
              <p className='mt-2'>Phone: {shippingAddress.mobile}</p>
            </div>
          </div>

          {/* Items Section */}
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <h2 className='text-lg font-bold text-gray-800 mb-4'>Order Items ({items.length})</h2>
            <div className='space-y-4'>
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className='flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0'
                >
                  <div className='relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0'>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900'>{item.product.name}</h3>
                    {item.product.vendorName && (
                      <p className='text-xs text-pink-600 font-medium'>{item.product.vendorName}</p>
                    )}
                    <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                  </div>
                  <div className='font-bold text-gray-900'>
                    ₹
                    {(item.product.offerPrice > 0 ? item.product.offerPrice : item.product.price) *
                      item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='w-full lg:w-96 space-y-6'>
          {/* Coupon Section */}
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <h2 className='text-lg font-bold text-gray-800 mb-4'>Coupons</h2>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Enter coupon code'
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!!appliedCoupon}
                className='flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none uppercase'
              />
              {appliedCoupon ? (
                <button
                  onClick={handleRemoveCoupon}
                  className='px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition'
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode}
                  className='px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50'
                >
                  Apply
                </button>
              )}
            </div>
            {couponError && <p className='text-red-500 text-sm mt-2'>{couponError}</p>}
            {appliedCoupon && (
              <p className='text-green-600 text-sm mt-2 font-medium'>
                Coupon applied successfully!
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <h2 className='text-lg font-bold text-gray-800 mb-4'>Price Details</h2>
            <div className='space-y-3 mb-6'>
              <div className='flex justify-between text-gray-600'>
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Shipping Charges</span>
                <span className={shippingCharge === 0 ? 'text-green-600' : ''}>
                  {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                </span>
              </div>
              {discount > 0 && (
                <div className='flex justify-between text-green-600 font-medium'>
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className='border-t pt-3 flex justify-between text-xl font-bold text-gray-900'>
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className='w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg flex items-center justify-center'
            >
              {loading ? (
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
              ) : (
                `Pay ₹${finalTotal}`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Processing Loader */}
      {processingPayment && (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300'>
            <div className='w-16 h-16 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin mb-4'></div>
            <h3 className='text-xl font-bold text-gray-800'>Processing Payment</h3>
            <p className='text-gray-500 mt-2'>Please do not close this window...</p>
          </div>
        </div>
      )}
    </div>
  );
}
