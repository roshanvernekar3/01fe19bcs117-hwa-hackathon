"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/orders";
import PawLoader from "@/components/PawLoader";

function ConfirmationInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/orders?id=${id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.order) setOrder(d.order);
        else setError("Order not found");
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PawLoader message="Loading your order…" />;
  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-extrabold text-navy mb-2">Order Not Found</h1>
        <p className="text-slate-500 mb-6">{error || "We couldn't find that order."}</p>
        <Link href="/orders" className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-navy">Order Placed!</h1>
      <p className="text-slate-500 mt-2">Thank you for shopping with PAWBERRY.</p>
      <div className="mt-4 inline-block px-4 py-2 bg-slate-100 rounded-full text-sm font-mono">Order ID: {order.id}</div>
      <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-100 text-left">
        <div className="font-bold text-navy mb-2">Shipping to</div>
        <div className="text-sm text-slate-700">
          {order.customer.name}<br />
          {order.customer.address}<br />
          {order.customer.city}, {order.customer.zip}<br />
          {order.customer.country}
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-slate-500">Payment</span>
          <span className="font-semibold text-navy capitalize">
            {order.paymentMethod === "razorpay" ? "Paid online (Razorpay)" : "Cash on Delivery"} · {order.paymentStatus}
          </span>
        </div>
        <div className="mt-2 font-bold text-navy">Total: <span className="text-berry">₹{order.total}</span></div>
      </div>
      <div className="mt-8 flex gap-3 justify-center">
        <Link href={`/orders/${encodeURIComponent(order.id)}`} className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">View Order</Link>
        <Link href="/products" className="px-6 py-3 rounded-full border border-slate-200 font-semibold hover:bg-slate-50">Continue Shopping</Link>
        <Link href="/" className="px-6 py-3 rounded-full border border-slate-200 font-semibold hover:bg-slate-50">Home</Link>
      </div>
    </div>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<PawLoader />}>
      <ConfirmationInner />
    </Suspense>
  );
}
