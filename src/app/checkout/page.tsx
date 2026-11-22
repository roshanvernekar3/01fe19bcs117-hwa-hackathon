"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", zip: "", country: "United States", notes: "",
  });

  const shipping = total >= 1000 || total === 0 ? 0 : 49;
  const grand = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-navy">Nothing to checkout</h1>
        <Link href="/products" className="inline-block mt-6 px-6 py-3 rounded-full bg-berry text-white font-semibold">Shop Now</Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items, notes: form.notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      clear();
      router.push(`/order-confirmation?id=${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
    }
  }

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
        <h1 className="text-2xl font-extrabold text-navy mb-2">Checkout</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
          <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
          <Field label="Country" value={form.country} onChange={(v) => update("country", v)} required />
        </div>
        <Field label="Address" value={form.address} onChange={(v) => update("address", v)} required />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
          <Field label="ZIP / Postal" value={form.zip} onChange={(v) => update("zip", v)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Order Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition disabled:opacity-60"
        >
          {submitting ? "Placing order..." : `Place Order • ₹${grand}`}
        </button>
      </form>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 h-fit sticky top-20">
        <h2 className="text-xl font-bold text-navy mb-4">Summary</h2>
        <div className="space-y-2 text-sm max-h-64 overflow-auto">
          {items.map((i) => (
            <div key={i.slug} className="flex justify-between">
              <span>{i.name} ×{i.qty}</span>
              <span>₹{i.price * i.qty}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 pt-3 mt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{total}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-berry">₹{grand}</span></div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}{required && " *"}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry"
      />
    </div>
  );
}
