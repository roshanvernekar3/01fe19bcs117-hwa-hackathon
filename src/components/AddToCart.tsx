"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@/lib/products";
import Icon from "@/components/ui/Icon";

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];

export default function AddToCart({ product }: { product: Product }) {
  const { add, items } = useCart();
  const { has, toggle } = useWishlist();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product.category === "accessories" ? "OS" : "M");
  const [added, setAdded] = useState(false);

  const sizes = product.category === "accessories" ? ["OS"] : APPAREL_SIZES;
  const inBag = items
    .filter((i) => i.slug === product.slug)
    .reduce((sum, i) => sum + i.qty, 0);
  const effectiveStock =
    product.inStock && (product.stock === null || product.stock === undefined)
      ? 999
      : product.stock ?? 0;
  const available = Math.max(0, effectiveStock - inBag);
  const low = product.inStock && effectiveStock > 0 && effectiveStock <= 5;

  function handleAdd() {
    const toAdd = Math.min(qty, Math.max(1, available));
    for (let i = 0; i < toAdd; i++) {
      add({ slug: product.slug, name: product.name, price: product.price, emoji: product.emoji, size });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  if (!product.inStock || available <= 0) {
    return (
      <div className="space-y-3">
        <button disabled className="btn w-full cursor-not-allowed border border-white/10 bg-white/[0.03] text-silver/35">
          Sold out — drop 02 soon
        </button>
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.16em] text-silver/30">
          Join the restock list at support
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver/45">
            Select size
          </p>
          <button type="button" className="font-mono text-[9px] uppercase tracking-[0.14em] text-silver/35 underline decoration-white/20 underline-offset-4 hover:text-chrome">
            Size guide
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              className={`min-w-12 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition ${
                size === s
                  ? "border-violet bg-violet/15 text-violet-bright"
                  : "border-white/12 text-silver/55 hover:border-white/25 hover:text-chrome"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-2.5">
        <div className="flex items-center overflow-hidden rounded-full border border-white/12">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3.5 py-3 text-silver/60 transition hover:bg-white/5 hover:text-chrome"
            aria-label="Decrease quantity"
          >
            <Icon name="minus" size={14} />
          </button>
          <span className="min-w-8 text-center font-mono text-sm text-chrome">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(Math.max(1, available), q + 1))}
            className="px-3.5 py-3 text-silver/60 transition hover:bg-white/5 hover:text-chrome"
            aria-label="Increase quantity"
          >
            <Icon name="plus" size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`btn min-w-0 flex-1 ${added ? "btn-chrome" : "btn-primary"}`}
        >
          {added ? (
            <>
              <Icon name="check" size={16} /> Added to bag
            </>
          ) : (
            <>
              Add to bag <Icon name="bag" size={16} />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => toggle(product.slug)}
          aria-label={has(product.slug) ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={has(product.slug)}
          className={`flex w-12 items-center justify-center rounded-full border transition ${
            has(product.slug)
              ? "border-violet/50 bg-violet/10 text-violet-bright"
              : "border-white/12 text-silver/55 hover:border-violet/40 hover:text-chrome"
          }`}
        >
          <Icon name="heart" size={18} fill={has(product.slug) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/35">
        {low ? (
          <span className="text-amber-300/70">Only {effectiveStock} made</span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/70" /> In stock · ships in 24h
          </span>
        )}
        <span className="flex items-center gap-1.5"><Icon name="truck" size={12} /> Free carbon-neutral delivery</span>
      </div>

      {inBag > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-silver/40">
            {inBag} in your bag
          </p>
          <Link href="/cart" className="font-mono text-[9px] uppercase tracking-[0.14em] text-violet-bright hover:text-chrome">
            View bag →
          </Link>
        </div>
      )}
    </div>
  );
}
