'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, AlertTriangle, CheckCircle, Clock, XCircle, Loader2, Star, Eye } from 'lucide-react';
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

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    // Review Modal State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<{ _id: string; name: string; orderId?: string } | null>(null);

    // View Review Modal State
    const [viewReviewModalOpen, setViewReviewModalOpen] = useState(false);
    const [viewReviewData, setViewReviewData] = useState<{ productName: string; review: ReviewData } | null>(null);

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
                    // Key is now combination of orderId and productId to support multiple reviews per product in different orders
                    if (r.product && r.orderId) {
                        reviewMap.set(`${r.orderId}_${r.product}`, r);
                    } else if (r.product) { 
                        // Fallback for old reviews without orderId
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
        const productData = {
            _id: product._id,
            name: product.name
        };
        setSelectedProduct({ ...productData, orderId: id as string });
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
        if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;

        setCancelling(true);
        try {
            const res = await api.put(`/orders/${id}/cancel`);
            if (res.data.success) {
                toast.success('Order cancelled successfully');
                fetchOrderDetails(); // Refresh
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        </div>
    );

    if (!order) return null;

    const steps = [
        { status: 'PENDING', label: 'Order Placed', icon: Clock },
        { status: 'PROCESSING', label: 'Processing', icon: Package },
        { status: 'SHIPPED', label: 'Shipped', icon: Truck },
        { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === (order.orderStatus || 'PENDING'));
    const isCancelled = order.status === 'CANCELLED' || order.orderStatus === 'CANCELLED';
    const isReturned = order.status === 'RETURNED' || order.orderStatus === 'RETURNED';

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <Link href="/profile/orders" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 transition">
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            Order #{order._id.substring(0, 8)}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                isCancelled ? 'bg-red-100 text-red-700' :
                                isReturned ? 'bg-orange-100 text-orange-700' :
                                order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {isCancelled ? 'CANCELLED' : isReturned ? 'RETURNED' : order.status}
                            </span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    
                    {!isCancelled && !isReturned && (order.orderStatus === 'PENDING' || order.orderStatus === 'PROCESSING') && (
                        <button 
                            onClick={handleCancelOrder}
                            disabled={cancelling}
                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {cancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>

            {/* Timeline */}
            {!isCancelled && !isReturned && (
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-6">
                    <div className="relative">
                         {/* Progress Bar Background */}
                         {/* Spans from center of first item (12.5%) to center of last item (87.5%) = 75% width */}
                        <div className="absolute top-5 left-[12.5%] w-[75%] h-1 bg-gray-100 -translate-y-1/2 z-0" />
                        
                        {/* Progress Bar Fill */}
                        <div 
                            className="absolute top-5 left-[12.5%] h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500" 
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 75}%` }}
                        />

                        <div className="grid grid-cols-4 relative z-10">
                            {steps.map((step, index) => {
                                const completed = index <= currentStepIndex;
                                const Icon = step.icon;
                                return (
                                    <div key={step.status} className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white ${
                                            completed ? 'border-green-500 text-green-600' : 'border-gray-200 text-gray-300'
                                        }`}>
                                            {completed ? (
                                                <CheckCircle className="w-5 h-5 fill-green-500 text-white" />
                                            ) : (
                                                <Icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <p className={`mt-3 text-xs md:text-sm font-medium text-center ${completed ? 'text-gray-900' : 'text-gray-400'}`}>
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
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 mb-6 flex items-center gap-4 text-red-800">
                    <XCircle className="w-6 h-6" />
                    <div>
                        <p className="font-bold">Order Cancelled</p>
                        <p className="text-sm">This order has been cancelled.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Items & Tracking */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* Shipment Details */}
                    {order.tracking && (
                         <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5" /> Shipment Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-blue-500 uppercase font-semibold">Courier</p>
                                    <p className="text-blue-900 font-medium">{order.tracking.courierName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-500 uppercase font-semibold">Tracking Number</p>
                                    <p className="text-blue-900 font-medium tracking-wide">{order.tracking.trackingNumber}</p>
                                </div>
                                {order.tracking.trackingUrl && (
                                    <div className="sm:col-span-2">
                                        <a 
                                            href={order.tracking.trackingUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                        >
                                            Track Shipment Details &rarr;
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Package className="w-5 h-5" /> Items
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                         {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={item.product?.images?.[0] || item.image || '/placeholder.png'} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.product?.name || item.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div>
                                            <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                            <p className="text-xs text-gray-500">₹{item.price} each</p>
                                        </div>
                                        
                                        {/* Review Button */}
                                        {(order.status === 'DELIVERED' || order.orderStatus === 'DELIVERED') && item.product && (
                                            (() => {
                                                const reviewKey = `${order._id}_${item.product._id}`;
                                                // Check exact match first, then fallback to product ID match for legacy
                                                let review = reviewedProducts.get(reviewKey);
                                                if (!review && reviewedProducts.has(item.product._id)) {
                                                    // Only use fallback if we are sure it matches this context, but here explicit ID match is safer.
                                                    // Let's stick to explicit match for new system, but keep fallback if needed.
                                                    // Actually, for order details, we know the Order ID.
                                                    review = reviewedProducts.get(item.product._id);
                                                }

                                                return review ? (
                                                     <button 
                                                        onClick={() => openViewReviewModal(item.product.name, review!)}
                                                        className="group flex flex-col items-end hover:bg-gray-100 p-2 rounded-lg transition"
                                                        title="Click to view your review"
                                                    >
                                                        <span className="text-gray-500 text-xs font-medium flex items-center gap-1 mb-1 group-hover:text-pink-600 transition">
                                                            <Eye className="w-3 h-3" />
                                                            View Review
                                                        </span>
                                                        <div className="flex text-yellow-400">
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
                                                        className="text-pink-600 hover:text-pink-700 font-medium text-xs flex items-center gap-1 hover:underline mt-1"
                                                    >
                                                        <Star className="w-3 h-3" />
                                                        Write Review
                                                    </button>
                                                );
                                            })()
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Address & Summary */}
                <div className="space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" /> Shipping Address
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-900">{order.customer?.name}</p>
                            <p>{order.customer?.address}</p>
                            <p>{order.customer?.city}, {order.customer?.state}</p>
                            <p>{order.customer?.country} - {order.customer?.pincode}</p>
                            <p className="mt-2 text-gray-500">{order.customer?.mobile}</p>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                         <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-400" /> Payment Summary
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{order.subTotal || order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{order.shippingCharge ? `₹${order.shippingCharge}` : 'Free'}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discount}</span>
                                </div>
                            )}
                            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>
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
