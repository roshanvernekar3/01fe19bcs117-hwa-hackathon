"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

type GatewayConfig = { enabled: boolean; keyId: string | null };
type SavedAddress = {
  id: string; label: string; name: string; phone: string;
  address: string; city: string; zip: string; country: string; isDefault: boolean;
};

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gateway, setGateway] = useState<GatewayConfig>({ enabled: false, keyId: null });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", zip: "", country: "India", notes: "",
  });

  const shipping = total >= 1000 || total === 0 ? 0 : 49;
  const grand = total + shipping;

  useEffect(() => {
    fetch("/api/payment/config")
      .then((r) => r.json())
      .then((d: GatewayConfig) => setGateway(d))
      .catch(() => {});
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) {
          setIsLoggedIn(true);
          setForm((f) => ({ ...f, name: d.user.name || f.name, email: d.user.email }));
        }
      })
      .catch(() => {});
    fetch("/api/addresses", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const list: SavedAddress[] = d?.addresses || [];
        setAddresses(list);
        setSaveAddress(list.length === 0);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) {
          setSelectedAddressId(def.id);
          setForm((f) => ({
            ...f, name: def.name || f.name, phone: def.phone || f.phone,
            address: def.address, city: def.city, zip: def.zip, country: def.country || f.country,
          }));
        }
      })
      .catch(() => {});
  }, []);

  function selectAddress(a: SavedAddress) {
    setSelectedAddressId(a.id);
    setForm((f) => ({ ...f, name: a.name, phone: a.phone, address: a.address, city: a.city, zip: a.zip, country: a.country || f.country }));
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-navy">Nothing to checkout</h1>
        <Link href="/products" className="inline-block mt-6 px-6 py-3 rounded-full bg-berry text-white font-semibold">Shop Now</Link>
      </div>
    );
  }

  function update(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  function validate() {
    if (!form.name || !form.email || !form.address || !form.city || !form.zip || !form.country) {
      setError("Please fill in all required fields."); return false;
    }
    return true;
  }

  async function placeOrder(extra: { paymentMethod: "cod" | "razorpay" | "demo"; paymentStatus: "pending" | "paid" | "test" | "failed"; paymentId?: string }) {
    let customer = { ...form };
    try {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const d = await r.json();
      if (d?.user?.email) customer = { ...customer, name: d.user.name || customer.name, email: d.user.email };
    } catch {}
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, items, notes: form.notes, ...extra }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Order failed");
    if (isLoggedIn && saveAddress) {
      try {
        await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...customer, label: "Home" }) });
      } catch {}
    }
    clear();
    // Add timestamp to prevent any caching issues
    const redirectUrl = `/order-confirmation?id=${data.order.id}&t=${Date.now()}`;
    try {
      router.push(redirectUrl);
    } catch {
      window.location.href = redirectUrl;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (paymentMethod === "online") {
        if (!gateway.enabled || !gateway.keyId) {
          setShowDemoModal(true);
          setSubmitting(false);
          return;
        }
        const r = await fetch("/api/payment/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: grand, receipt: `pawberry_${Date.now()}` }),
        });
        const rd = await r.json();
        if (!r.ok) throw new Error(rd.error || "Payment setup failed");

        await loadRazorpayScript();
        const rzp = new (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay({
          key: gateway.keyId,
          amount: rd.order.amount,
          currency: rd.order.currency,
          name: "PAWBERRY",
          description: "Pet products order",
          order_id: rd.order.id,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#e879a0" },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            try {
              const v = await fetch("/api/payment/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              const vd = await v.json();
              if (!v.ok || !vd.verified) throw new Error("Payment verification failed");
              await placeOrder({ paymentMethod: "razorpay", paymentStatus: "paid", paymentId: vd.paymentId });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Payment verification failed");
              setSubmitting(false);
            }
          },
          modal: {
            ondismiss: () => {
              setError("Payment cancelled. Your order was not placed.");
              setSubmitting(false);
            },
          },
        });
        rzp.open();
        return;
      }
      await placeOrder({ paymentMethod: "cod", paymentStatus: "pending" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      if (paymentMethod !== "online") setSubmitting(false);
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
          <h1 className="text-2xl font-extrabold text-navy mb-2">Checkout</h1>

          {isLoggedIn && addresses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Saved addresses</label>
              <div className="grid sm:grid-cols-2 gap-2">
                {addresses.map((a) => (
                  <button type="button" key={a.id} onClick={() => selectAddress(a)} className={`text-left p-3 rounded-xl border-2 transition ${selectedAddressId === a.id ? "border-berry bg-berry/5" : "border-slate-200 hover:border-berry/40"}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-navy">{a.label}</span>
                      {a.isDefault && <span className="text-[10px] px-2 py-0.5 rounded-full bg-berry/10 text-berry font-semibold">Default</span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 truncate">{a.address}, {a.city} {a.zip}</div>
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-400 mt-1">Tap an address to auto-fill the form below.</div>
            </div>
          )}

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
            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" />
          </div>

          {isLoggedIn ? (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
              Save this address for next time
            </label>
          ) : (
            <p className="text-xs text-slate-400"><Link href="/login" className="text-berry font-semibold hover:underline">Log in</Link> to save your address for faster checkout.</p>
          )}

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${paymentMethod === "cod" ? "border-berry bg-berry/5" : "border-slate-200"}`}>
                <input type="radio" name="pm" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                <div><div className="font-semibold text-navy text-sm">Cash on Delivery</div><div className="text-xs text-slate-500">Pay when your order arrives.</div></div>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${paymentMethod === "online" ? "border-berry bg-berry/5" : "border-slate-200"}`}>
                <input type="radio" name="pm" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                <div>
                  <div className="font-semibold text-navy text-sm">{gateway.enabled ? "Pay Online (Razorpay)" : "Pay Online (Demo Mode)"}</div>
                  <div className="text-xs text-slate-500">{gateway.enabled ? "UPI, cards, netbanking via Razorpay." : "Test checkout — no real money. Razorpay keys not configured."}</div>
                </div>
              </label>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" disabled={submitting} className="w-full px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition disabled:opacity-60 shadow-lg shadow-berry/20">
            {submitting ? "Processing..." : paymentMethod === "online" ? `Pay ₹${grand}` : `Place Order (COD) • ₹${grand}`}
          </button>
          <p className="text-xs text-slate-400 text-center">
            {paymentMethod === "cod" ? "Your order will be saved and you pay on delivery." : "You will be redirected to Razorpay's secure checkout."}
          </p>
        </form>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 h-fit sticky top-20">
          <h2 className="text-xl font-bold text-navy mb-4">Summary</h2>
          <div className="space-y-2 text-sm max-h-64 overflow-auto">
            {items.map((i) => (<div key={i.slug} className="flex justify-between"><span>{i.name} ×{i.qty}</span><span>₹{i.price * i.qty}</span></div>))}
          </div>
          <div className="border-t border-slate-200 pt-3 mt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{total}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-berry">₹{grand}</span></div>
          </div>
        </div>

        {showDemoModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center">
              <div className="text-4xl mb-2">💳</div>
              <h3 className="text-xl font-extrabold text-navy mb-1">Demo Payment</h3>
              <p className="text-slate-500 text-sm mb-4">Test mode — no real money. Amount: <span className="font-bold text-berry">₹{grand}</span></p>
              <div className="flex gap-3">
                <button onClick={async () => { setShowDemoModal(false); setSubmitting(true); try { await placeOrder({ paymentMethod: "demo", paymentStatus: "test" }); } catch (err) { setError(err instanceof Error ? err.message : "Order failed"); } finally { setSubmitting(false); } }} className="flex-1 px-4 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">Pay (Success)</button>
                <button onClick={async () => { setShowDemoModal(false); setSubmitting(true); try { await placeOrder({ paymentMethod: "demo", paymentStatus: "failed" }); } catch (err) { setError(err instanceof Error ? err.message : "Payment failed. Your order was not placed."); } finally { setSubmitting(false); } }} className="flex-1 px-4 py-3 rounded-full border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition">Fail</button>
              </div>
              <button onClick={() => setShowDemoModal(false)} className="mt-3 text-xs text-slate-400 hover:text-slate-600">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (<div><label className="block text-sm font-medium text-slate-700 mb-1">{label}{required && " *"}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-berry" /></div>);
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as { Razorpay?: unknown }).Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}
