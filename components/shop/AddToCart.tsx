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
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const stock = variant ? variant.stock : product.stock;

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < stock) {
        setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity, variant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (stock === 0 || disabled) {
      return (
          <button disabled className="w-full py-3 bg-gray-200 text-gray-400 rounded-lg font-bold cursor-not-allowed">
              {disabled ? "Unavailable" : "Out of Stock"}
          </button>
      )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button 
            onClick={handleDecrement} 
            className="p-3 hover:bg-gray-50 transition"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
          <button 
            onClick={handleIncrement} 
            className="p-3 hover:bg-gray-50 transition"
            disabled={quantity >= stock}
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <span className="text-sm text-gray-500">
            {stock} items in stock
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all transform active:scale-95 ${
          isAdded 
            ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
            : 'bg-black text-white hover:bg-gray-800 shadow-xl shadow-gray-200'
        }`}
      >
        {isAdded ? (
           <span>Added to Cart!</span>
        ) : (
           <>
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
           </>
        )}
      </button>
    </div>
  );
}
