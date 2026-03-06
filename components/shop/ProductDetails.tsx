'use client';
import React, { useState, useEffect } from 'react';
import AddToCart from './AddToCart';
import ProductShare from './ProductShare';
import ProductGallery from './ProductGallery';
import { Star, ShieldCheck, Truck, RotateCcw, Store } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';

interface ProductDetailsProps {
  product: any;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [currentVariant, setCurrentVariant] = useState<any>(null);

  // Mongoose Map type fields may come as native Map objects or plain objects depending
  // on the serialization path. This helper normalizes either form to a plain JS object.
  const toPlainObject = (mapOrObj: any): Record<string, string> => {
    if (!mapOrObj) return {};
    if (typeof mapOrObj.get === 'function') {
      // Native Map or Mongoose Map instance
      const result: Record<string, string> = {};
      mapOrObj.forEach((value: string, key: string) => {
        result[key] = value;
      });
      return result;
    }
    return mapOrObj as Record<string, string>;
  };

  // Identify available option types from variants
  const getOptionsMap = () => {
    if (!product.variants || product.variants.length === 0) return {};

    const options: any = {};
    product.variants.forEach((v: any) => {
      if (v.options) {
        const plainOptions = toPlainObject(v.options);
        Object.keys(plainOptions).forEach((key) => {
          if (!options[key]) options[key] = new Set();
          options[key].add(plainOptions[key]);
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
        setSelectedOptions(toPlainObject(first.options));
        setCurrentVariant(first);
      }
    }
  }, [product]);

  useEffect(() => {
    // Find variant matching selected options
    if (product.variants && availableKeys.length > 0) {
      const match = product.variants.find((v: any) => {
        const plainOpts = toPlainObject(v.options);
        return availableKeys.every((key) => plainOpts[key] === selectedOptions[key]);
      });
      // Important to keep previous if we have a partial mismatch or we just select it
      if (match) {
        setCurrentVariant(match);
      }
    }
  }, [selectedOptions, product.variants, availableKeys]);

  const handleOptionSelect = (key: string, value: string) => {
    setSelectedOptions({ ...selectedOptions, [key]: value });
  };

  // Check if a specific option value leads to at least one in-stock variant
  const isOptionAvailable = (key: string, value: string): boolean => {
    if (!product.variants) return false;
    return product.variants.some((v: any) => {
      const plainOpts = toPlainObject(v.options);
      // Must match this value for the key, and match all other currently-selected keys
      if (plainOpts[key] !== value) return false;
      const otherKeys = availableKeys.filter((k) => k !== key);
      const otherMatch = otherKeys.every(
        (k) => !selectedOptions[k] || plainOpts[k] === selectedOptions[k],
      );
      return otherMatch && v.stock > 0;
    });
  };

  // Derived Display Data
  const displayPrice = currentVariant
    ? currentVariant.price
    : product.offerPrice > 0
      ? product.offerPrice
      : product.price;

  // If not variant, fall back to standard logic
  const isOffer = !currentVariant && product.offerPrice > 0;
  const strikePrice = isOffer ? product.price : null;
  const discount = isOffer
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : null;

  const { items: cart } = useCart();
  const currentStock = currentVariant ? currentVariant.stock : product.stock;

  const currentCartItem = cart.find(
    (item) =>
      item.product._id === product._id &&
      (currentVariant ? item.variant?._id === currentVariant._id : !item.variant),
  );

  const cartQuantity = currentCartItem ? currentCartItem.quantity : 0;
  const remainingStock = Math.max(0, currentStock - cartQuantity);

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

          {/* Vendor Details */}
          {product.vendor && (product.vendor.storeName || product.vendorName) && (
            <div className='mt-3 flex items-center gap-2'>
              <Store className='w-4 h-4 text-gray-400' />
              <span className='text-sm text-gray-500'>
                Sold by:{' '}
                {product.vendor.storeSlug ? (
                  <Link
                    href={`/vendor-store/${product.vendor.storeSlug}`}
                    className='font-bold text-gray-900 hover:text-pink-600 transition-colors'
                  >
                    {product.vendor.storeName || product.vendorName}
                  </Link>
                ) : (
                  <span className='font-bold text-gray-900'>
                    {product.vendor.storeName || product.vendorName}
                  </span>
                )}
              </span>
            </div>
          )}

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

        {/* ── Variant Selector ── */}
        {availableKeys.length > 0 && (
          <div className='space-y-6 border-t border-gray-100 pt-6'>
            {availableKeys.map((key) => (
              <div key={key}>
                {/* Option Header */}
                <div className='flex items-center gap-2 mb-3'>
                  <h3 className='text-sm font-bold text-gray-700 uppercase tracking-widest'>
                    {key}
                  </h3>
                  {selectedOptions[key] && (
                    <span className='text-xs font-semibold text-pink-600 bg-pink-50 border border-pink-200 rounded-full px-2.5 py-0.5'>
                      {selectedOptions[key]}
                    </span>
                  )}
                </div>

                {/* Option Pills */}
                <div className='flex flex-wrap gap-2.5'>
                  {Array.from(optionsMap[key] as Set<string>).map((val: any) => {
                    const isSelected = selectedOptions[key] === val;
                    const available = isOptionAvailable(key, val);

                    return (
                      <button
                        key={val}
                        onClick={() => available && handleOptionSelect(key, val)}
                        disabled={!available}
                        className={`
                          relative px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200
                          ${
                            isSelected
                              ? 'border-pink-600 bg-gradient-to-br from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-200 scale-105'
                              : available
                                ? 'border-gray-200 bg-white text-gray-700 hover:border-pink-400 hover:text-pink-600 hover:shadow-md'
                                : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                          }
                        `}
                        title={!available ? `${val} — Out of Stock` : val}
                      >
                        {val}
                        {/* Cross-out line for unavailable */}
                        {!available && (
                          <span className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                            <span className='w-full border-t border-gray-300 mx-3' />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Current Variant Status */}
            <div className='flex items-center gap-3 mt-2'>
              {currentVariant ? (
                <>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                      remainingStock > 10
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : remainingStock > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full inline-block ${
                        remainingStock > 10
                          ? 'bg-green-500'
                          : remainingStock > 0
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                    />
                    {remainingStock > 10
                      ? 'In Stock'
                      : remainingStock > 0
                        ? `Only ${remainingStock} left`
                        : 'Out of Stock (Max in Cart)'}
                  </span>
                  {currentVariant.sku && (
                    <span className='text-xs text-gray-400 font-mono'>
                      SKU: {currentVariant.sku}
                    </span>
                  )}
                </>
              ) : (
                <p className='text-sm text-red-500 font-medium'>
                  ⚠ This combination is not available
                </p>
              )}
            </div>
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
