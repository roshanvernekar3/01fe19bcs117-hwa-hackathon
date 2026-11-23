"use client";

import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { SoundProvider } from "@/components/SoundProvider";
import PageSound from "@/components/PageSound";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SoundProvider>
      <PageSound />
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </SoundProvider>
  );
}
