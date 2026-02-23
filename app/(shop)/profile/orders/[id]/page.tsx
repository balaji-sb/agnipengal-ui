'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Star,
  Eye,
  Store,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ReviewModal from '@/components/shop/ReviewModal';
import ViewReviewModal from '@/components/shop/ViewReviewModal';

interface ReviewData {
  rating: number;
  comment: string;
  createdAt: string;
  product: string;
  media?: { url: string; type: 'image' | 'video' }[];
}

// ──────────────────────────────────────────────────────────
// Per-vendor tracking timeline component
// ──────────────────────────────────────────────────────────
function VendorTrackingCard({
  vendorName,
  vendorId,
  items,
  tracking,
  orderStatus,
  isCancelled,
  isReturned,
  orderId,
  reviewedProducts,
  onOpenReview,
  onViewReview,
}: {
  vendorName: string;
  vendorId: string;
  items: any[];
  tracking: any;
  orderStatus: string;
  isCancelled: boolean;
  isReturned: boolean;
  orderId: string;
  reviewedProducts: Map<string, ReviewData>;
  onOpenReview: (product: any) => void;
  onViewReview: (name: string, review: ReviewData) => void;
}) {
  const steps = [
    { status: 'PENDING', label: 'Placed', icon: Clock },
    { status: 'PROCESSING', label: 'Processing', icon: ShoppingBag },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === (orderStatus || 'PENDING'));
  const isDelivered = orderStatus === 'DELIVERED';

  const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
    SHIPPED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    DELIVERED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    RETURNED: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  const statusKey = isCancelled ? 'CANCELLED' : isReturned ? 'RETURNED' : orderStatus || 'PENDING';
  const statusColor = STATUS_COLORS[statusKey] || STATUS_COLORS.PENDING;

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
      {/* Vendor Header */}
      <div className='flex items-center justify-between px-5 py-4 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center'>
            <Store className='w-4 h-4 text-pink-600' />
          </div>
          <div>
            <p className='text-xs text-pink-500 font-medium uppercase tracking-wide'>
              Fulfilled by
            </p>
            <p className='font-bold text-gray-900'>{vendorName}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor}`}>
          {isCancelled ? 'CANCELLED' : isReturned ? 'RETURNED' : orderStatus || 'PENDING'}
        </span>
      </div>

      {/* Tracking Timeline */}
      {!isCancelled && !isReturned && (
        <div className='px-6 pt-6 pb-4'>
          <div className='relative'>
            <div className='absolute top-5 left-[12.5%] w-[75%] h-1 bg-gray-100 -translate-y-1/2 z-0' />
            <div
              className='absolute top-5 left-[12.5%] h-1 bg-pink-400 -translate-y-1/2 z-0 transition-all duration-500'
              style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 75)}%` }}
            />
            <div className='grid grid-cols-4 relative z-10'>
              {steps.map((step, index) => {
                const completed = index <= currentStepIndex;
                const Icon = step.icon;
                return (
                  <div key={step.status} className='flex flex-col items-center'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300 ${
                        completed
                          ? 'border-pink-500 text-pink-500'
                          : 'border-gray-200 text-gray-300'
                      }`}
                    >
                      {completed ? (
                        <CheckCircle className='w-5 h-5 fill-pink-500 text-white' />
                      ) : (
                        <Icon className='w-5 h-5' />
                      )}
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium text-center ${completed ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className='flex items-center gap-3 px-5 py-4 bg-red-50 border-b border-red-100 text-red-700 text-sm'>
          <XCircle className='w-5 h-5 flex-shrink-0' />
          <span>
            This portion from <strong>{vendorName}</strong> was cancelled.
          </span>
        </div>
      )}

      {/* Tracking Info */}
      {tracking && (
        <div className='mx-5 mb-4 mt-2 bg-blue-50 rounded-xl p-4 border border-blue-100'>
          <div className='flex items-center gap-2 mb-3'>
            <Truck className='w-4 h-4 text-blue-600' />
            <span className='font-semibold text-blue-900 text-sm'>Shipment Tracking</span>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <p className='text-[10px] text-blue-400 uppercase font-bold tracking-wider'>
                Courier
              </p>
              <p className='text-blue-900 font-medium text-sm'>{tracking.courierName}</p>
            </div>
            <div>
              <p className='text-[10px] text-blue-400 uppercase font-bold tracking-wider'>
                Tracking #
              </p>
              <p className='text-blue-900 font-mono text-sm'>{tracking.trackingNumber}</p>
            </div>
          </div>
          {tracking.trackingUrl && (
            <a
              href={tracking.trackingUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-3 inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline'
            >
              Track Package <ExternalLink className='w-3.5 h-3.5' />
            </a>
          )}
        </div>
      )}

      {/* Items List */}
      <div className='divide-y divide-gray-50'>
        {items.map((item: any, idx: number) => {
          const reviewKey = `${orderId}_${item.product?._id || item.product}`;
          let review = reviewedProducts.get(reviewKey);
          if (!review && item.product?._id && reviewedProducts.has(item.product._id)) {
            review = reviewedProducts.get(item.product._id);
          }

          return (
            <div key={idx} className='p-4 flex gap-4'>
              <div className='w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product?.images?.[0] || item.image || '/placeholder.png'}
                  alt={item.name}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='font-medium text-gray-900 text-sm leading-tight'>
                  {item.product?.name || item.name}
                </h4>
                <p className='text-xs text-gray-400 mt-0.5'>Qty: {item.quantity}</p>
              </div>
              <div className='text-right flex flex-col items-end gap-1.5 flex-shrink-0'>
                <p className='font-bold text-gray-900 text-sm'>₹{item.price * item.quantity}</p>
                <p className='text-xs text-gray-400'>₹{item.price} each</p>
                {isDelivered &&
                  item.product &&
                  (review ? (
                    <button
                      onClick={() => onViewReview(item.product.name, review!)}
                      className='text-yellow-500 hover:text-yellow-600 flex items-center gap-1 text-xs font-medium transition'
                    >
                      <Eye className='w-3 h-3' /> View Review
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenReview(item.product)}
                      className='text-pink-500 hover:text-pink-700 font-medium text-xs flex items-center gap-1 hover:underline transition'
                    >
                      <Star className='w-3 h-3' /> Write Review
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Main Order Details Page
// ──────────────────────────────────────────────────────────
export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    _id: string;
    name: string;
    orderId?: string;
  } | null>(null);

  const [viewReviewModalOpen, setViewReviewModalOpen] = useState(false);
  const [viewReviewData, setViewReviewData] = useState<{
    productName: string;
    review: ReviewData;
  } | null>(null);

  const [reviewedProducts, setReviewedProducts] = useState<Map<string, ReviewData>>(new Map());

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      fetchUserReviews();
    }
  }, [id]);

  const fetchUserReviews = async () => {
    try {
      const res = await api.get('/reviews/me');
      if (res.data.success) {
        const reviewMap = new Map<string, ReviewData>();
        res.data.data.forEach((r: any) => {
          if (r.product && r.orderId) {
            reviewMap.set(`${r.orderId}_${r.product}`, r);
          } else if (r.product) {
            reviewMap.set(r.product as string, r);
          }
        });
        setReviewedProducts(reviewMap);
      }
    } catch (error) {
      console.error('Failed to fetch user reviews', error);
    }
  };

  const refreshReviews = async () => {
    await fetchUserReviews();
  };

  const openReviewModal = (product: any) => {
    setSelectedProduct({ _id: product._id, name: product.name, orderId: id as string });
    setReviewModalOpen(true);
  };

  const openViewReviewModal = (productName: string, review: ReviewData) => {
    setViewReviewData({ productName, review });
    setViewReviewModalOpen(true);
  };

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.data);
      } else {
        toast.error('Failed to load order details');
        router.push('/profile/orders');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching order');
      router.push('/profile/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.'))
      return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`);
      if (res.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrderDetails();
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error cancelling order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-pink-600' />
      </div>
    );

  if (!order) return null;

  const isCancelled = order.status === 'CANCELLED' || order.orderStatus === 'CANCELLED';
  const isReturned = order.status === 'RETURNED' || order.orderStatus === 'RETURNED';

  // Group items by vendor
  const vendorMap = new Map<string, { vendorName: string; vendorId: string; items: any[] }>();
  (order.items || []).forEach((item: any) => {
    const vId = item.vendor?.toString() || item.product?.vendor?.toString() || 'unknown';
    const vName = item.vendorName || 'Store';
    if (!vendorMap.has(vId)) {
      vendorMap.set(vId, { vendorId: vId, vendorName: vName, items: [] });
    }
    vendorMap.get(vId)!.items.push(item);
  });

  const vendorGroups = Array.from(vendorMap.values());
  const isMultiVendor = vendorGroups.length > 1;

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-6'>
        <Link
          href='/profile/orders'
          className='text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 transition'
        >
          <ArrowLeft className='w-4 h-4' /> Back to Orders
        </Link>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Order #{order._id.substring(0, 8)}</h1>
            <p className='text-gray-500 text-sm mt-1'>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
            {isMultiVendor && (
              <p className='text-xs text-pink-600 font-medium mt-1 flex items-center gap-1'>
                <Store className='w-3.5 h-3.5' />
                {vendorGroups.length} vendors · {order.items.length} items
              </p>
            )}
          </div>

          <div className='flex items-center gap-3'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isCancelled
                  ? 'bg-red-100 text-red-700'
                  : isReturned
                    ? 'bg-orange-100 text-orange-700'
                    : order.status === 'PAID'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {isCancelled ? 'CANCELLED' : isReturned ? 'RETURNED' : order.status}
            </span>

            {!isCancelled &&
              !isReturned &&
              (order.orderStatus === 'PENDING' || order.orderStatus === 'PROCESSING') && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className='px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50 flex items-center gap-2 text-sm'
                >
                  {cancelling && <Loader2 className='w-4 h-4 animate-spin' />}
                  Cancel Order
                </button>
              )}
          </div>
        </div>
      </div>

      {/* ── Single Vendor: Classic full-width timeline ── */}
      {!isMultiVendor &&
        !isCancelled &&
        !isReturned &&
        (() => {
          const steps = [
            { status: 'PENDING', label: 'Order Placed', icon: Clock },
            { status: 'PROCESSING', label: 'Processing', icon: Package },
            { status: 'SHIPPED', label: 'Shipped', icon: Truck },
            { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
          ];
          const currentStepIndex = steps.findIndex(
            (s) => s.status === (order.orderStatus || 'PENDING'),
          );
          return (
            <div className='bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-6'>
              <div className='relative'>
                <div className='absolute top-5 left-[12.5%] w-[75%] h-1 bg-gray-100 -translate-y-1/2 z-0' />
                <div
                  className='absolute top-5 left-[12.5%] h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500'
                  style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 75)}%` }}
                />
                <div className='grid grid-cols-4 relative z-10'>
                  {steps.map((step, index) => {
                    const completed = index <= currentStepIndex;
                    const Icon = step.icon;
                    return (
                      <div key={step.status} className='flex flex-col items-center'>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300 ${
                            completed
                              ? 'border-green-500 text-green-600'
                              : 'border-gray-200 text-gray-300'
                          }`}
                        >
                          {completed ? (
                            <CheckCircle className='w-5 h-5 fill-green-500 text-white' />
                          ) : (
                            <Icon className='w-5 h-5' />
                          )}
                        </div>
                        <p
                          className={`mt-3 text-xs md:text-sm font-medium text-center ${completed ? 'text-gray-900' : 'text-gray-400'}`}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

      {isCancelled && (
        <div className='bg-red-50 p-6 rounded-xl border border-red-100 mb-6 flex items-center gap-4 text-red-800'>
          <XCircle className='w-6 h-6' />
          <div>
            <p className='font-bold'>Order Cancelled</p>
            <p className='text-sm'>This order has been cancelled.</p>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Column */}
        <div className='md:col-span-2 space-y-5'>
          {/* ── Multi-Vendor: Per-vendor tracking cards ── */}
          {isMultiVendor ? (
            <div className='space-y-4'>
              <div className='flex items-center gap-2 mb-1'>
                <Package className='w-5 h-5 text-gray-500' />
                <h3 className='font-bold text-gray-700'>Items by Vendor</h3>
              </div>
              {vendorGroups.map((group) => (
                <VendorTrackingCard
                  key={group.vendorId}
                  vendorName={group.vendorName}
                  vendorId={group.vendorId}
                  items={group.items}
                  tracking={order.tracking}
                  orderStatus={order.orderStatus}
                  isCancelled={isCancelled}
                  isReturned={isReturned}
                  orderId={id as string}
                  reviewedProducts={reviewedProducts}
                  onOpenReview={openReviewModal}
                  onViewReview={openViewReviewModal}
                />
              ))}
            </div>
          ) : (
            /* ── Single Vendor: Combined shipment info + items ── */
            <>
              {order.tracking && (
                <div className='bg-blue-50 p-6 rounded-xl border border-blue-100'>
                  <h3 className='font-bold text-blue-900 mb-4 flex items-center gap-2'>
                    <Truck className='w-5 h-5' /> Shipment Details
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-xs text-blue-500 uppercase font-semibold'>Courier</p>
                      <p className='text-blue-900 font-medium'>{order.tracking.courierName}</p>
                    </div>
                    <div>
                      <p className='text-xs text-blue-500 uppercase font-semibold'>
                        Tracking Number
                      </p>
                      <p className='text-blue-900 font-medium tracking-wide'>
                        {order.tracking.trackingNumber}
                      </p>
                    </div>
                    {order.tracking.trackingUrl && (
                      <div className='sm:col-span-2'>
                        <a
                          href={order.tracking.trackingUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline'
                        >
                          Track Shipment Details →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='p-4 border-b border-gray-100 bg-gray-50'>
                  <h3 className='font-bold text-gray-800 flex items-center gap-2'>
                    <Package className='w-5 h-5' /> Items
                  </h3>
                </div>
                <div className='divide-y divide-gray-100'>
                  {order.items.map((item: any, idx: number) => {
                    const reviewKey = `${order._id}_${item.product?._id || item.product}`;
                    let review = reviewedProducts.get(reviewKey);
                    if (!review && item.product?._id && reviewedProducts.has(item.product._id)) {
                      review = reviewedProducts.get(item.product._id);
                    }
                    const isDelivered =
                      order.status === 'DELIVERED' || order.orderStatus === 'DELIVERED';
                    return (
                      <div key={idx} className='p-4 flex gap-4'>
                        <div className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.product?.images?.[0] || item.image || '/placeholder.png'}
                            alt={item.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <h4 className='font-medium text-gray-900'>
                            {item.product?.name || item.name}
                          </h4>
                          {item.vendorName && (
                            <p className='text-xs text-pink-600 font-medium mt-0.5'>
                              Vendor: {item.vendorName}
                            </p>
                          )}
                          <p className='text-sm text-gray-500 mt-1'>Qty: {item.quantity}</p>
                        </div>
                        <div className='text-right flex flex-col items-end gap-2'>
                          <div>
                            <p className='font-bold text-gray-900'>₹{item.price * item.quantity}</p>
                            <p className='text-xs text-gray-500'>₹{item.price} each</p>
                          </div>
                          {isDelivered &&
                            item.product &&
                            (review ? (
                              <button
                                onClick={() => openViewReviewModal(item.product.name, review!)}
                                className='group flex flex-col items-end hover:bg-gray-100 p-2 rounded-lg transition'
                              >
                                <span className='text-gray-500 text-xs font-medium flex items-center gap-1 mb-1 group-hover:text-pink-600 transition'>
                                  <Eye className='w-3 h-3' /> View Review
                                </span>
                                <div className='flex text-yellow-400'>
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < review!.rating ? 'fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </button>
                            ) : (
                              <button
                                onClick={() => openReviewModal(item.product)}
                                className='text-pink-600 hover:text-pink-700 font-medium text-xs flex items-center gap-1 hover:underline mt-1'
                              >
                                <Star className='w-3 h-3' /> Write Review
                              </button>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Address & Summary */}
        <div className='space-y-6'>
          {/* Shipping Address */}
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <MapPin className='w-5 h-5 text-gray-400' /> Shipping Address
            </h3>
            <div className='text-sm text-gray-600 space-y-1'>
              <p className='font-medium text-gray-900'>{order.customer?.name}</p>
              <p>{order.customer?.address}</p>
              <p>
                {order.customer?.city}, {order.customer?.state}
              </p>
              <p>
                {order.customer?.country} - {order.customer?.pincode}
              </p>
              <p className='mt-2 text-gray-500'>{order.customer?.mobile}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <CreditCard className='w-5 h-5 text-gray-400' /> Payment Summary
            </h3>
            <div className='space-y-3 text-sm'>
              <div className='flex justify-between text-gray-600'>
                <span>Subtotal</span>
                <span>₹{order.vendorSubTotal || order.totalAmount}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Shipping</span>
                <span>
                  {order.vendorShippingTotal
                    ? order.vendorShippingTotal
                    : order.shippingCharge
                      ? `₹${order.shippingCharge}`
                      : 'Free'}
                </span>
              </div>
              {order.discount > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className='border-t pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900'>
                <span>Total</span>
                <span>₹{order.vendorGrandTotal}</span>
              </div>
            </div>
          </div>

          {/* Multi-vendor shipping breakdown */}
          {isMultiVendor &&
            order.vendorShippingCharges &&
            order.vendorShippingCharges.length > 0 && (
              <div className='bg-pink-50 p-5 rounded-xl border border-pink-100'>
                <h3 className='font-bold text-pink-900 mb-3 flex items-center gap-2 text-sm'>
                  <Truck className='w-4 h-4' /> Shipping Breakdown
                </h3>
                <div className='space-y-2'>
                  {vendorGroups.map((group) => {
                    const vShipping = order.vendorShippingCharges?.find(
                      (vs: any) => vs.vendor?.toString() === group.vendorId,
                    );
                    return (
                      <div key={group.vendorId} className='flex justify-between text-sm'>
                        <span className='text-pink-700'>{group.vendorName}</span>
                        <span className='font-medium text-pink-900'>
                          {vShipping?.charge ? `₹${vShipping.charge}` : 'Free'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Review Modals */}
      {selectedProduct && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          product={selectedProduct}
          orderId={(selectedProduct as any).orderId}
          onSuccess={refreshReviews}
        />
      )}

      {viewReviewData && (
        <ViewReviewModal
          isOpen={viewReviewModalOpen}
          onClose={() => setViewReviewModalOpen(false)}
          productName={viewReviewData.productName}
          review={viewReviewData.review}
        />
      )}
    </div>
  );
}
