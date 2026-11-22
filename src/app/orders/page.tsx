"use client";

import { useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState<import("@/lib/orders").Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    const res = await fetch(`/api/orders?id=${encodeURIComponent(id.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setOrder(data.order);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold text-navy mb-2">Track Your Order</h1>
      <p className="text-slate-500 mb-6">Enter your order ID to see its status.</p>
      <form onSubmit={lookup} className="flex gap-2">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="PB-XXXX-XXXX"
          className="flex-1 px-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-berry"
        />
        <button type="submit" className="px-6 py-2 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition" disabled={loading}>
          {loading ? "..." : "Track"}
        </button>
      </form>

      {notFound && <div className="mt-6 text-red-500">Order not found. Please check your ID.</div>}

      {order && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-navy">{order.id}</div>
            <span className="px-3 py-1 rounded-full bg-berry/10 text-berry text-xs font-semibold capitalize">{order.status}</span>
          </div>
          <div className="text-sm text-slate-500 mb-4">Placed {new Date(order.createdAt).toLocaleString()}</div>
          <div className="space-y-2 text-sm">
            {order.items.map((i) => (
              <div key={i.slug} className="flex justify-between">
                <span>{i.name} ×{i.qty}</span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between font-bold">
            <span>Total</span><span className="text-berry">${order.total.toFixed(2)}</span>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            {order.customer.name}<br />{order.customer.address}, {order.customer.city} {order.customer.zip}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/products" className="text-berry font-semibold hover:underline">Continue shopping →</Link>
      </div>
    </div>
  );
}
