'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { ProductSummary } from '@/types';

export interface WishlistProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  primaryImage: string;
  brandName?: string | null;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLargeItem?: boolean;
}

interface WishlistContextType {
  items: WishlistProduct[];
  itemCount: number;
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistProduct | ProductSummary | any) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Load initial wishlist from localStorage immediately (fast client-side hydration)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tb_wishlist');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse local wishlist:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch and synchronize with Database when authenticated
  const refreshWishlist = useCallback(async () => {
    if (status !== 'authenticated') return;

    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();

      if (data.success && Array.isArray(data.items)) {
        const dbProducts: WishlistProduct[] = data.items.map((it: any) => it.product);

        // Check if there are local guest items to sync to database
        const localSaved = localStorage.getItem('tb_wishlist');
        const localItems: WishlistProduct[] = localSaved ? JSON.parse(localSaved) : [];

        const unSyncedIds = localItems
          .map((i) => i.id)
          .filter((id) => !dbProducts.some((p) => p.id === id));

        if (unSyncedIds.length > 0) {
          // Push local items to DB
          const syncRes = await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds: unSyncedIds }),
          });
          const syncData = await syncRes.json();
          if (syncData.success && Array.isArray(syncData.items)) {
            const merged = syncData.items.map((it: any) => it.product);
            setItems(merged);
            localStorage.setItem('tb_wishlist', JSON.stringify(merged));
            return;
          }
        }

        setItems(dbProducts);
        localStorage.setItem('tb_wishlist', JSON.stringify(dbProducts));
      }
    } catch (err) {
      console.error('Error syncing wishlist with database:', err);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      refreshWishlist();
    }
  }, [status, refreshWishlist]);

  // 3. Helper: is in wishlist
  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((i) => i.id === productId);
    },
    [items]
  );

  // 4. Toggle Item (Instant optimistic update + Database persistence)
  const toggleWishlist = async (rawProduct: any): Promise<boolean> => {
    const product: WishlistProduct = {
      id: rawProduct.id,
      sku: rawProduct.sku || '',
      name: rawProduct.name,
      slug: rawProduct.slug || '',
      shortDescription: rawProduct.shortDescription || '',
      price: Number(rawProduct.price),
      compareAtPrice: rawProduct.compareAtPrice ? Number(rawProduct.compareAtPrice) : null,
      primaryImage: rawProduct.primaryImage || (rawProduct.images?.[0]?.url ?? ''),
      brandName: rawProduct.brandName || (rawProduct.brand?.name ?? null),
      isBestSeller: Boolean(rawProduct.isBestSeller),
      isNewArrival: Boolean(rawProduct.isNewArrival),
      isLargeItem: Boolean(rawProduct.isLargeItem),
    };

    const exists = items.some((i) => i.id === product.id);
    let nextItems: WishlistProduct[];

    if (exists) {
      nextItems = items.filter((i) => i.id !== product.id);
    } else {
      nextItems = [product, ...items];
    }

    // Optimistic state & local storage
    setItems(nextItems);
    try {
      localStorage.setItem('tb_wishlist', JSON.stringify(nextItems));
    } catch {}

    // Persist to PostgreSQL if authenticated
    if (status === 'authenticated') {
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            action: exists ? 'remove' : 'add',
          }),
        });
      } catch (e) {
        console.error('Failed to persist wishlist update to database:', e);
      }
    }

    return !exists;
  };

  // 5. Remove Item
  const removeFromWishlist = async (productId: string) => {
    const nextItems = items.filter((i) => i.id !== productId);
    setItems(nextItems);
    try {
      localStorage.setItem('tb_wishlist', JSON.stringify(nextItems));
    } catch {}

    if (status === 'authenticated') {
      try {
        await fetch(`/api/wishlist?productId=${encodeURIComponent(productId)}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.error('Failed to delete wishlist item from database:', e);
      }
    }
  };

  // 6. Clear Wishlist
  const clearWishlist = async () => {
    setItems([]);
    try {
      localStorage.removeItem('tb_wishlist');
    } catch {}

    if (status === 'authenticated') {
      try {
        await fetch('/api/wishlist?all=true', {
          method: 'DELETE',
        });
      } catch (e) {
        console.error('Failed to clear database wishlist:', e);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
