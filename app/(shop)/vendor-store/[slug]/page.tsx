'use client';

import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import {
  Phone,
  Mail,
  Grid,
  Store,
  AlertCircle,
  ShoppingCart,
  Eye,
  MapPin,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import Carousel from '@/components/shop/Carousel';
import { useCart } from '@/lib/context/CartContext';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  offerPrice?: number;
  images: string[];
  description: string;
  category: { name: string; slug: string };
  stock: number;
  vendor?: { storeName: string };
}

interface Vendor {
  _id: string;
  storeName: string;
  storeDescription: string;
  phone: string;
  category: { name: string } | null;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
}

export default function VendorSubdomainStore() {
  const { addItem } = useCart();
  const { slug } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;

        const vendorRes = await api.get(`/vendors/public/${slug}`);
        if (vendorRes.data.success) {
          const vendorData = vendorRes.data.data;
          setVendor(vendorData);

          if (vendorData.user && vendorData.user._id) {
            const productRes = await api.get(`/products?vendor=${vendorData.user._id}`);
            if (productRes.data.success) {
              setProducts(productRes.data.data);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching shop details:', err);
        setError(err.response?.data?.error || 'Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Derived Categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.name) {
        cats.add(p.category.name);
      }
    });
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((p) => p.category?.name === selectedCategory);
  }, [products, selectedCategory]);

  // Recently Added Products mapped for the Hero Carousel
  const carouselItems = useMemo(() => {
    const recent = [...products].slice(0, 5);
    return recent.map((p) => ({
      id: p._id,
      image:
        p.images?.[0] ||
        'https://images.unsplash.com/photo-1605369651713-33e10bdcecfd?auto=format&fit=crop&q=80',
      title: p.name,
      link: `/product/${p.slug}?id=${p._id}`,
    }));
  }, [products]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='animate-pulse flex flex-col items-center'>
          <div className='w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4' />
          <div className='text-gray-400 font-medium'>Loading Storefront...</div>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
        <div className='text-center p-12 bg-white rounded-[2rem] shadow-xl max-w-lg w-full border border-gray-100'>
          <div className='w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6'>
            <AlertCircle className='w-12 h-12 text-red-500' />
          </div>
          <h2 className='text-3xl font-extrabold text-gray-900 mb-3'>Store Not Found</h2>
          <p className='text-gray-500 mb-8 text-lg'>
            {error || "This store doesn't exist or is currently unavailable."}
          </p>
          <Link
            href='/'
            className='inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl hover:bg-gray-800'
          >
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#F8F9FA] min-h-screen pb-24 font-sans'>
      {/* Hero Carousel (Recent Products) */}
      <div className='w-full bg-gray-900 relative z-10'>
        {carouselItems.length > 0 ? (
          <Carousel items={carouselItems} />
        ) : (
          <div className='w-full h-[40vh] bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center'>
            <Store className='w-16 h-16 text-gray-700' />
          </div>
        )}
      </div>

      {/* Store Info Banner - Overlapping the carousel slightly */}
      <div className='container mx-auto px-4 relative z-20 -mt-10 md:-mt-16 mb-8'>
        <div className='bg-white/90 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-2xl border border-white/60 flex flex-col md:flex-row items-center md:items-start gap-6'>
          {/* Store Avatar */}
          <div className='w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-[1.5rem] bg-gradient-to-br from-pink-50 to-gray-100 flex items-center justify-center text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-purple-600 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-white mt-0 md:mt-0 transform transition-transform hover:scale-105'>
            {vendor.storeName.charAt(0).toUpperCase()}
          </div>

          {/* Store Info */}
          <div className='flex-grow text-center md:text-left w-full'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
              <div>
                <div className='flex items-center justify-center md:justify-start gap-3 mb-2'>
                  <h1 className='text-3xl md:text-4xl font-black tracking-tight text-gray-900'>
                    {vendor.storeName}
                  </h1>
                  {vendor.status === 'active' && (
                    <span className='flex h-3 w-3 relative'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
                    </span>
                  )}
                </div>
                <p className='text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed'>
                  {vendor.storeDescription || 'Welcome to our official store on the marketplace.'}
                </p>
                <div className='mt-3'>
                  <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider'>
                    <Grid className='w-3 h-3' />
                    {vendor.category?.name || 'Verified Partner'}
                  </span>
                </div>
              </div>

              {/* Contact Actions */}
              <div className='flex flex-wrap items-center justify-center gap-3 shrink-0'>
                <div className='flex items-center gap-2 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors'>
                  <Phone className='w-4 h-4 text-gray-500' />
                  <span className='text-sm font-bold text-gray-700'>
                    {(vendor.phone && '******' + vendor.phone.slice(7, 10)) || 'N/A'}
                  </span>
                </div>
                <a
                  href={`mailto:${vendor.user.email}`}
                  className='flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-pink-600 hover:shadow-xl transition-all duration-300 group'
                >
                  <Mail className='w-4 h-4 group-hover:animate-bounce border-transparent' />
                  <span className='text-sm font-bold'>Message Vendor</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='container mx-auto px-4 pt-12 md:pt-16'>
        {/* Navigation / Filters */}
        <div className='mb-12'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3'>
              <Grid className='w-8 h-8 text-pink-600' />
              Discover Products
              <span className='bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full align-middle'>
                {filteredProducts.length}
              </span>
            </h2>
          </div>

          {/* Category Pills */}
          {categories.length > 1 && (
            <div className='flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0'>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-gray-900 text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className='bg-white rounded-[2rem] p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[40vh]'>
            <div className='w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6'>
              <Search className='w-10 h-10 text-gray-400' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>No Products Found</h3>
            <p className='text-gray-500 max-w-md mx-auto'>
              {selectedCategory === 'All'
                ? "This vendor hasn't added any products to their store yet."
                : `No products available in the "${selectedCategory}" category.`}
            </p>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className='mt-6 text-pink-600 font-bold hover:text-pink-700 underline underline-offset-4'
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10'>
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className='group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(6,81,237,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col'
              >
                {/* Product Image Container */}
                <Link
                  href={`/product/${product.slug}?id=${product._id}`}
                  className='block aspect-[4/5] relative overflow-hidden bg-[#F8F9FA] p-6'
                >
                  <div className='relative w-full h-full flex items-center justify-center'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className='object-contain w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out mix-blend-multiply drop-shadow-xl'
                      />
                    ) : (
                      <Store className='w-20 h-20 text-gray-200' />
                    )}
                  </div>

                  {/* Enhanced Badges */}
                  <div className='absolute top-4 left-4 flex flex-col gap-2 z-10'>
                    {product.offerPrice && product.offerPrice > 0 && product.stock > 0 && (
                      <span className='bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-md uppercase'>
                        Sale
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className='bg-gray-900 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-md uppercase backdrop-blur-md'>
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Quick Actions (Hover) */}
                  <div className='absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex gap-2 z-20'>
                    <button className='flex-1 bg-white/90 backdrop-blur-md text-gray-900 font-bold py-3 rounded-xl shadow-lg hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center gap-2'>
                      <Eye className='w-4 h-4' />
                      Quick View
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addItem(product);
                      }}
                      className={`w-12 h-12 shrink-0 rounded-xl shadow-lg flex items-center justify-center transition-colors ${
                        product.stock === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-pink-600 text-white hover:bg-pink-700 active:scale-90'
                      }`}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className='w-5 h-5' />
                    </button>
                  </div>
                </Link>

                {/* Product Info */}
                <div className='p-6 flex flex-col grow'>
                  <div className='mb-auto'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-xs font-bold text-pink-600 tracking-wide uppercase'>
                        {product.category?.name || 'General'}
                      </span>
                      {product.stock > 0 && product.stock < 5 && (
                        <span className='text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md'>
                          Only {product.stock} left
                        </span>
                      )}
                    </div>

                    <Link href={`/product/${product.slug}?id=${product._id}`}>
                      <h3 className='font-extrabold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors'>
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className='mt-4 pt-4 border-t border-gray-100 flex items-end justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-xs text-gray-400 font-medium mb-1'>Price</span>
                      {product.offerPrice && product.offerPrice > 0 ? (
                        <div className='flex items-baseline gap-2'>
                          <span className='text-xl font-black text-gray-900'>
                            ₹{product.offerPrice.toLocaleString('en-IN')}
                          </span>
                          <span className='text-sm text-gray-400 font-medium line-through'>
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ) : (
                        <span className='text-xl font-black text-gray-900'>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
