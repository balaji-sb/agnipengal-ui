import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category'); // ID or Slug? Model uses ObjectId ref but slug might be passed. 
  // Wait, Product model has category ref (ObjectId). Frontend might pass slug if utilizing that map, but easier to filtering by category ID if available. 
  // Or I should look up category by slug first.
  // Actually, Product model has `subcategory` (string slug).
  // Let's assume for now we might filter by subcategory slug directly.
  const subcategory = searchParams.get('subcategory');
  const search = searchParams.get('search');
  
  const filter: any = {};
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { slug: searchRegex }
    ];
  }

  let sortOption: any = { createdAt: -1 }; // Default newest
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  // Popularity? needing sales count or view count. For now ignore.

  try {
    const products = await Product.find(filter).sort(sortOption).populate('category', 'name slug');
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ success: true, data: { mock: true, _id: '123' } }, { status: 201 });
}
