"use client";

import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import FlyLayer from "@/components/FlyLayer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>
        <FlyLayer />
        {children}
      </CartProvider>
    </WishlistProvider>
  );
}
