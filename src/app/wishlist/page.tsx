"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";
import Mascot from "@/components/Mascot";
import PawLoader from "@/components/PawLoader";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { add } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  const wishedProducts = items
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];

  if (products.length === 0) {
    return <PawLoader message="Loading your wishlist…" />;
  }

  if (wishedProducts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="mb-4"><Mascot type="cat" size="lg" anim="wiggle" /></div>
        <h1 className="text-3xl font-extrabold text-navy">Your wishlist is empty</h1>
        <p className="text-slate-500 mt-2">Save favourites by tapping the heart on any product.</p>
        <Link href="/products" className="inline-block mt-6 px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-navy">Your Wishlist</h1>
        <button onClick={clear} className="text-sm text-slate-500 hover:text-red-500">Clear all</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishedProducts.map((p) => (
          <div key={p.slug} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition hover-lift">
            <Link href={`/products/${p.slug}`}>
              <div className="relative h-48 bg-gradient-to-br from-cream to-blush overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-contain p-2" sizes="25vw" />
              </div>
            </Link>
            <div className="p-4">
              <h3 className="font-bold text-navy">{p.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mt-1">{p.tagline}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-berry font-extrabold">₹{p.price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => add({ slug: p.slug, name: p.name, price: p.price, emoji: p.emoji })}
                    className="px-3 py-1.5 rounded-full bg-berry text-white text-xs font-semibold hover:bg-berry-dark transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => remove(p.slug)}
                    className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
