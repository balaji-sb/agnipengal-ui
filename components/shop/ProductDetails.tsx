'use client';
import React, { useState, useEffect } from 'react';
import AddToCart from './AddToCart';
import ProductShare from './ProductShare';
import ProductGallery from './ProductGallery';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface ProductDetailsProps {
  product: any;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [currentVariant, setCurrentVariant] = useState<any>(null);

  // Identify available option types from variants
  const getOptionsMap = () => {
    if (!product.variants || product.variants.length === 0) return {};

    const options: any = {};
    product.variants.forEach((v: any) => {
      if (v.options) {
        Object.keys(v.options).forEach((key) => {
          if (!options[key]) options[key] = new Set();
          options[key].add(v.options[key]);
        });
      }
    });
    return options;
  };

  const optionsMap = getOptionsMap();
  const availableKeys = Object.keys(optionsMap);

  useEffect(() => {
    // Auto select first variant's options on load
    if (product.variants && product.variants.length > 0 && !currentVariant) {
      const first = product.variants[0];
      if (first && first.options) {
        setSelectedOptions(first.options);
        setCurrentVariant(first);
      }
    }
  }, [product]);

  useEffect(() => {
    // Find variant matching selected options
    if (product.variants && availableKeys.length > 0) {
      const match = product.variants.find((v: any) => {
        return availableKeys.every((key) => v.options[key] === selectedOptions[key]);
      });
      setCurrentVariant(match || null);
    }
  }, [selectedOptions]);

  const handleOptionSelect = (key: string, value: string) => {
    setSelectedOptions({ ...selectedOptions, [key]: value });
  };

  // Derived Display Data
  const displayPrice = currentVariant
    ? currentVariant.price
    : product.offerPrice > 0
      ? product.offerPrice
      : product.price;
  const originalPrice = currentVariant ? null : product.price; // Show strike-through only if base product has offer

  // If not variant, fall back to standard logic
  const isOffer = !currentVariant && product.offerPrice > 0;
  const strikePrice = isOffer ? product.price : null;
  const discount = isOffer
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : null;

  const currentStock = currentVariant ? currentVariant.stock : product.stock;

  // Calculate images for gallery
  // If variant has image, prepend it to the list.
  // If no variant image, just show product images.
  const displayImages =
    currentVariant && currentVariant.image
      ? [currentVariant.image, ...product.images]
      : product.images;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16'>
      {/* Left Column: Gallery */}
      <div>
        <ProductGallery images={displayImages} productName={product.name} />
      </div>

      {/* Right Column: Details */}
      <div className='space-y-8'>
        <div>
          <span className='text-sm font-semibold text-pink-600 uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full'>
            {product.category?.name || 'Category'}
          </span>
          <div className='flex justify-between items-start mt-4 gap-4'>
            <h1 className='text-4xl lg:text-5xl font-bold text-gray-900 leading-tight'>
              {product.name}
            </h1>
            <ProductShare productName={product.name} productSlug={product.slug} />
          </div>

          {/* Rating Summary */}
          <div className='mt-2 flex items-center gap-2'>
            <div className='flex bg-orange-600 text-white px-2 py-0.5 rounded text-sm font-bold items-center gap-1'>
              <span>{product.rating?.toFixed(1) || 0}</span>
              <Star className='w-3 h-3 fill-current' />
            </div>
            <a
              href='#reviews'
              className='text-sm text-gray-500 hover:text-pink-600 hover:underline'
            >
              {product.numReviews || 0} ratings
            </a>
          </div>

          <div className='mt-4 flex items-end gap-4'>
            <p className='text-3xl font-bold text-gray-900'>
              ₹{displayPrice.toLocaleString('en-IN')}
            </p>
            {strikePrice && (
              <>
                <p className='text-lg text-gray-400 line-through mb-1'>
                  ₹{strikePrice.toLocaleString('en-IN')}
                </p>
                <span className='bg-pink-100 text-pink-700 px-2 py-1 rounded font-bold text-sm mb-1.5'>
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        <div className='prose prose-gray prose-lg'>
          <p>{product.description}</p>
        </div>

        {/* Variants Selection */}
        {availableKeys.length > 0 && (
          <div className='space-y-4 border-t border-gray-100 pt-6'>
            {availableKeys.map((key) => (
              <div key={key}>
                <h3 className='text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide'>
                  {key}
                </h3>
                <div className='flex flex-wrap gap-3'>
                  {Array.from(optionsMap[key] as Set<string>).map((val: any) => {
                    const isSelected = selectedOptions[key] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleOptionSelect(key, val)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          isSelected
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {!currentVariant && <p className='text-sm text-red-500'>Combination not available</p>}
          </div>
        )}

        {/* Static Attributes Grid */}
        {product.attributes && Object.keys(product.attributes).length > 0 && (
          <div className='bg-gray-50 rounded-xl p-6 grid grid-cols-2 gap-y-4 gap-x-8'>
            {Object.entries(product.attributes).map(([key, value]) => (
              <div key={key}>
                <span className='block text-xs uppercase tracking-wide text-gray-500 mb-1'>
                  {key}
                </span>
                <span className='font-medium text-gray-900'>{value as string}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className='pt-6 border-t border-gray-100'>
          <AddToCart
            product={product}
            variant={currentVariant}
            disabled={availableKeys.length > 0 && !currentVariant}
          />
        </div>

        {/* Trust Badges */}
        <div className='grid grid-cols-3 gap-4 pt-4'>
          <div className='flex flex-col items-center text-center gap-2'>
            <div className='w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600'>
              <ShieldCheck className='w-5 h-5' />
            </div>
            <span className='text-xs font-medium text-gray-600'>Secure Payment</span>
          </div>
          <div className='flex flex-col items-center text-center gap-2'>
            <div className='w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600'>
              <Truck className='w-5 h-5' />
            </div>
            <span className='text-xs font-medium text-gray-600'>Fast Shipping</span>
          </div>
          <div className='flex flex-col items-center text-center gap-2'>
            <div className='w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600'>
              <RotateCcw className='w-5 h-5' />
            </div>
            <span className='text-xs font-medium text-gray-600'>Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
