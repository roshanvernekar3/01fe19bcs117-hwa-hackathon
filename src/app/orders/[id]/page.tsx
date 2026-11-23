"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/orders";

const STEPS: { key: Order["status"]; label: string; emoji: string }[] = [
  { key: "received", label: "Placed", emoji: "🧾" },
  { key: "processing", label: "Processing", emoji: "✅" },
  { key: "shipped", label: "Shipped", emoji: "🚚" },
  { key: "delivered", label: "Delivered", emoji: "🏠" },
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

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-slate-500">Loading order...</div>;
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-extrabold text-navy mb-2">Order not found</h1>
        <p className="text-slate-500 mb-6">{error || "We couldn't find that order."}</p>
        <Link href="/orders" className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">
          Track another order
        </Link>
      </div>
    );
  }

  const cancelled = order.status === "cancelled";
  const currentIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/profile?tab=orders" className="text-sm text-slate-500 hover:text-berry">
        ← Back to my orders
      </Link>

      <div className="mt-4 flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Order {order.id}</h1>
          <p className="text-sm text-slate-500">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full capitalize ${
            cancelled ? "bg-red-100 text-red-600" :
            order.status === "delivered" ? "bg-green-100 text-green-600" :
            "bg-berry/10 text-berry"
          }`}
        >
          {order.status}
        </span>
      </div>

      {!cancelled && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((step, i) => {
              const done = i <= currentIndex;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  {i > 0 && (
                    <div className={`absolute top-4 right-1/2 w-full h-0.5 ${i <= currentIndex ? "bg-berry" : "bg-slate-200"}`} style={{ left: "-50%" }} />
                  )}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm ${done ? "bg-berry text-white" : "bg-slate-100 text-slate-400"}`}>
                    {step.emoji}
                  </div>
                  <div className={`mt-2 text-[10px] sm:text-xs font-semibold text-center ${done ? "text-berry" : "text-slate-400"}`}>{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 bg-white rounded-2xl p-6 border border-slate-100">
        <h2 className="font-bold text-navy mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((i) => (
            <div key={i.slug} className="flex justify-between text-sm">
              <span className="text-slate-700">
                {i.name} <span className="text-slate-400">×{i.qty}</span>
              </span>
              <span className="font-semibold text-navy">₹{i.price * i.qty}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 pt-3 mt-4 flex justify-between font-bold text-navy">
          <span>Total</span>
          <span className="text-berry">₹{order.total}</span>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h2 className="font-bold text-navy mb-3">Delivery address</h2>
          <div className="text-sm text-slate-700 leading-relaxed">
            {order.customer.name}<br />
            {order.customer.address}<br />
            {order.customer.city}, {order.customer.zip}<br />
            {order.customer.country}
            <br />{order.customer.phone}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h2 className="font-bold text-navy mb-3">Payment</h2>
          <div className="text-sm text-slate-700">
            Method: <span className="font-semibold text-navy">{order.paymentMethod === "razorpay" ? "Paid online (Razorpay)" : order.paymentMethod === "demo" ? "Demo (test)" : "Cash on Delivery"}</span>
            <br />Status: <span className="font-semibold text-navy capitalize">{order.paymentStatus}</span>
            {order.paymentId && <><br />Ref: <span className="font-mono text-xs">{order.paymentId}</span></>}
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-slate-100">
          <h2 className="font-bold text-navy mb-2">Notes</h2>
          <p className="text-sm text-slate-700">{order.notes}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/products" className="text-berry font-semibold hover:underline">Continue shopping →</Link>
      </div>
    </div>
  );
}
