"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";
import Icon from "@/components/ui/Icon";

export default function WishlistPage() {
  const { items, clear } = useWishlist();
  const { add } = useCart();
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setProducts(Array.isArray(d?.products) && d.products.length ? d.products : PRODUCTS);
      })
      .catch(() => setProducts(PRODUCTS));
  }, []);

  if (!products) return <div className="pt-40"><Loader message="Loading saved pieces…" /></div>;

  const wished = items
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  if (wished.length === 0) {
    return (
      <div className="relative flex min-h-[70vh] items-center pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="container-x flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/12 text-silver/40">
            <Icon name="heart" size={26} />
          </span>
          <p className="eyebrow mt-6">Saved / 00</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-chrome sm:text-5xl">
            No saved <span className="text-outline">pieces.</span>
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-silver/45">
            Tap the heart on any piece to keep it here while you decide. Saved pieces sync with your
            bag and style matches.
          </p>
          <Link href="/products" className="btn btn-primary mt-7">
            Explore the catalogue <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72">
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>
      <div className="container-x pb-20">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <p className="eyebrow mb-3">Saved / {String(wished.length).padStart(2, "0")}</p>
            <h1 className="text-[clamp(2.8rem,7vw,5.2rem)] font-medium leading-none tracking-[-0.05em] text-chrome">
              Your <span className="text-gradient">shortlist.</span>
            </h1>
          </div>
          <button
            onClick={clear}
            className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/35 hover:text-red-300"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-6">
          {wished.map((p, i) => (
            <div key={p.slug}>
              <ProductCard p={p} index={i} />
              {!p.inStock && (
                <button
                  onClick={() => add({ slug: p.slug, name: p.name, price: p.price, emoji: p.emoji })}
                  className="mt-3 w-full rounded-full border border-white/12 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/45"
                >
                  Join restock list
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-5 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/35">
            Not sure what goes together?
          </p>
          <Link href="/style-match" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-violet-bright hover:text-chrome">
            Let AI Style Match build the edit <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
