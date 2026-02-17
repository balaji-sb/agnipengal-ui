'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import api from '@/lib/api';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      api
        .get(`/products/${params.id}`)
        .then((res) => {
          setProduct(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) return <div className='p-8 text-center'>Loading...</div>;
  if (!product) return <div className='p-8 text-center'>Product not found</div>;

  return <ProductForm initialData={product} isEditing={true} isVendor={true} />;
}
