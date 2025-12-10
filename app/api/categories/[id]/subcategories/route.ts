
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import mongoose from 'mongoose';

// POST: Add a new subcategory
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  try {
    const body = await request.json(); // Expect { name, slug }
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Basic validation
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 });
    }
    
    // Check for duplicate slug within this category
    const slugExists = category.subcategories.some((sub: any) => sub.slug === body.slug);
    if (slugExists) {
        return NextResponse.json({ success: false, error: 'Subcategory with this slug already exists' }, { status: 400 });
    }

    category.subcategories.push(body);
    await category.save();

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add subcategory' }, { status: 500 });
  }
}

// PUT: Update a subcategory
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  try {
    const body = await request.json(); // Expect { subId, name, slug }
    const { subId, name, slug } = body;

    if (!subId) {
       return NextResponse.json({ success: false, error: 'Subcategory ID is required' }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const subcat = category.subcategories.id(subId);
    if (!subcat) {
      return NextResponse.json({ success: false, error: 'Subcategory not found' }, { status: 404 });
    }

    if (name) subcat.name = name;
    if (slug) subcat.slug = slug;

    await category.save();

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
      console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to update subcategory' }, { status: 500 });
  }
}

// DELETE: Remove a subcategory
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const subId = searchParams.get('subId');

    if (!subId) {
      return NextResponse.json({ success: false, error: 'Subcategory ID is required' }, { status: 400 });
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Use pull to remove the subdocument
    category.subcategories.pull({ _id: subId });
    await category.save();

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete subcategory' }, { status: 500 });
  }
}
