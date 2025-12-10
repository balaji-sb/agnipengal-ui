import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  try {
    const filter: any = {};
    if (search) {
        filter.name = new RegExp(search, 'i');
    }
    const categories = await Category.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 400 });
  }
}
