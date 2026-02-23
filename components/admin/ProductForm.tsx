'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Plus, Trash2, Zap } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import { useAuth } from '@/lib/context/AuthContext';
import { useVendorAuth } from '@/lib/context/VendorAuthContext';

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
  isVendor?: boolean;
}

export default function ProductForm({
  initialData,
  isEditing = false,
  isVendor = false,
}: ProductFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { vendor, loading: vendorLoading } = useVendorAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]); // For Admin to assign vendors
  const [loading, setLoading] = useState(false);

  // Custom state for dynamic attributes
  const [attributeList, setAttributeList] = useState<{ key: string; value: string }[]>([
    { key: 'Material', value: '' },
  ]);

  // Variant States
  const [hasVariants, setHasVariants] = useState(false);
  const [optionTypes, setOptionTypes] = useState<{ name: string; valuesText: string }[]>([
    { name: 'Size', valuesText: '' },
  ]);
  const [variants, setVariants] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    offerPrice: '',
    stock: '',
    category: '',
    subcategory: '',
    vendor: '',
    images: [] as string[],
    isFeatured: false,
    isDeal: false,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        images: initialData.images || [],
        category: initialData.category?._id || initialData.category,
        vendor: initialData.vendor?._id || initialData.vendor || '',
      });

      if (initialData.attributes) {
        const attrs = Object.entries(initialData.attributes).map(([key, value]) => ({
          key,
          value: value as string,
        }));
        if (attrs.length > 0) {
          setAttributeList(attrs);
        }
      }

      if (initialData.variants && initialData.variants.length > 0) {
        setHasVariants(true);
        setVariants(initialData.variants);
        // Infer option types from first variant options to populate the generator fields if user wants to add more
        // This is imperfect but helps. Or just leave blank.
        // Actually better to try inferring so they can regenerate comfortably.
        // BUT we don't know the order.
        // Let's just leave it blank or default.
      }
    }
  }, [initialData]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data));

    // If Admin, fetch vendors to assign
    if (!isVendor) {
      api.get('/vendors/admin/all').then((res) => {
        if (res.data.success) {
          setVendors(res.data.data);
        }
      });
    }
  }, [isVendor]);

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev: any) => {
      const newData = { ...prev, [e.target.name]: value };
      if (e.target.name === 'name' && !isEditing) {
        newData.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      return newData;
    });
  };

  const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    const list = [...attributeList];
    list[index][field] = value;
    setAttributeList(list);
  };
  const addAttribute = () => setAttributeList([...attributeList, { key: '', value: '' }]);
  const removeAttribute = (index: number) => {
    const list = [...attributeList];
    list.splice(index, 1);
    setAttributeList(list);
  };

  // Variant Logic
  const handleOptionTypeChange = (index: number, field: 'name' | 'valuesText', value: string) => {
    const list = [...optionTypes];
    // @ts-ignore
    list[index][field] = value;
    setOptionTypes(list);
  };

  const addOptionType = () => setOptionTypes([...optionTypes, { name: '', valuesText: '' }]);
  const removeOptionType = (index: number) => {
    const list = [...optionTypes];
    list.splice(index, 1);
    setOptionTypes(list);
  };

  const generateVariants = () => {
    // Parse values from text
    const parsedOptionTypes = optionTypes.map((o) => ({
      name: o.name,
      values: o.valuesText
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== ''),
    }));

    if (parsedOptionTypes.length === 0 || parsedOptionTypes.some((o) => o.values.length === 0)) {
      alert('Please add at least one option type with values (e.g. Size: S, M)');
      return;
    }

    // Cartesian product helper
    const cartesian = (...a: any[]) =>
      a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));

    // Get array of value arrays: [['S','M'], ['Red','Blue']]
    const arrays = parsedOptionTypes.map((o) => o.values);
    const combinations = cartesian(...arrays);

    const newVariants = combinations.map((combo: any) => {
      const values = Array.isArray(combo) ? combo : [combo];

      const optionsMap: any = {};
      let nameParts: string[] = [];

      parsedOptionTypes.forEach((type, idx) => {
        optionsMap[type.name] = values[idx];
        nameParts.push(values[idx]);
      });

      return {
        name: nameParts.join(' - '),
        options: optionsMap,
        price: parseFloat(formData.price) || 0,
        stock: 0,
        sku: '',
        image: '',
      };
    });

    setVariants(newVariants);
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const list = [...variants];
    list[index] = { ...list[index], [field]: value };
    setVariants(list);
  };

  const removeVariant = (index: number) => {
    const list = [...variants];
    list.splice(index, 1);
    setVariants(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const attributesObj: any = {};
      attributeList.forEach((item) => {
        if (item.key && item.value) attributesObj[item.key] = item.value;
      });

      const payload = {
        ...formData,
        attributes: attributesObj,
        variants: hasVariants ? variants : [],
        ...(isVendor && vendor?.user?._id ? { vendor: vendor.user._id } : {}),
      };

      if (payload.category === '') {
        alert('Please select a category');
        setLoading(false);
        return;
      }

      if (isEditing && initialData) {
        await api.put(`/products/${initialData._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      if (isVendor) {
        router.push('/vendor/products');
      } else {
        router.push('/mahisadminpanel/products');
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-5xl mx-auto pb-20'>
      <div className='flex items-center mb-6 text-gray-500 hover:text-gray-800 transition w-fit'>
        <ArrowLeft className='w-4 h-4 mr-1' />
        <Link href={isVendor ? '/vendor/products' : '/mahisadminpanel/products'}>
          Back to Products
        </Link>
      </div>

      <h1 className='text-2xl font-bold mb-6'>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>

      <form
        onSubmit={handleSubmit}
        className='space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100'
      >
        {/* Basic Info */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium mb-1'>Product Name</label>
            <input
              required
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Slug (Unique URL)</label>
            <input
              required
              name='slug'
              value={formData.slug}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='e.g. pink-silk-thread'
            />
          </div>
        </div>

        {/* Vendor Selection (Admin Only) */}
        {!isVendor && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium mb-1 text-orange-700 font-bold'>
                Assign Vendor
              </label>
              <select
                name='vendor'
                value={formData.vendor || ''}
                onChange={handleChange}
                className='w-full p-2 border border-orange-200 rounded bg-orange-50'
              >
                <option value=''>Admin Product (Internal)</option>
                {vendors.map((v: any) => (
                  <option key={v._id} value={v.user?._id || v.user}>
                    {v.storeName} ({v.user?.name || 'No Name'})
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-500 mt-1'>
                Select which vendor owns this product. Leave empty for Admin products.
              </p>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <label className='block text-sm font-medium mb-1'>Base Price (₹)</label>
            <input
              required
              type='number'
              name='price'
              value={formData.price}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Offer Price (₹)</label>
            <input
              type='number'
              name='offerPrice'
              value={formData.offerPrice || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='Optional'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Total Stock</label>
            <input
              required={!hasVariants}
              type='number'
              name='stock'
              value={formData.stock}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              disabled={hasVariants}
              placeholder={hasVariants ? 'Calculated from variants' : '0'}
            />
            {hasVariants && <p className='text-xs text-gray-400 mt-1'>Sum of variant stocks</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium mb-1'>Category</label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Subcategory</label>
            <select
              name='subcategory'
              value={formData.subcategory || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              disabled={!formData.category}
            >
              <option value=''>Select Subcategory</option>
              {categories
                .find((c: any) => c._id === formData.category)
                ?.subcategories?.map((sub: any) => (
                  <option key={sub._id} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Description</label>
          <textarea
            required
            name='description'
            value={formData.description || ''}
            rows={4}
            onChange={handleChange}
            className='w-full p-2 border rounded'
          />
        </div>

        <div>
          <ImageUpload
            label='Product Images'
            multiple={true}
            folder='products'
            value={formData.images}
            onChange={(urls) => setFormData({ ...formData, images: urls as string[] })}
          />
        </div>

        {/* Variants Section */}
        <div className='border border-gray-200 rounded-lg p-6 bg-gray-50'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-bold text-gray-800'>Product Variants</h3>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
                className='w-4 h-4 text-pink-600 rounded focus:ring-pink-500'
              />
              <span className='text-sm font-medium text-gray-700'>Enable Variants</span>
            </div>
          </div>

          {hasVariants && (
            <div className='space-y-6'>
              {/* Option Types Definition */}
              <div className='bg-white p-4 rounded border border-gray-200'>
                <h4 className='text-sm font-bold mb-3 uppercase tracking-wide text-gray-500'>
                  Option Types
                </h4>
                {optionTypes.map((opt, idx) => (
                  <div key={idx} className='flex gap-4 mb-2 items-start'>
                    <input
                      placeholder='Name (e.g. Size)'
                      value={opt.name}
                      onChange={(e) => handleOptionTypeChange(idx, 'name', e.target.value)}
                      className='w-1/3 p-2 border rounded text-sm'
                    />
                    <input
                      placeholder='Values (comma separated, e.g. S, M, L)'
                      value={opt.valuesText || ''}
                      onChange={(e) => handleOptionTypeChange(idx, 'valuesText', e.target.value)}
                      className='flex-1 p-2 border rounded text-sm'
                    />
                    <button
                      type='button'
                      onClick={() => removeOptionType(idx)}
                      className='p-2 text-red-500 hover:bg-red-50 rounded'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={addOptionType}
                  className='text-sm text-pink-600 font-medium flex items-center mt-2'
                >
                  <Plus className='w-3 h-3 mr-1' /> Add Function
                </button>
              </div>

              <button
                type='button'
                onClick={generateVariants}
                className='bg-black text-white px-4 py-2 rounded text-sm font-bold flex items-center hover:bg-gray-800'
              >
                <Zap className='w-4 h-4 mr-2' />
                Generate Combinations
              </button>

              {/* Variants Table */}
              {variants.length > 0 && (
                <div className='overflow-x-auto bg-white border border-gray-200 rounded'>
                  <table className='w-full text-sm text-left'>
                    <thead className='bg-gray-100 text-gray-600 font-medium uppercase text-xs'>
                      <tr>
                        <th className='px-4 py-3'>Variant</th>
                        <th className='px-4 py-3 w-16'>Image</th>
                        <th className='px-4 py-3 w-32'>Price (₹)</th>
                        <th className='px-4 py-3 w-24'>Stock</th>
                        <th className='px-4 py-3 w-32'>SKU</th>
                        <th className='px-4 py-3 w-10'></th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {variants.map((v, i) => (
                        <tr key={i}>
                          <td className='px-4 py-2 font-medium'>{v.name}</td>
                          <td className='px-4 py-2'>
                            <div className='w-12 h-12 relative overflow-hidden rounded border border-gray-200 bg-gray-50 flex items-center justify-center'>
                              {v.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={v.image} alt='' className='w-full h-full object-cover' />
                              ) : (
                                <span className='text-xs text-gray-400'>Img</span>
                              )}
                              <div className='absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity'>
                                <ImageUpload
                                  label=''
                                  multiple={false}
                                  folder='variants'
                                  value={v.image ? [v.image] : []}
                                  onChange={(url) => handleVariantChange(i, 'image', url as string)}
                                />
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-2'>
                            <input
                              type='number'
                              value={v.price ?? ''}
                              onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                              className='w-full p-1 border rounded'
                            />
                          </td>
                          <td className='px-4 py-2'>
                            <input
                              type='number'
                              value={v.stock ?? ''}
                              onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                              className='w-full p-1 border rounded'
                            />
                          </td>
                          <td className='px-4 py-2'>
                            <input
                              type='text'
                              value={v.sku || ''}
                              onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                              className='w-full p-1 border rounded'
                            />
                          </td>
                          <td className='px-4 py-2 text-center'>
                            <button
                              type='button'
                              onClick={() => removeVariant(i)}
                              className='text-red-400 hover:text-red-600'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Attributes */}
        <div>
          <label className='block text-sm font-medium mb-2'>
            Additional Details (Specifications)
          </label>
          <div className='space-y-3'>
            {attributeList.map((attr, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <input
                  placeholder='Key (e.g. Material)'
                  value={attr.key}
                  onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                  className='flex-1 p-2 border rounded text-sm'
                />
                <input
                  placeholder='Value (e.g. Silk)'
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  className='flex-1 p-2 border rounded text-sm'
                />
                <button
                  type='button'
                  onClick={() => removeAttribute(index)}
                  className='p-2 text-red-500 hover:bg-red-50 rounded'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            ))}
          </div>
          <button
            type='button'
            onClick={addAttribute}
            className='mt-2 text-sm text-pink-600 font-medium flex items-center hover:text-pink-700'
          >
            <Plus className='w-4 h-4 mr-1' /> Add Detail
          </button>
        </div>

        {!isVendor && (
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center space-x-2 bg-gray-50 p-3 rounded border border-gray-100 w-fit'>
              <input
                type='checkbox'
                name='isFeatured'
                checked={formData.isFeatured}
                onChange={handleChange}
                className='rounded w-4 h-4 text-pink-600 focus:ring-pink-500'
              />
              <span className='text-sm font-medium'>Feature this product</span>
            </div>

            <div className='flex items-center space-x-2 bg-yellow-50 p-3 rounded border border-yellow-100 w-fit'>
              <input
                type='checkbox'
                name='isDeal'
                checked={formData.isDeal}
                onChange={handleChange}
                className='rounded w-4 h-4 text-yellow-600 focus:ring-yellow-500'
              />
              <span className='text-sm font-medium text-yellow-800'>Deal of the Day</span>
            </div>
          </div>
        )}

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center'
        >
          {loading ? <Loader2 className='animate-spin mr-2' /> : <Save className='w-4 h-4 mr-2' />}
          {isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
