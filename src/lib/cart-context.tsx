"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  key: string;
  slug: string;
  name: string;
  price: number;
  emoji: string;
  size?: string;
  qty: number;
};

type AddPayload = {
  slug: string;
  name: string;
  price: number;
  emoji: string;
  size?: string;
};

type CartContextType = {
  items: CartItem[];
  add: (p: AddPayload, options?: { silent?: boolean }) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "rewear-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(
            parsed
              .filter((i) => i && typeof i.slug === "string")
              .map((i) => ({
                key: i.key || `${i.slug}${i.size ? `__${i.size}` : ""}`,
                slug: i.slug,
                name: i.name,
                price: Number(i.price) || 0,
                emoji: i.emoji || "◈",
                size: i.size,
                qty: Math.max(1, Number(i.qty) || 1),
              }))
          );
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add: CartContextType["add"] = (p, options) => {
    const key = `${p.slug}${p.size ? `__${p.size}` : ""}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          key,
          slug: p.slug,
          name: p.name + (p.size ? ` — ${p.size}` : ""),
          price: p.price,
          emoji: p.emoji,
          size: p.size,
          qty: 1,
        },
      ];
    });
    if (!options?.silent && typeof document !== "undefined") {
      document.dispatchEvent(new CustomEvent("rewear:cart-add", { detail: { name: p.name } }));
    }
  };

  const remove = (key: string) => setItems((prev) => prev.filter((i) => i.key !== key));

  const setQty = (key: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.key !== key);
      return prev.map((i) => (i.key === key ? { ...i, qty } : i));
    });
  };

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
