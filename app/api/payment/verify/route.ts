
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment Verified
      
      // Update Order
      const order = await Order.findOne({ orderId: razorpay_order_id });
      
      if (!order) {
           return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }

      order.status = 'PAID';
      order.paymentId = razorpay_payment_id;
      await order.save();

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: order._id
      });
    } else {
        return NextResponse.json({
            success: false,
            error: 'Invalid signature'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Payment verification failed'
    }, { status: 500 });
  }
}
