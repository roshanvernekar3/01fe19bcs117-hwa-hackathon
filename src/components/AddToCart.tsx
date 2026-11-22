"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";
import Link from "next/link";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  function handleAdd() {
    for (let i = 0; i < qty; i++) add({ slug: product.slug, name: product.name, price: product.price, emoji: product.emoji });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-slate-200 rounded-full overflow-hidden">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-slate-100">−</button>
        <span className="px-4 py-2 font-semibold">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2 hover:bg-slate-100">+</button>
      </div>
      <button
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
