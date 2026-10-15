'use client';

import { SessionProvider } from 'next-auth/react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItemDto } from '@/types';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

interface CartContextType {
  items: CartItemDto[];
  itemCount: number;
  subtotal: number;
  hasLargeItem: boolean;
  addToCart: (item: any) => void;
  addItem: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within Providers');
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemDto[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tb_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tb_cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (newItem: CartItemDto) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const hasLargeItem = items.some((i) => i.isLargeItem);

  return (
    <SessionProvider>
      <ThemeProvider>
        <CartContext.Provider
          value={{
            items,
            itemCount,
            subtotal,
            hasLargeItem,
            addToCart,
            addItem: addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
          }}
        >
          {children}
        </CartContext.Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}
