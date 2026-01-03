
import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import api from '@/lib/api';

async function getProduct(id: string) {
  try {
      const res = await api.get(`/products/${id}?ignoreDeals=true`);
      return res.data.data;
  } catch (error) {
      return null;
  }
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
      return <div>Product not found</div>;
  }

  return <ProductForm initialData={product} isEditing={true} />;
}
