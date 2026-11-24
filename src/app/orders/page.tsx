"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import Loader from "@/components/Loader";
import Icon from "@/components/ui/Icon";

type Me = { user: { email: string; name: string; role: string } | null };

const statusStyles: Record<string, string> = {
  received: "border-violet/30 bg-violet/10 text-violet-bright",
  processing: "border-violet/30 bg-violet/10 text-violet-bright",
  shipped: "border-sky-300/25 bg-sky-400/[0.07] text-sky-200/80",
  delivered: "border-emerald-300/25 bg-emerald-400/[0.07] text-emerald-200/80",
  cancelled: "border-red-300/20 bg-red-400/[0.06] text-red-200/80",
};

export default function OrdersPage() {
  const [id, setId] = useState("");
  const [tracked, setTracked] = useState<Order | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrack, setShowTrack] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const m = await fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json());
        setMe(m);
        if (m?.user?.email) {
          const res = await fetch("/api/orders/mine", { cache: "no-store" });
          if (res.ok) {
            const d = await res.json();
            setOrders(d.orders || []);
          }
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setTrackLoading(true);
    setNotFound(false);
    setTracked(null);
    const res = await fetch(`/api/orders?id=${encodeURIComponent(id.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setTracked(data.order);
    } else {
      setNotFound(true);
    }
    setTrackLoading(false);
  }

  async function cancelOrder(orderId: string) {
    if (!confirm("Cancel this order?")) return;
    setCancelling(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "cancelled" }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)));
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Could not cancel this order.");
      }
    } finally {
      setCancelling(null);
    }
  }

  if (loading) return <div className="pt-40"><Loader message="Fetching your orders…" /></div>;

  const loggedIn = !!me?.user;

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72">
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="container-x max-w-4xl pb-20">
        <div className="border-b border-white/[0.08] pb-6">
          <p className="eyebrow mb-3">Orders / loop status</p>
          <h1 className="text-[clamp(2.6rem,7vw,5rem)] font-medium leading-none tracking-[-0.05em] text-chrome">
            Track <span className="text-gradient">everything.</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm text-silver/45">
            Every piece you order stays traceable — from dispatch to repair to re-spin.
          </p>
        </div>

        {!loggedIn ? (
          <div className="mt-10 rounded-2xl border border-white/[0.09] bg-white/[0.02] p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/12 text-silver/40">
              <Icon name="user" size={22} />
            </span>
            <p className="mt-4 text-sm text-silver/55">
              Log in to see your full order history, or track any order by its ID below.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/login" className="btn btn-primary btn-sm">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-ghost btn-sm">
                Create account
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-white/12 px-6 py-16 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/12 text-silver/40">
              <Icon name="bag" size={22} />
            </span>
            <p className="mt-4 text-sm text-silver/50">No orders yet.</p>
            <Link href="/products" className="btn btn-primary btn-sm mt-5">
              Explore Drop 01 <Icon name="arrow-right" size={13} />
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 transition-colors hover:border-violet/25"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/orders/${encodeURIComponent(o.id)}`}
                      className="font-mono text-xs uppercase tracking-[0.12em] text-chrome hover:text-violet-bright"
                    >
                      {o.id}
                    </Link>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-chrome">{formatPrice(o.total)}</span>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${
                        statusStyles[o.status] ?? statusStyles.received
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-silver/50">
                  {o.items.map((i) => `${i.name} ×${i.qty}`).join(" · ")}
                </p>
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/25">
                  {o.customer.address}, {o.customer.city} {o.customer.zip}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/[0.06] pt-3">
                  <Link
                    href={`/orders/${encodeURIComponent(o.id)}`}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-violet-bright hover:text-chrome"
                  >
                    View details <Icon name="arrow-right" size={12} />
                  </Link>
                  {o.status !== "cancelled" && o.status !== "delivered" && o.status !== "shipped" && (
                    <button
                      onClick={() => cancelOrder(o.id)}
                      disabled={cancelling === o.id}
                      className="font-mono text-[9px] uppercase tracking-[0.14em] text-silver/30 hover:text-red-300 disabled:opacity-50"
                    >
                      {cancelling === o.id ? "Cancelling…" : "Cancel order"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 border-t border-white/[0.08] pt-6">
          <button
            onClick={() => setShowTrack((v) => !v)}
            className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-silver/45 hover:text-chrome"
          >
            <Icon name="search" size={13} />
            {showTrack ? "Hide order tracking" : "Track an order by ID"}
          </button>

          {showTrack && (
            <div className="mt-4">
              <form onSubmit={lookup} className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="RW-XXXX-XXXX"
                  className="field flex-1"
                  aria-label="Order ID"
                />
                <button type="submit" className="btn btn-primary btn-sm shrink-0" disabled={trackLoading}>
                  {trackLoading ? "Tracking…" : "Track"}
                </button>
              </form>

              {notFound && (
                <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/[0.07] px-4 py-3 text-xs text-red-200">
                  Order not found. Please check your ID.
                </div>
              )}

              {tracked && (
                <div className="mt-4 rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-chrome">{tracked.id}</p>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] ${
                        statusStyles[tracked.status] ?? statusStyles.received
                      }`}
                    >
                      {tracked.status}
                    </span>
                  </div>
                  <Link
                    href={`/orders/${encodeURIComponent(tracked.id)}`}
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-violet-bright hover:text-chrome"
                  >
                    View full details <Icon name="arrow-right" size={12} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/products"
            className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40 hover:text-chrome"
          >
            <Icon name="arrow-right" size={12} className="rotate-180" /> Continue exploring
          </Link>
          <Link href="/support" className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40 hover:text-chrome">
            Need help? Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
