"use client";

import type { ReactNode } from "react";
import FlyLayer from "@/components/FlyLayer";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>
        <FlyLayer />
        {children}
      </CartProvider>
    </WishlistProvider>
  );
}
