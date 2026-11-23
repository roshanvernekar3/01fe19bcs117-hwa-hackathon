"use client";

import { useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@/lib/products";
import Link from "next/link";
import { wishSources } from "@/components/FlyLayer";

export default function AddToCart({ product }: { product: Product }) {
  const { add, items } = useCart();
  const { has, toggle } = useWishlist();
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const wishBtnRef = useRef<HTMLButtonElement>(null);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  function handleAdd() {
    const existing = items.find((i) => i.slug === product.slug)?.qty ?? 0;
    const stock = product.stock ?? 0;
    const avail = Math.max(0, stock - existing);
    const toAdd = Math.min(qty, avail);
    for (let i = 0; i < toAdd; i++) add({ slug: product.slug, name: product.name, price: product.price, emoji: product.emoji });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    const el = addBtnRef.current;
    if (el) document.dispatchEvent(new CustomEvent("pawberry:fly", { detail: { kind: "cart", source: el, emoji: product.emoji, image: product.image, name: product.name } }));
  }

  function handleWish() {
    const el = wishBtnRef.current;
    if (el) {
      if (has(product.slug)) {
        const icon = document.querySelector<HTMLElement>('[data-paw-fly-target="nav-wishlist"]');
        document.dispatchEvent(new CustomEvent("pawberry:fly", { detail: { kind: "wish", source: icon ?? el, emoji: product.emoji, name: product.name, target: wishSources.get(product.slug) ?? el } }));
      } else {
        wishSources.set(product.slug, el);
        document.dispatchEvent(new CustomEvent("pawberry:fly", { detail: { kind: "wish", source: el, emoji: product.emoji, image: product.image, name: product.name } }));
      }
    }
    toggle(product.slug);
  }

  if (!product.inStock) {
    return (
      <div className="px-6 py-3 rounded-full bg-slate-100 text-slate-500 font-semibold text-center">
        Out of Stock
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center border border-slate-200 rounded-full overflow-hidden">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-slate-100">−</button>
        <span className="px-4 py-2 font-semibold">{qty}</span>
        <button onClick={() => setQty((q) => Math.min(product.stock ?? 999, Math.max(1, q + 1)))} className="px-4 py-2 hover:bg-slate-100">+</button>
      </div>
      <button
        ref={wishBtnRef}
        onClick={() => handleWish()}
        className="px-4 py-3 rounded-full border border-slate-200 text-xl hover:bg-slate-50 transition"
        aria-label="wishlist"
      >
        {has(product.slug) ? "❤️" : "🤍"}
      </button>
      <button
        ref={addBtnRef}
        onClick={handleAdd}
        className="flex-1 px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition shadow-lg shadow-berry/20"
      >
        {added ? "Added ✓" : "Add to Cart"}
      </button>
      <Link href="/cart" className="px-4 py-3 rounded-full border border-slate-200 text-sm font-medium hover:bg-slate-50">
        View Cart
      </Link>
    </div>
  );
}
