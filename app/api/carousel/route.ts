import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Carousel from '@/lib/models/Carousel';

export async function GET() {
  await dbConnect();
  try {
    const items = await Carousel.find({}).sort({ order: 1 }).limit(5);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch carousel items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const item = await Carousel.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create carousel item' }, { status: 400 });
  }
}
