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
  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const normalizeId = (id: any) => (typeof id === 'string' ? id : id?.toString());

  const addItem = (product: any, quantity = 1, variant?: any) => {
    const productId = normalizeId(product._id);
    const variantId = variant ? normalizeId(variant._id) : null;

    setItems((prev) => {
      const existing = prev.find((item) => {
        const sameProduct = normalizeId(item.product._id) === productId;
        const sameVariant = variantId ? normalizeId(item.variant?._id) === variantId : !item.variant;
        return sameProduct && sameVariant;
      });

      if (existing) {
        return prev.map((item) => {
          const sameProduct = normalizeId(item.product._id) === productId;
          const sameVariant = variantId ? normalizeId(item.variant?._id) === variantId : !item.variant;
          return sameProduct && sameVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }
      return [...prev, { product, quantity, variant }];
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    const pId = normalizeId(productId);
    const vId = variantId ? normalizeId(variantId) : null;

    setItems((prev) =>
      prev.filter((item) => {
        if (normalizeId(item.product._id) !== pId) return true;
        if (vId) return normalizeId(item.variant?._id) !== vId;
        return !!item.variant;
      }),
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity < 1) {
      removeItem(productId, variantId);
      return;
    }

    const pId = normalizeId(productId);
    const vId = variantId ? normalizeId(variantId) : null;

    setItems((prev) =>
      prev.map((item) => {
        if (normalizeId(item.product._id) !== pId) return item;
        if (vId) {
          if (normalizeId(item.variant?._id) === vId) return { ...item, quantity };
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
