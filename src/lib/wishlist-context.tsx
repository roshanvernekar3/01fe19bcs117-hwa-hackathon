"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type WishlistContextType = {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "rewear-wishlist-v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setItems(parsed.filter((s) => typeof s === "string"));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const has = (slug: string) => items.includes(slug);
  const toggle = (slug: string) =>
    setItems((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  const remove = (slug: string) => setItems((prev) => prev.filter((s) => s !== slug));
  const clear = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, has, toggle, remove, clear, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
