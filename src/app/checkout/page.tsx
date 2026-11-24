"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import Icon from "@/components/ui/Icon";

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

  function update(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  function validate() {
    if (!form.name || !form.email || !form.address || !form.city || !form.zip || !form.country) {
      setError("Please complete all required fields."); return false;
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
          body: JSON.stringify({ amount: grand, receipt: `rewear_${Date.now()}` }),
        });
        const rd = await r.json();
        if (!r.ok) throw new Error(rd.error || "Payment setup failed");

        await loadRazorpayScript();
        const rzp = new (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay({
          key: gateway.keyId,
          amount: rd.order.amount,
          currency: rd.order.currency,
          name: "REWEAR",
          description: "REWEAR — circular fashion",
          order_id: rd.order.id,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#A855F7" },
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

  if (items.length === 0) {
    return (
      <div className="relative flex min-h-[70vh] items-center pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="container-x flex flex-col items-center text-center">
          <p className="eyebrow">Checkout / 00</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-chrome sm:text-5xl">
            Nothing to <span className="text-outline">check out.</span>
          </h1>
          <p className="mt-3 max-w-sm text-sm text-silver/45">Add a piece to your bag to continue.</p>
          <Link href="/products" className="btn btn-primary mt-7">
            Explore the catalogue <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72">
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="container-x pb-20">
        <div className="mb-8 border-b border-white/[0.08] pb-6">
          <p className="eyebrow mb-3">Secure checkout</p>
          <h1 className="text-[clamp(2.8rem,7vw,5.2rem)] font-medium leading-none tracking-[-0.05em] text-chrome">
            Complete the <span className="text-gradient">loop.</span>
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.45fr_0.85fr] lg:gap-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {isLoggedIn && addresses.length > 0 && (
              <section>
                <SectionTitle index="01" title="Saved addresses" />
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {addresses.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => selectAddress(a)}
                      className={`rounded-xl border p-3.5 text-left transition ${
                        selectedAddressId === a.id
                          ? "border-violet/60 bg-violet/[0.075]"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-chrome">{a.label}</span>
                        {a.isDefault && (
                          <span className="rounded-full bg-violet/15 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-violet-bright">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 truncate text-xs text-silver/45">{a.address}, {a.city} {a.zip}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionTitle index={isLoggedIn && addresses.length > 0 ? "02" : "01"} title="Contact" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Full name" value={form.name} onChange={(v) => update("name", v)} required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
                <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
                <Field label="Country" value={form.country} onChange={(v) => update("country", v)} required />
              </div>
            </section>

            <section>
              <SectionTitle index={isLoggedIn && addresses.length > 0 ? "03" : "02"} title="Delivery" />
              <div className="mt-4 space-y-3">
                <Field label="Address" value={form.address} onChange={(v) => update("address", v)} required />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
                  <Field label="ZIP / Postal code" value={form.zip} onChange={(v) => update("zip", v)} required />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40">
                    Order notes <span className="text-silver/20">(optional)</span>
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    className="field resize-none"
                    placeholder="Delivery instructions, fit notes, repair request…"
                  />
                </div>
              </div>
              {isLoggedIn ? (
                <label className="mt-3 flex items-center gap-2 text-xs text-silver/45">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="accent-violet" />
                  Save this address for next time
                </label>
              ) : (
                <p className="mt-3 text-xs text-silver/35">
                  <Link href="/login" className="text-violet-bright hover:underline">Log in</Link> to save your address for faster checkout.
                </p>
              )}
            </section>

            <section>
              <SectionTitle index={isLoggedIn && addresses.length > 0 ? "04" : "03"} title="Payment" />
              <div className="mt-4 space-y-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${paymentMethod === "cod" ? "border-violet/60 bg-violet/[0.075]" : "border-white/10 hover:border-white/25"}`}>
                  <input type="radio" name="pm" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="mt-0.5 accent-violet" />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-chrome">Cash on delivery</div>
                    <div className="mt-0.5 text-xs text-silver/40">Pay when your piece arrives. Available across India.</div>
                  </div>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${paymentMethod === "online" ? "border-violet/60 bg-violet/[0.075]" : "border-white/10 hover:border-white/25"}`}>
                  <input type="radio" name="pm" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="mt-0.5 accent-violet" />
                  <div>
                    <div className="text-sm font-medium text-chrome">
                      {gateway.enabled ? "Pay online — Razorpay" : "Pay online — demo mode"}
                    </div>
                    <div className="mt-0.5 text-xs text-silver/40">
                      {gateway.enabled ? "UPI, cards and netbanking via Razorpay." : "Test checkout. No real money — Razorpay keys are not configured."}
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-red-400/25 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full disabled:opacity-60"
            >
              {submitting
                ? "Processing…"
                : paymentMethod === "online"
                  ? `Pay ${formatPrice(grand)}`
                  : `Place order · ${formatPrice(grand)}`}
              {!submitting && <Icon name="arrow-right" size={16} />}
            </button>
            <p className="text-center font-mono text-[8px] uppercase tracking-[0.14em] text-silver/25">
              {paymentMethod === "cod"
                ? "Your order will be saved. Pay on delivery."
                : "You will be redirected to Razorpay's secure checkout."}
            </p>
          </form>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-white/[0.1] bg-white/[0.025] p-5 backdrop-blur sm:p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/35">
                Order summary / {String(items.reduce((s, i) => s + i.qty, 0)).padStart(2, "0")}
              </p>
              <div className="mt-5 max-h-64 space-y-3 overflow-auto pr-1">
                {items.map((i) => (
                  <div key={i.key} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-silver/65">{i.name}</p>
                      <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-silver/25">
                        Qty {i.qty}{i.size ? ` / ${i.size}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-chrome">{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between text-silver/55">
                  <span>Subtotal</span><span className="text-chrome">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-silver/55">
                  <span>Delivery</span>
                  <span className="text-violet-bright">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold text-chrome">
                  <span>Total</span><span>{formatPrice(grand)}</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-violet/20 bg-violet/[0.045] p-3">
                <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-violet-bright/80">
                  <Icon name="recycle" size={12} /> Circular promise
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-silver/45">
                  Every order includes lifetime repairs and a take-back route for the fibre.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-void/80 p-4 backdrop-blur-xl">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-violet/30 bg-violet/10 text-violet-bright">
              <Icon name="scan" size={22} />
            </span>
            <h3 className="mt-4 text-xl font-medium text-chrome">Demo payment</h3>
            <p className="mt-2 text-xs leading-relaxed text-silver/45">
              Test mode — no real money. Amount: <span className="font-semibold text-violet-bright">{formatPrice(grand)}</span>
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={async () => { setShowDemoModal(false); setSubmitting(true); try { await placeOrder({ paymentMethod: "demo", paymentStatus: "test" }); } catch (err) { setError(err instanceof Error ? err.message : "Order failed"); } finally { setSubmitting(false); } }}
                className="btn btn-primary btn-sm flex-1"
              >
                Pay (success)
              </button>
              <button
                onClick={async () => { setShowDemoModal(false); setSubmitting(true); try { await placeOrder({ paymentMethod: "demo", paymentStatus: "failed" }); } catch (err) { setError(err instanceof Error ? err.message : "Payment failed. Your order was not placed."); } finally { setSubmitting(false); } }}
                className="btn btn-ghost btn-sm flex-1"
              >
                Fail
              </button>
            </div>
            <button onClick={() => setShowDemoModal(false)} className="mt-4 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/30 hover:text-chrome">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3">
      <span className="font-mono text-[9px] tracking-[0.18em] text-violet/60">{index}</span>
      <h2 className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/55">{title}</h2>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40">
        {label} {required && <span className="text-violet-bright/60">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="field"
      />
    </div>
  );
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
