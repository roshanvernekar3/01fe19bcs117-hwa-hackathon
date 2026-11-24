"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { PRODUCTS } from "@/lib/products";
import GarmentArt from "@/components/GarmentArt";
import Icon from "@/components/ui/Icon";

export default function CartPage() {
  const { items, remove, setQty, total, clear, count } = useCart();
  const shipping = total >= 1000 || total === 0 ? 0 : 49;
  const grand = total + shipping;

  if (items.length === 0) {
    return (
      <div className="relative flex min-h-[70vh] items-center pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="container-x flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/12 text-silver/40">
            <Icon name="bag" size={26} />
          </span>
          <p className="eyebrow mt-6">Your bag / 00</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-chrome sm:text-5xl">
            Nothing here <span className="text-outline">yet.</span>
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-silver/45">
            The system is ready. Add a piece from Drop 01 and it will appear here with its fibre
            passport and repair credit.
          </p>
          <Link href="/products" className="btn btn-primary mt-7">
            Explore the catalogue <Icon name="arrow-right" size={15} />
          </Link>
          <Link href="/style-match" className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-silver/35 hover:text-violet-bright">
            Or run AI Style Match →
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
            <p className="eyebrow mb-3">Bag / {String(count).padStart(2, "0")}</p>
            <h1 className="text-[clamp(2.8rem,7vw,5.2rem)] font-medium leading-none tracking-[-0.05em] text-chrome">
              Your <span className="text-gradient">bag.</span>
            </h1>
          </div>
          <button
            onClick={clear}
            className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/35 hover:text-red-300"
          >
            Clear bag
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_0.85fr] lg:gap-12">
          {/* Items */}
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {items.map((item) => {
              const product = PRODUCTS.find((p) => p.slug === item.slug);
              return (
                <div key={item.key} className="flex gap-4 py-5 sm:gap-5">
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a090f] sm:h-32 sm:w-28"
                  >
                    <GarmentArt
                      kind={product?.art ?? "jacket"}
                      label={item.name}
                      slug={item.slug}
                      variant="card"
                      showHud={false}
                      className="h-full w-full"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-silver/30">
                            {product?.collection ? product.collection.replace("-", " ") : "REWEAR"}
                          </p>
                          <h2 className="mt-1 truncate text-sm font-medium text-chrome sm:text-base">
                            <Link href={`/products/${item.slug}`} className="hover:text-violet-bright">
                              {item.name}
                            </Link>
                          </h2>
                          {item.size && (
                            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/35">
                              Size / {item.size}
                            </p>
                          )}
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-chrome">
                          {formatPrice(item.price * item.qty)}
                        </p>
                      </div>
                      <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/25">
                        {formatPrice(item.price)} each · fibre passport included
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center overflow-hidden rounded-full border border-white/12">
                        <button
                          onClick={() => setQty(item.key, item.qty - 1)}
                          className="px-2.5 py-1.5 text-silver/50 hover:bg-white/5 hover:text-chrome"
                          aria-label={`Decrease ${item.name}`}
                        >
                          <Icon name="minus" size={12} />
                        </button>
                        <span className="min-w-7 text-center font-mono text-xs text-chrome">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.key, item.qty + 1)}
                          className="px-2.5 py-1.5 text-silver/50 hover:bg-white/5 hover:text-chrome"
                          aria-label={`Increase ${item.name}`}
                        >
                          <Icon name="plus" size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.key)}
                        className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30 hover:text-red-300"
                      >
                        <Icon name="trash" size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-white/[0.1] bg-white/[0.025] p-5 backdrop-blur sm:p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/35">Order summary</p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-silver/55">
                  <span>Subtotal</span>
                  <span className="text-chrome">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-silver/55">
                  <span>Delivery</span>
                  <span className="text-violet-bright">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-silver/55">
                  <span>Repair credit</span>
                  <span className="text-violet-bright">Included</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold text-chrome">
                  <span>Total</span>
                  <span>{formatPrice(grand)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-primary mt-6 w-full">
                Secure checkout <Icon name="arrow-right" size={15} />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-3 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">
                <span className="flex items-center gap-1"><Icon name="shield" size={11} /> Encrypted</span>
                <span className="h-3 w-px bg-white/10" />
                <span className="flex items-center gap-1"><Icon name="recycle" size={11} /> Circular</span>
                <span className="h-3 w-px bg-white/10" />
                <span className="flex items-center gap-1"><Icon name="truck" size={11} /> Tracked</span>
              </div>

              <div className="mt-5 rounded-xl border border-violet/20 bg-violet/[0.045] p-3">
                <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-violet-bright/80">
                  <Icon name="leaf" size={12} /> Impact in this bag
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-silver/45">
                  Your selection avoids approximately{" "}
                  <span className="text-chrome">
                    {items.reduce((sum, item) => {
                      const p = PRODUCTS.find((x) => x.slug === item.slug);
                      return sum + (p?.carbon ?? 0) * item.qty;
                    }, 0).toFixed(1)}{" "}
                    kg CO₂e
                  </span>{" "}
                  versus conventional equivalents.
                </p>
              </div>

              <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[0.14em] text-silver/25">
                Carbon-neutral delivery · 30-day returns
              </p>
            </div>

            <Link href="/products" className="mt-4 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-silver/35 hover:text-chrome">
              <Icon name="arrow-right" size={12} className="rotate-180" /> Continue exploring
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
