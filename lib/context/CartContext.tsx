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
          return sameProduct && sameVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }
      return [...prev, { product, quantity, variant }];
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter((item) => {
        if (item.product._id !== productId) return true; // keep items of other products
        // Same product — decide whether to remove based on variant
        if (variantId) {
          // Remove only the specific variant
          return item.variant?._id !== variantId;
        }
        // No variantId given — remove the base (non-variant) entry
        return !!item.variant;
      }),
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity < 1) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product._id !== productId) return item;
        if (variantId) {
          if (item.variant?._id === variantId) return { ...item, quantity };
          return item;
        }
        if (!item.variant) return { ...item, quantity };
        return item;
      }),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) =>
      acc +
      (item.product.offerPrice > 0 ? item.product.offerPrice : item.product.price) * item.quantity,
    0,
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
