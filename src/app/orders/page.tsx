"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/orders";
import PawLoader from "@/components/PawLoader";

type Me = { user: { email: string; name: string; role: string } | null };

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

  if (loading) return <PawLoader message="Fetching your orders…" />;

  const loggedIn = !!me?.user;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold text-navy mb-2">My Orders</h1>
      <p className="text-slate-500 mb-6">View the orders you have placed.</p>

      {!loggedIn ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center">
          <div className="text-5xl mb-3">🔐</div>
          <p className="text-slate-600 mb-5">Log in to see your orders, or track any order by its ID.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">Log in</Link>
            <Link href="/signup" className="px-6 py-3 rounded-full border border-slate-200 font-semibold hover:bg-slate-50">Sign up</Link>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <div className="text-5xl mb-3">📦</div>
          No orders yet. <Link href="/products" className="text-berry font-semibold hover:underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl p-5 border border-slate-100">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <Link href={`/orders/${encodeURIComponent(o.id)}`} className="font-bold text-navy hover:text-berry hover:underline">{o.id}</Link>
                  <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-berry">₹{o.total}</div>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                    o.status === "cancelled" ? "bg-red-100 text-red-600" :
                    o.status === "delivered" ? "bg-green-100 text-green-600" :
                    "bg-berry/10 text-berry"
                  }`}>{o.status}</span>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {o.customer.address}, {o.customer.city} {o.customer.zip}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <Link href={`/orders/${encodeURIComponent(o.id)}`} className="text-xs font-semibold text-berry hover:underline">View details →</Link>
                {o.status !== "cancelled" && o.status !== "delivered" && o.status !== "shipped" && (
                  <button
                    onClick={() => cancelOrder(o.id)}
                    disabled={cancelling === o.id}
                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                  >
                    {cancelling === o.id ? "Cancelling..." : "Cancel order"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-slate-200 pt-6">
        <button
          onClick={() => setShowTrack((v) => !v)}
          className="text-sm font-semibold text-berry hover:underline"
        >
          {showTrack ? "Hide order tracking" : "Track an order by ID →"}
        </button>

        {showTrack && (
          <div className="mt-4">
            <form onSubmit={lookup} className="flex gap-2">
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="PB-XXXX-XXXX"
                className="flex-1 px-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-berry"
              />
              <button type="submit" className="px-6 py-2 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition" disabled={trackLoading}>
                {trackLoading ? "..." : "Track"}
              </button>
            </form>

            {notFound && <div className="mt-4 text-red-500 text-sm">Order not found. Please check your ID.</div>}

            {tracked && (
              <div className="mt-4 bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-navy">{tracked.id}</div>
                  <span className="px-3 py-1 rounded-full bg-berry/10 text-berry text-xs font-semibold capitalize">{tracked.status}</span>
                </div>
                <Link href={`/orders/${encodeURIComponent(tracked.id)}`} className="text-sm font-semibold text-berry hover:underline">
                  View full details →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="text-berry font-semibold hover:underline">Continue shopping →</Link>
      </div>
    </div>
  );
}
