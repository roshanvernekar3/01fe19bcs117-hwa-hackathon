"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@/lib/products";

export default function ProductCard({ p }: { p: Product }) {
  const { has, toggle } = useWishlist();
  const wished = has(p.slug);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition hover-lift relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(p.slug);
        }}
        aria-label="wishlist"
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center text-lg hover:scale-110 transition"
      >
        {wished ? "❤️" : "🤍"}
      </button>
      <Link href={`/products/${p.slug}`}>
        <div className="relative h-48 bg-gradient-to-br from-cream to-blush overflow-hidden">
          <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 25vw" />
          {p.badge && <span className="absolute top-3 left-3 text-xs font-semibold text-berry bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow">{p.badge}</span>}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-navy">{p.name}</h3>
          <p className="text-slate-500 text-sm line-clamp-2 mt-1">{p.tagline}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-berry font-extrabold">₹{p.price}</span>
            <span className="text-xs text-slate-400">★ {p.rating}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
