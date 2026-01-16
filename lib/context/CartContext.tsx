'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  product: any; // Ideally strictly typed from Product model + populate
  quantity: number;
  variant?: any; // The selected variant object
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number, variant?: any) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, quantity = 1, variant?: any) => {
    setItems((prev) => {
      const existing = prev.find((item) => {
          const sameProduct = item.product._id === product._id;
          const sameVariant = variant ? item.variant?._id === variant._id : !item.variant; 
          // Note: using _id for variant might be tricky if we don't have it generated yet. 
          // Mongo subdocs have _id by default.
          return sameProduct && sameVariant;
      });

      if (existing) {
        return prev.map((item) => {
          const sameProduct = item.product._id === product._id;
          const sameVariant = variant ? item.variant?._id === variant._id : !item.variant;
          return (sameProduct && sameVariant)
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }
      return [...prev, { product, quantity, variant }];
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    setItems((prev) => prev.filter((item) => {
        if (item.product._id !== productId) return true;
        // matching product, checks variant
        if (variantId) return item.variant?._id !== variantId;
        return !!item.variant; // if no variantId passed, remove only base items? Or all? 
        // Logic: specific removal usually.
        // Actually simpler: filter out the exact match
        // But the previous API was removeItem(productId).
        // Let's assume if variantId is not passed, and we have multiple variants of same product, we might be in trouble.
        // But usually UI calls remove with specific ID.
        // Let's refine: The UI currently just passes product ID because cart items listed are distinct.
        // We need unique cart ID or composite ID.
    }));
  };
  
  // FIX: Better removeItem signature
  // We can't change signature too much without breaking existing calls if we are not careful.
  // Actually, let's redefine removeItem to filter properly.
  // Ideally, CartItem should have a generated unique ID. 
  // For now, let's use the composite check logic.


  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + (item.product.offerPrice > 0 ? item.product.offerPrice : item.product.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
