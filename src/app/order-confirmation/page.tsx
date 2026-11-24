"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import Loader from "@/components/Loader";
import Icon from "@/components/ui/Icon";
import GarmentArt from "@/components/GarmentArt";
import { PRODUCTS } from "@/lib/products";

function ConfirmationInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("No order ID provided");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    let attempts = 0;
    const maxAttempts = 8;
    let cancelled = false;
    const fetchOrder = async () => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
      try {
        const res = await fetch(`/api/orders?id=${id}`, { cache: "no-store" });
        const d = await res.json();
        if (cancelled) return;
        if (d?.order) {
          setOrder(d.order);
          setLoading(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(fetchOrder, 400 * attempts);
        } else {
          setError("Order not found. Please check your order ID.");
          setLoading(false);
        }
      } catch {
        if (cancelled) return;
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(fetchOrder, 400 * attempts);
        } else {
          setError("Failed to load order");
          setLoading(false);
        }
      }
    };
    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="pt-40"><Loader message="Confirming your order…" /></div>;

  if (error || !order) {
    return (
      <div className="relative flex min-h-[70vh] items-center pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="container-x flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/12 text-silver/40">
            <Icon name="search" size={26} />
          </span>
          <h1 className="mt-6 text-4xl font-medium tracking-tight text-chrome">Order not found</h1>
          <p className="mt-3 max-w-sm text-sm text-silver/45">{error || "We couldn't find that order."}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/orders" className="btn btn-primary">
              Track an order <Icon name="arrow-right" size={15} />
            </Link>
            <Link href="/products" className="btn btn-ghost">
              Continue exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = order.items || [];

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute left-1/2 top-0 h-64 w-[520px] -translate-x-1/2 rounded-full bg-violet/15 blur-[110px]" />
      </div>

      <div className="container-x max-w-3xl pb-20">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-violet/40 bg-violet/10 text-violet-bright">
            <Icon name="check" size={28} />
          </span>
          <p className="eyebrow mt-6">Order confirmed</p>
          <h1 className="mt-3 text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[0.94] tracking-[-0.05em] text-chrome">
            You&apos;re in <span className="text-gradient">the loop.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-silver/50">
            The loop is closed. Your piece is being prepared with its fibre passport and lifetime
            repair credit.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-silver/55">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-bright animate-pulse-dot" />
            {order.id}
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.02]">
          <div className="divide-y divide-white/[0.08]">
            {items.map((item) => {
              const product = PRODUCTS.find((p) => p.slug === item.slug);
              return (
                <div key={item.slug + item.name} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0a090f]">
                    <GarmentArt
                      kind={product?.art ?? "jacket"}
                      label={item.name}
                      slug={item.slug}
                      variant="card"
                      showHud={false}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-chrome">{item.name}</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/35">
                      Qty {item.qty} · fibre passport included
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-chrome">{formatPrice(item.price * item.qty)}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 border-t border-white/[0.08] p-5 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/35">Shipping to</p>
              <div className="mt-2 text-xs leading-relaxed text-silver/60">
                {order.customer.name}
                <br />
                {order.customer.address}
                <br />
                {order.customer.city}, {order.customer.zip}
                <br />
                {order.customer.country}
              </div>
            </div>
            <div className="sm:text-right">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/35">Payment</p>
              <p className="mt-2 text-xs text-silver/60">
                {order.paymentMethod === "razorpay"
                  ? "Paid online (Razorpay)"
                  : order.paymentMethod === "demo"
                    ? "Demo payment"
                    : "Cash on delivery"}
                <span className="mx-1.5 text-silver/25">·</span>
                <span className="capitalize text-violet-bright/80">{order.paymentStatus}</span>
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-chrome">{formatPrice(order.total)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: "truck" as const, label: "Delivery", value: "2–4 days" },
            { icon: "recycle" as const, label: "Returns", value: "30 days" },
            { icon: "shield" as const, label: "Repairs", value: "For life" },
          ].map((row) => (
            <div key={row.label} className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-3 text-center">
              <Icon name={row.icon} size={14} className="mx-auto text-violet-bright/80" />
              <p className="mt-2 text-xs font-medium text-chrome">{row.value}</p>
              <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-silver/30">{row.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={`/orders/${encodeURIComponent(order.id)}`} className="btn btn-primary">
            Track this order <Icon name="arrow-right" size={15} />
          </Link>
          <Link href="/products" className="btn btn-ghost">
            Continue exploring
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div className="pt-40"><Loader /></div>}>
      <ConfirmationInner />
    </Suspense>
  );
}
