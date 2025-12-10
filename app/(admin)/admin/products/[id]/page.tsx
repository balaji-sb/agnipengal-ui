
import React from 'react';
import dbConnect from '@/lib/db';
import ProductModel from '@/lib/models/Product';
import ProductForm from '@/components/admin/ProductForm';

async function getProduct(id: string) {
  await dbConnect();
  const product = await ProductModel.findById(id).populate('category').lean();
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
      return <div>Product not found</div>;
  }

  return <ProductForm initialData={product} isEditing={true} />;
}
