import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import razorpay from '@/lib/razorpay';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { customer, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400 });
    }

    // Verify prices and calculate total
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for: ${product.name}`);
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      verifiedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create Razorpay Order
    const options = {
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create Order in DB
    const newOrder = await Order.create({
      customer,
      items: verifiedItems,
      totalAmount,
      status: 'PENDING',
      orderId: razorpayOrder.id,
    });

    return NextResponse.json({ success: true, order: newOrder, razorpayOrderId: razorpayOrder.id });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
