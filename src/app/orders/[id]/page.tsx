"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";
import type { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import Icon from "@/components/ui/Icon";
import GarmentArt from "@/components/GarmentArt";
import { PRODUCTS } from "@/lib/products";

const STEPS: { key: Order["status"]; label: string; icon: "bag" | "scan" | "truck" | "check" }[] = [
  { key: "received", label: "Placed", icon: "bag" },
  { key: "processing", label: "In repair bay", icon: "scan" },
  { key: "shipped", label: "In transit", icon: "truck" },
  { key: "delivered", label: "Delivered", icon: "check" },
];

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params?.id ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders?id=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Order not found");
        return r.json();
      })
      .then((d) => setOrder(d.order))
      .catch(() => setError("Order not found. Please check your order ID."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-40"><Loader message="Loading your order…" /></div>;

  if (error || !order) {
    return (
      <div className="relative flex min-h-[70vh] items-center pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="container-x flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/12 text-silver/40">
            <Icon name="search" size={26} />
          </span>
          <h1 className="mt-6 text-3xl font-medium tracking-tight text-chrome">Order not found</h1>
          <p className="mt-3 max-w-sm text-sm text-silver/45">{error || "We couldn't find that order."}</p>
          <Link href="/orders" className="btn btn-primary mt-7">
            Track another order <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </div>
    );
  }

  const cancelled = order.status === "cancelled";
  const currentIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72">
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="container-x max-w-4xl pb-20">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-silver/35 hover:text-chrome"
        >
          <Icon name="arrow-right" size={12} className="rotate-180" /> All orders
        </Link>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <p className="eyebrow mb-2">Order / trace</p>
            <h1 className="font-mono text-lg uppercase tracking-[0.08em] text-chrome sm:text-2xl">{order.id}</h1>
            <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] ${
              cancelled
                ? "border-red-300/20 bg-red-400/[0.06] text-red-200/80"
                : order.status === "delivered"
                  ? "border-emerald-300/25 bg-emerald-400/[0.07] text-emerald-200/80"
                  : "border-violet/30 bg-violet/10 text-violet-bright"
            }`}
          >
            {order.status}
          </span>
        </div>

        {!cancelled && (
          <div className="mt-8 rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              {STEPS.map((step, i) => {
                const done = i <= currentIndex;
                return (
                  <div key={step.key} className="relative flex flex-1 flex-col items-center">
                    {i > 0 && (
                      <div
                        className={`absolute right-1/2 top-5 h-px w-full ${
                          i <= currentIndex ? "bg-violet/60" : "bg-white/10"
                        }`}
                        style={{ left: "-50%" }}
                      />
                    )}
                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border ${
                        done
                          ? "border-violet/50 bg-violet/15 text-violet-bright"
                          : "border-white/10 bg-white/[0.02] text-silver/25"
                      }`}
                    >
                      <Icon name={step.icon} size={16} />
                    </div>
                    <p
                      className={`mt-2 text-center font-mono text-[8px] uppercase tracking-[0.1em] sm:text-[9px] ${
                        done ? "text-violet-bright/80" : "text-silver/25"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="divide-y divide-white/[0.08] overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.02]">
            {order.items.map((item) => {
              const product = PRODUCTS.find((p) => p.slug === item.slug);
              return (
                <div key={item.slug + item.name} className="flex items-center gap-4 p-4">
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
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">
                      Qty {item.qty} · {formatPrice(item.price)} each
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-chrome">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
              );
            })}
            <div className="flex items-center justify-between p-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40">Total</span>
              <span className="text-lg font-semibold text-chrome">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/35">Delivery address</p>
              <div className="mt-2 text-xs leading-relaxed text-silver/55">
                {order.customer.name}
                <br />
                {order.customer.address}
                <br />
                {order.customer.city}, {order.customer.zip}
                <br />
                {order.customer.country}
                {order.customer.phone && (
                  <>
                    <br />
                    {order.customer.phone}
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/35">Payment</p>
              <p className="mt-2 text-xs text-silver/55">
                {order.paymentMethod === "razorpay"
                  ? "Paid online (Razorpay)"
                  : order.paymentMethod === "demo"
                    ? "Demo (test)"
                    : "Cash on delivery"}
                <br />
                Status: <span className="capitalize text-chrome">{order.paymentStatus}</span>
                {order.paymentId && (
                  <>
                    <br />
                    Ref: <span className="font-mono text-[10px] text-silver/40">{order.paymentId}</span>
                  </>
                )}
              </p>
            </div>

            {order.notes && (
              <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/35">Notes</p>
                <p className="mt-2 text-xs leading-relaxed text-silver/55">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/products" className="btn btn-ghost btn-sm">
            Continue exploring
          </Link>
          <Link href="/support" className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40 hover:text-chrome">
            Ask about this order →
          </Link>
        </div>
      </div>
    </div>
  );
}
