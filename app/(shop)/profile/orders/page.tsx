'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Package, Star, Eye } from 'lucide-react';
import api from '@/lib/api';
import ReviewModal from '@/components/shop/ReviewModal';
import ViewReviewModal from '@/components/shop/ViewReviewModal';

interface ReviewData {
  rating: number;
  comment: string;
  createdAt: string;
  product: string;
  media?: { url: string; type: 'image' | 'video' }[];
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Write Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    _id: string;
    name: string;
    orderId?: string;
  } | null>(null);

  // View Review Modal State
  const [viewReviewModalOpen, setViewReviewModalOpen] = useState(false);
  const [viewReviewData, setViewReviewData] = useState<{
    productName: string;
    review: ReviewData;
  } | null>(null);

  const [reviewedProducts, setReviewedProducts] = useState<Map<string, ReviewData>>(new Map());

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user) {
      fetchOrders();
      fetchUserReviews();
    }
  }, [user, authLoading, router]);

  // Fetch Orders
  const fetchOrders = async () => {
    if (user) {
      try {
        const res = await api.get('/orders/myorders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoadingOrders(false);
      }
    }
  };

  // Fetch User Reviews to check what has been reviewed
  const fetchUserReviews = async () => {
    if (user) {
      try {
        const res = await api.get('/reviews/me');
        if (res.data.success) {
          const reviewMap = new Map<string, ReviewData>();
          res.data.data.forEach((r: any) => {
            // Key is now combination of orderId and productId to support multiple reviews per product in different orders
            if (r.product && r.orderId) {
              reviewMap.set(`${r.orderId}_${r.product}`, r);
            } else if (r.product) {
              // Fallback for old reviews without orderId (though we are adding it now)
              reviewMap.set(r.product as string, r);
            }
          });
          setReviewedProducts(reviewMap);
        }
      } catch (error) {
        console.error('Failed to fetch user reviews', error);
      }
    }
  };

  const refreshReviews = async () => {
    await fetchUserReviews();
  };

  const openReviewModal = (product: any, orderId: string) => {
    const productData = {
      _id: product._id,
      name: product.name,
    };
    setSelectedProduct({ ...productData, orderId });
    setReviewModalOpen(true);
  };

  const openViewReviewModal = (productName: string, review: ReviewData) => {
    setViewReviewData({ productName, review });
    setViewReviewModalOpen(true);
  };

  if (authLoading) return <div className='p-8 text-center'>Loading...</div>;
  if (!user) return null;

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>My Orders</h1>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8'>
        <h2 className='text-xl font-bold mb-6 flex items-center'>
          <Package className='w-6 h-6 mr-2 text-pink-600' />
          Order History
        </h2>

        {loadingOrders ? (
          <div className='text-center py-8 text-gray-500'>Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className='space-y-6'>
            {orders.map((order: any) => (
              <div
                key={order._id}
                className='border border-gray-100 rounded-lg p-6 hover:shadow-md transition'
              >
                <div className='flex flex-col md:flex-row justify-between md:items-center mb-4 pb-4 border-b border-gray-50'>
                  <div>
                    <span className='text-sm text-gray-500'>Order ID:</span>
                    <span className='ml-2 font-mono text-sm font-bold text-gray-700'>
                      #{order._id.substring(0, 8)}
                    </span>
                    <div className='text-sm text-gray-500 mt-1'>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className='mt-2 md:mt-0 flex items-center gap-3'>
                    <div className='flex flex-col items-end gap-1'>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        PAYMENT: {order.status}
                      </span>
                      {order.orderStatus &&
                        (() => {
                          const status = order.orderStatus.toUpperCase();
                          let colorClass = 'bg-gray-100 text-gray-800';

                          switch (status) {
                            case 'PENDING':
                              colorClass = 'bg-yellow-100 text-yellow-800';
                              break;
                            case 'PROCESSING':
                              colorClass = 'bg-blue-100 text-blue-800';
                              break;
                            case 'SHIPPED':
                              colorClass = 'bg-indigo-100 text-indigo-800';
                              break;
                            case 'DELIVERED':
                              colorClass = 'bg-green-100 text-green-800';
                              break;
                            case 'CANCELLED':
                              colorClass = 'bg-red-100 text-red-800';
                              break;
                            case 'RETURNED':
                              colorClass = 'bg-orange-100 text-orange-800';
                              break;
                          }

                          return (
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${colorClass}`}
                            >
                              STATUS: {order.orderStatus}
                            </span>
                          );
                        })()}
                    </div>
                    <span className='font-bold text-lg text-gray-900'>₹{order.subTotal}</span>
                    <button
                      onClick={() => router.push(`/profile/orders/${order._id}`)}
                      className='text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center gap-1 hover:underline ml-4'
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className='space-y-4'>
                  {order.items.map((item: any, idx: number) => {
                    // Check if this specific product in this specific order has a review
                    // We check for orderId_productId first, then fallback to productId (for legacy)
                    let review = undefined;
                    if (item.product) {
                      review = reviewedProducts.get(`${order._id}_${item.product._id}`);
                      if (!review && reviewedProducts.has(item.product._id)) {
                        review = reviewedProducts.get(item.product._id);
                      }
                    }

                    const isDelivered = order.orderStatus?.toLowerCase() === 'delivered';

                    return (
                      <div
                        key={idx}
                        className='flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg'
                      >
                        <div>
                          <span className='font-medium text-gray-900 block'>
                            {item.product?.name || item.name || 'Unknown Product'}
                          </span>
                          {item.vendorName && (
                            <span className='text-[10px] text-pink-600 font-medium block -mt-0.5'>
                              Vendor: {item.vendorName}
                            </span>
                          )}
                          <span className='text-gray-500 text-xs'>Qty: {item.quantity}</span>
                        </div>
                        <div className='flex items-center gap-4'>
                          <span className='font-medium text-gray-900'>₹{item.price}</span>
                          {/* Only show review UI if delivered */}
                          {isDelivered &&
                            item.product &&
                            (review ? (
                              <button
                                onClick={() => openViewReviewModal(item.product.name, review)}
                                className='group flex flex-col items-end hover:bg-gray-100 p-2 rounded-lg transition'
                                title='Click to view your review'
                              >
                                <span className='text-gray-500 text-xs font-medium flex items-center gap-1 mb-1 group-hover:text-pink-600 transition'>
                                  <Eye className='w-3 h-3' />
                                  View Review
                                </span>
                                <div className='flex text-yellow-400'>
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </button>
                            ) : (
                              <button
                                onClick={() => openReviewModal(item.product, order._id)}
                                className='text-pink-600 hover:text-pink-700 font-medium text-xs flex items-center gap-1 hover:underline'
                              >
                                <Star className='w-3 h-3' />
                                Write Review
                              </button>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12 bg-gray-50 rounded-lg'>
            <p className='text-gray-500'>No recent orders found.</p>
          </div>
        )}
      </div>

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
