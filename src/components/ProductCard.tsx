"use client";

import { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";
import { getCollection } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import GarmentArt from "@/components/GarmentArt";
import Icon from "@/components/ui/Icon";

export default function ProductCard({ p, index }: { p: Product; index?: number }) {
  const { has, toggle } = useWishlist();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const wished = has(p.slug);
  const collection = p.collection ? getCollection(p.collection) : undefined;
  const lowStock = p.inStock && (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({ slug: p.slug, name: p.name, price: p.price, emoji: p.emoji });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="group relative flex h-full flex-col">
      <div className="product-visual relative overflow-hidden rounded-2xl border border-white/[0.09] transition-all duration-500 group-hover:border-violet/40 group-hover:shadow-[0_30px_80px_-40px_rgba(168,85,247,0.55)]">
        <Link
          href={`/products/${p.slug}`}
          className="relative block aspect-[4/5] w-full"
          aria-label={`View ${p.name}`}
        >
          <span className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
            {p.badge && (
              <span className="rounded-full border border-violet/35 bg-void/70 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-violet-bright backdrop-blur">
                {p.badge}
              </span>
            )}
            {lowStock && (
              <span className="rounded-full border border-white/15 bg-void/70 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/65 backdrop-blur">
                Only {p.stock} left
              </span>
            )}
          </span>

          {typeof index === "number" && (
            <span className="absolute right-3 top-3 z-10 font-mono text-[9px] tracking-[0.18em] text-silver/35">
              /{String(index + 1).padStart(2, "0")}
            </span>
          )}

          <div className="absolute inset-0 flex items-center justify-center p-3 transition-transform duration-700 ease-out group-hover:scale-[1.035]">
            <GarmentArt
              kind={p.art ?? "jacket"}
              label={p.name}
              slug={p.slug}
              variant="card"
              showHud={false}
              className="h-full w-full"
            />
          </div>

          <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex w-full items-center justify-between rounded-full border border-white/15 bg-void/75 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-chrome backdrop-blur-xl">
              View piece
              <Icon name="arrow-up-right" size={14} className="text-violet-bright" />
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => toggle(p.slug)}
          aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          aria-pressed={wished}
          className={`absolute bottom-3 left-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 ${
            wished
              ? "border-violet/50 bg-violet/15 text-violet-bright"
              : "border-white/15 bg-void/60 text-silver/60 hover:border-violet/40 hover:text-chrome"
          }`}
        >
          <Icon name="heart" size={16} fill={wished ? "currentColor" : "none"} />
        </button>

        <button
          type="button"
          onClick={quickAdd}
          aria-label={`Add ${p.name} to bag`}
          className={`absolute bottom-3 right-3 z-20 flex h-9 items-center gap-1.5 rounded-full border px-3 font-mono text-[8px] uppercase tracking-[0.14em] backdrop-blur-xl transition-all duration-300 sm:opacity-0 sm:translate-y-2 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 ${
            added
              ? "border-violet bg-violet text-void opacity-100 translate-y-0"
              : "border-white/15 bg-void/60 text-chrome hover:border-violet/50 hover:text-violet-bright"
          }`}
        >
          <Icon name={added ? "check" : "plus"} size={13} />
          {added ? "Added" : "Quick add"}
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/35">
            {collection?.name ?? p.category}
          </p>
          <p className="flex items-center gap-1 font-mono text-[9px] text-silver/35">
            <Icon name="star" size={10} className="text-violet-bright" />
            {p.rating.toFixed(1)}
          </p>
        </div>
        <div className="mt-1.5 flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-medium leading-snug tracking-tight text-chrome">
            <Link href={`/products/${p.slug}`} className="link-underline">
              {p.name}
            </Link>
          </h3>
          <p className="shrink-0 text-sm font-semibold text-chrome">{formatPrice(p.price)}</p>
        </div>
        <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-silver/40">{p.tagline}</p>
      </div>
    </article>
  );
}
