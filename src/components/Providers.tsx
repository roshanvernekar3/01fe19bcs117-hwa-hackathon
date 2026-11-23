"use client";

import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import FlyLayer from "@/components/FlyLayer";
import ChatWidget from "@/components/ChatWidget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>
        <FlyLayer />
        <ChatWidget />
        {children}
      </CartProvider>
    </WishlistProvider>
  );
}
