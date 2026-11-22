"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import Mascot from "@/components/Mascot";

export default function CartPage() {
  const { items, remove, setQty, total, clear } = useCart();
  const shipping = total >= 1000 || total === 0 ? 0 : 49;
  const grand = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="mb-4"><Mascot type="dog" size="lg" anim="wiggle" /></div>
      <h1 className="text-3xl font-extrabold text-navy">Your cart is empty</h1>
        <p className="text-slate-500 mt-2">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="inline-block mt-6 px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-3xl font-extrabold text-navy mb-4">Your Cart</h1>
        {items.map((i) => (
          <div key={i.slug} className="flex flex-wrap items-center gap-3 bg-white rounded-2xl p-4 border border-slate-100">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-cream to-blush flex items-center justify-center text-2xl flex-shrink-0">
              {i.emoji}
            </div>
            <div className="flex-1 min-w-[120px]">
              <div className="font-bold text-navy text-sm">{i.name}</div>
              <div className="text-berry font-semibold text-sm">₹{i.price}</div>
            </div>
            <div className="flex items-center border border-slate-200 rounded-full overflow-hidden">
              <button onClick={() => setQty(i.slug, i.qty - 1)} className="px-3 py-1 hover:bg-slate-100">−</button>
              <span className="px-3 py-1 font-semibold">{i.qty}</span>
              <button onClick={() => setQty(i.slug, i.qty + 1)} className="px-3 py-1 hover:bg-slate-100">+</button>
            </div>
            <div className="font-bold text-navy text-sm">₹{i.price * i.qty}</div>
            <button onClick={() => remove(i.slug)} className="text-slate-400 hover:text-red-500 text-xl" aria-label="remove">×</button>
          </div>
        ))}
        <button onClick={clear} className="text-sm text-slate-500 hover:text-red-500">Clear cart</button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 h-fit sticky top-20">
        <h2 className="text-xl font-bold text-navy mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{total}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-berry">₹{grand}</span></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{total < 1000 && total > 0 ? `Add ₹${1000 - total} more for free shipping` : ""}</p>
        <Link href="/checkout" className="block mt-6 text-center px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">
          Checkout
        </Link>
      </div>
    </div>
  );
}
