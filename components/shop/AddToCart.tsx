'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

interface AddToCartProps {
  product: any;
  variant?: any;
  disabled?: boolean;
}

export default function AddToCart({ product, variant, disabled = false }: AddToCartProps) {
  const { addItem, items: cart, updateQuantity } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const stock = variant ? variant.stock : product.stock;

  // CartContext stores items as { product, quantity, variant } — so we access item.product._id
  const currentCartItem = cart.find(
    (item) =>
      item.product._id === product._id &&
      (variant ? item.variant?._id === variant._id : !item.variant),
  );
  console.log('currentCartItem', currentCartItem);
  const cartQuantity = currentCartItem ? currentCartItem.quantity : 0;

  console.log(stock, cartQuantity);
  const remainingStock = Math.max(0, stock - cartQuantity);
  const isMaxedOut = remainingStock === 0;
  const isInCart = cartQuantity > 0;

  const handleDecrement = () => {
    if (isInCart) {
      updateQuantity(product._id, cartQuantity - 1, variant?._id);
    } else if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (isInCart) {
      if (cartQuantity < stock) {
        updateQuantity(product._id, cartQuantity + 1, variant?._id);
      }
    } else if (quantity < remainingStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity > remainingStock) {
      setQuantity(Math.max(1, remainingStock));
      return;
    }

    addItem(product, quantity, variant);
    setIsAdded(true);

    // Reset local quantity to 1 if there's still stock left
    if (remainingStock - quantity > 0) {
      setQuantity(1);
    }

    // Log Firebase Event (Dynamic import handling)
    import('@/lib/firebase').then(({ analytics }) => {
      if (analytics) {
        import('firebase/analytics').then(({ logEvent }) => {
          logEvent(analytics, 'add_to_cart', {
            currency: 'INR',
            value: (variant ? variant.price : product.price) * quantity,
            items: [
              {
                item_id: variant ? `${product._id}-${variant.name}` : product._id,
                item_name: product.name,
                item_variant: variant?.name,
                price: variant ? variant.price : product.price,
                quantity: quantity,
              },
            ],
          });
        });
      }
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  if (stock === 0 || disabled) {
    return (
      <button
        disabled
        className='w-full py-3 bg-gray-200 text-gray-400 rounded-lg font-bold cursor-not-allowed'
      >
        {disabled ? 'Unavailable' : 'Out of Stock'}
      </button>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center border border-gray-300 rounded-lg'>
          <button
            onClick={handleDecrement}
            className='p-3 hover:bg-gray-50 transition'
            disabled={isInCart ? false : quantity <= 1 || isMaxedOut}
          >
            <Minus className='w-4 h-4 text-gray-600' />
          </button>
          <span className='w-12 text-center font-medium text-gray-900'>
            {isInCart ? cartQuantity : quantity}
          </span>
          <button
            onClick={handleIncrement}
            className='p-3 hover:bg-gray-50 transition'
            disabled={isInCart ? isMaxedOut : quantity >= remainingStock || isMaxedOut}
          >
            <Plus className='w-4 h-4 text-gray-600' />
          </button>
        </div>
        <span className='text-sm text-gray-500'>{remainingStock} items in stock</span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isMaxedOut || isInCart}
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all transform active:scale-95 ${
          isMaxedOut || isInCart
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
            : isAdded
              ? 'bg-green-600 text-white shadow-lg shadow-green-200'
              : 'bg-black text-white hover:bg-gray-800 shadow-xl shadow-gray-200'
        }`}
      >
        {isAdded ? (
          <span>Added to Cart!</span>
        ) : isInCart ? (
          <>
            <ShoppingCart className='w-5 h-5' />
            <span>Available in Cart</span>
          </>
        ) : isMaxedOut ? (
          <>
            <ShoppingCart className='w-5 h-5' />
            <span>Max Limit Reached</span>
          </>
        ) : (
          <>
            <ShoppingCart className='w-5 h-5' />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}
