'use client';

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface PaymentManagerProps {
  payments: any[];
  pagination?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
  search?: string;
  stats?: { _id: string; count: number; totalAmount: number }[];
}

export default function PaymentManager({
  payments: initialPayments,
  pagination,
  search: initialSearch,
  stats,
}: PaymentManagerProps) {
  const router = useRouter();
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState(initialSearch || '');
  const [commissionRate, setCommissionRate] = useState(5); // Default 5%

  // Calculate Grand Total from stats
  const grandTotal = stats?.reduce((acc, curr) => acc + curr.totalAmount, 0) || 0;
  const totalCount = stats?.reduce((acc, curr) => acc + curr.count, 0) || 0;

  useEffect(() => {
    setPayments(initialPayments);
    // Fetch current commission settings from Config
    api
      .get('/config')
      .then((res) => {
        if (res.data.success && res.data.data.adminCommissionRate !== undefined) {
          setCommissionRate(parseFloat(res.data.data.adminCommissionRate));
        }
      })
      .catch((err) => console.error('Failed to fetch commission settings', err));
  }, [initialPayments]);

  const [loadingRefund, setLoadingRefund] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundReason, setRefundReason] = useState<string>('');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/mahisadminpanel/payments?search=${search}&page=1`);
  };

  const handleRefundClick = (payment: any) => {
    const total = payment.subTotal;

    // Calculation Logic
    const gatewayFee = total * 0.02; // 2% of Total
    const gstOnFee = gatewayFee * 0.18; // 18% GST on 2% Fee
    const adminCommission = total * (commissionRate / 100); // Dynamic Admin Commission

    const totalDeductions = gatewayFee + gstOnFee + adminCommission;
    const netRefund = total - totalDeductions;

    setSelectedPaymentId(payment.paymentId);
    // Round to 2 decimal places
    setRefundAmount(Math.max(0, netRefund).toFixed(2));
    setRefundReason('');
  };

  const confirmRefund = async () => {
    if (!selectedPaymentId) return;

    try {
      setLoadingRefund(selectedPaymentId);
      setLoadingRefund(selectedPaymentId);
      const res = await api.post(`/payments/${selectedPaymentId}/refund`, {
        amount: parseFloat(refundAmount),
        reason: refundReason,
      });

      if (res.data.success) {
        alert(res.data.message);
        // Ideally refresh data or update local state status
        setPayments((prev) =>
          prev.map((p) =>
            p.paymentId === selectedPaymentId ? { ...p, status: 'REFUND_INITIATED' } : p,
          ),
        );
        setSelectedPaymentId(null);
      } else {
        alert('Refund Failed');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Refund failed');
    } finally {
      setLoadingRefund(null);
    }
  };

  const getStatusTheme = (status: string) => {
    const theme: any = {
      DELIVERED: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        text: 'text-emerald-900',
        subtext: 'text-emerald-600',
        icon: 'bg-emerald-100 text-emerald-600',
      },
      SHIPPED: {
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        text: 'text-blue-900',
        subtext: 'text-blue-600',
        icon: 'bg-blue-100 text-blue-600',
      },
      PENDING: {
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        text: 'text-amber-900',
        subtext: 'text-amber-600',
        icon: 'bg-amber-100 text-amber-600',
      },
      PROCESSING: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
        text: 'text-indigo-900',
        subtext: 'text-indigo-600',
        icon: 'bg-indigo-100 text-indigo-600',
      },
      CANCELLED: {
        bg: 'bg-red-50',
        border: 'border-red-100',
        text: 'text-red-900',
        subtext: 'text-red-600',
        icon: 'bg-red-100 text-red-600',
      },
      REFUNDED: {
        bg: 'bg-purple-50',
        border: 'border-purple-100',
        text: 'text-purple-900',
        subtext: 'text-purple-600',
        icon: 'bg-purple-100 text-purple-600',
      },
      RETURNED: {
        bg: 'bg-orange-50',
        border: 'border-orange-100',
        text: 'text-orange-900',
        subtext: 'bg-orange-600',
        icon: 'bg-orange-100 bg-orange-600',
      },
    };
    return (
      theme[status] || {
        bg: 'bg-gray-50',
        border: 'border-gray-100',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        icon: 'bg-gray-100 text-gray-500',
      }
    );
  };

  return (
    <div>
      {/* Stats Tiles */}
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8'>
        {/* Grand Total Tile - Gold Theme for Luxury feel */}
        <div className='bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl shadow-sm border border-amber-100'>
          <p className='text-xs font-bold text-amber-700 uppercase tracking-wider'>
            Total Collected
          </p>
          <p className='text-2xl font-black text-amber-900 mt-2'>₹{grandTotal.toLocaleString()}</p>
          <div className='flex items-center gap-2 mt-2'>
            <span className='bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full'>
              ALL TIME
            </span>
            <p className='text-xs text-amber-600 font-medium'>{totalCount} Txns</p>
          </div>
        </div>

        {stats?.map((stat) => {
          const theme = getStatusTheme(stat._id);
          return (
            <div
              key={stat._id}
              className={`${theme.bg} p-4 rounded-xl shadow-sm border ${theme.border} hover:shadow-md transition-shadow duration-200`}
            >
              <p className={`text-xs font-bold ${theme.subtext} uppercase tracking-wider`}>
                {stat._id}
              </p>
              <p className={`text-lg font-black ${theme.text} mt-2`}>
                ₹{stat.totalAmount.toLocaleString()}
              </p>
              <p className={`text-xs ${theme.subtext} font-medium mt-1`}>{stat.count} Orders</p>
            </div>
          );
        })}
      </div>

      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Payments List</h1>
        <form onSubmit={handleSearch} className='relative'>
          <input
            type='text'
            placeholder='Search Payment/Order ID...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-64'
          />
          <Search className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' />
        </form>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto'>
        <table className='w-full text-left min-w-[1000px]'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='p-4 font-medium text-gray-500'>Payment ID</th>
              <th className='p-4 font-medium text-gray-500'>Order ID</th>
              <th className='p-4 font-medium text-gray-500'>Customer</th>
              <th className='p-4 font-medium text-gray-500'>Date</th>
              <th className='p-4 font-medium text-gray-500'>Amount</th>
              <th className='p-4 font-medium text-gray-500'>Order Status</th>
              <th className='p-4 font-medium text-gray-500'>Payment Status</th>
              <th className='p-4 font-medium text-gray-500'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {payments.map((payment) => (
              <tr key={payment._id} className='hover:bg-gray-50 transition'>
                <td className='p-4 text-sm font-mono'>{payment.paymentId}</td>
                <td className='p-4 text-sm font-mono'>{payment.orderId}</td>
                <td className='p-4 text-sm'>
                  <div className='font-medium text-gray-900'>{payment.customer.name}</div>
                  <div className='text-gray-500'>{payment.customer.email}</div>
                </td>
                <td className='p-4 text-sm text-gray-500'>
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className='p-4 font-medium text-gray-900'>₹{payment.totalAmount}</td>
                <td className='p-4'>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold
                                        ${
                                          payment.orderStatus === 'DELIVERED'
                                            ? 'bg-green-100 text-green-700'
                                            : payment.orderStatus === 'SHIPPED'
                                              ? 'bg-blue-100 text-blue-700'
                                              : payment.orderStatus === 'CANCELLED' ||
                                                  payment.orderStatus === 'Refused'
                                                ? 'bg-red-100 text-red-700'
                                                : payment.orderStatus === 'REFUNDED'
                                                  ? 'bg-gray-200 text-gray-700'
                                                  : 'bg-yellow-100 text-yellow-700'
                                        }
                                    `}
                  >
                    {payment.orderStatus}
                  </span>
                </td>
                <td className='p-4'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium 
                                        ${payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                    `}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className='p-4'>
                  {payment.status === 'PAID' && payment.orderStatus === 'RETURNED' && (
                    <button
                      onClick={() => handleRefundClick(payment)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                      title='Refund'
                    >
                      <RotateCcw className='w-4 h-4' />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className='mt-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
          <div className='text-sm text-gray-500'>
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
            entries
          </div>
          <div className='flex items-center gap-2'>
            <button
              disabled={pagination.page <= 1}
              onClick={() =>
                router.push(
                  `/mahisadminpanel/payments?search=${search}&page=${pagination.page - 1}`,
                )
              }
              className='p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition'
              aria-label='Previous Page'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
            <span className='text-sm text-gray-600 font-medium'>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() =>
                router.push(
                  `/mahisadminpanel/payments?search=${search}&page=${pagination.page + 1}`,
                )
              }
              className='p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition'
              aria-label='Next Page'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {selectedPaymentId && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-white p-6 rounded-xl shadow-xl w-full max-w-sm'>
            <h3 className='text-lg font-bold mb-4'>Refund Payment</h3>
            <p className='text-gray-500 mb-4 text-sm'>
              Initiate refund via Razorpay for ID: {selectedPaymentId}
            </p>

            <div className='mb-4'>
              <label className='text-xs font-semibold text-gray-500 uppercase'>Amount</label>
              <input
                type='number'
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Auto-calculated: Total - (2% Gateway + 18% GST on Gateway + {commissionRate}% Admin
                Comm)
              </p>
            </div>

            <div className='mb-4'>
              <label className='text-xs font-semibold text-gray-500 uppercase'>Reason</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder='e.g. Returned damaged item'
                className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm h-20 resize-none'
              />
            </div>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setSelectedPaymentId(null)}
                className='px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg'
              >
                Cancel
              </button>
              <button
                onClick={confirmRefund}
                disabled={!!loadingRefund}
                className='px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition flex items-center gap-2'
              >
                {loadingRefund ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
