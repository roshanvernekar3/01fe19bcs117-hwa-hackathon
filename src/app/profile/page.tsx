"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/orders";
import PawLoader from "@/components/PawLoader";

type Me = { user: { email: string; name: string; role: string; avatar?: string } | null; isAdmin: boolean };

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "orders" | "wishlist">(() => {
    if (typeof window === "undefined") return "profile";
    const t = new URLSearchParams(window.location.search).get("tab");
    return t === "orders" || t === "wishlist" ? t : "profile";
  });
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<
    { id: string; label: string; name: string; phone: string; address: string; city: string; zip: string; country: string; isDefault: boolean }[]
  >([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    (async () => {
      try {
        const m = await fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json());
        setMe(m);
        if (m?.user?.email) {
          setAvatar(m.user.avatar || "🐾");
          const res = await fetch("/api/orders/mine", { cache: "no-store" });
          if (res.ok) {
            const d = await res.json();
            setOrders(d.orders || []);
          }
          const ar = await fetch("/api/addresses", { cache: "no-store" });
          if (ar.ok) {
            const ad = await ar.json();
            setAddresses(ad.addresses || []);
          }
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  async function removeAddress(id: string) {
    if (!confirm("Remove this address?")) return;
    const res = await fetch(`/api/addresses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const d = await res.json();
    if (res.ok) setAddresses(d.addresses || []);
  }

  async function makeDefaultAddress(id: string) {
    const res = await fetch("/api/addresses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const d = await res.json();
    if (res.ok) setAddresses(d.addresses || []);
  }

  async function cancelOrder(id: string) {
    if (!confirm("Cancel this order?")) return;
    setCancelling(id);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "cancelled" }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setCancelling(null);
    }
  }

  if (loading) return <PawLoader message="Loading your profile…" />;

  if (!me?.user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h1 className="text-3xl font-extrabold text-navy">Please log in</h1>
        <p className="text-slate-500 mt-2">You need an account to view your profile.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/login" className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">Login</Link>
          <Link href="/signup" className="px-6 py-3 rounded-full border border-slate-200 font-semibold hover:bg-slate-50">Sign Up</Link>
        </div>
      </div>
    );
  }

  const user = me.user;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 mb-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blush to-peach flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
          {user.avatar && (user.avatar.startsWith("http") ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.avatar)}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-navy">{user.name}</h1>
          <p className="text-slate-500 text-sm">{user.email}</p>
          <span className="inline-block mt-2 text-xs font-semibold text-berry bg-berry/10 px-3 py-1 rounded-full capitalize">{user.role}</span>
        </div>
        <div className="flex gap-2">
          <Link href="/orders" className="px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold hover:bg-slate-50">Track Order</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {(["profile", "orders", "wishlist"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px transition ${tab === t ? "border-berry text-berry" : "border-transparent text-slate-500 hover:text-navy"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-navy mb-4">Profile Picture</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blush to-peach flex items-center justify-center text-4xl overflow-hidden">
                {avatar && (avatar.startsWith("http") || avatar.startsWith("data:")) ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  avatar || "🐾"
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-500 mb-2">Choose a pet avatar</div>
                <div className="flex flex-wrap gap-2">
                  {["🐾","🐶","🐱","🐰","🐹","🦊","🐻","🐼","🐨","🐯","🦁","🐮"].map((e) => (
                    <button
                      key={e}
                      onClick={() => setAvatar(e)}
                      className={`w-10 h-10 rounded-full text-xl flex items-center justify-center border-2 transition ${avatar === e ? "border-berry bg-berry/10" : "border-slate-200 hover:border-berry"}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold cursor-pointer hover:bg-slate-50">
                {savingAvatar ? "Uploading..." : "Upload photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={savingAvatar}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    if (!file.type.startsWith("image/")) {
                      setAvatarMsg("Please choose an image file.");
                      return;
                    }
                    setAvatarMsg(null);
                    setSavingAvatar(true);
                    try {
                      const dataUrl = await compressImage(file, 512, 0.85);
                      const res = await fetch("/api/auth/profile", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: dataUrl }),
                      });
                      const d = await res.json().catch(() => ({}));
                      if (!res.ok) throw new Error(d.error || "Upload failed");
                      setAvatar(d.user.avatar);
                      setAvatarMsg("Photo saved!");
                    } catch (err) {
                      setAvatarMsg(err instanceof Error ? err.message : "Upload failed");
                    } finally {
                      setSavingAvatar(false);
                    }
                  }}
                />
              </label>
              <button
                onClick={async () => {
                  setAvatarMsg(null);
                  setSavingAvatar(true);
                  try {
                    const res = await fetch("/api/auth/profile", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ avatar }),
                    });
                    const d = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(d.error || "Could not save avatar");
                    setAvatar(d.user.avatar);
                    setAvatarMsg("Avatar saved!");
                  } catch (err) {
                    setAvatarMsg(err instanceof Error ? err.message : "Could not save avatar");
                  } finally {
                    setSavingAvatar(false);
                  }
                }}
                disabled={savingAvatar}
                className="px-5 py-2 rounded-full bg-berry text-white text-sm font-semibold hover:bg-berry-dark transition disabled:opacity-60"
              >
                {savingAvatar ? "Saving..." : "Save Avatar"}
              </button>
            </div>
            {avatarMsg && (
              <p className={`mt-3 text-sm ${avatarMsg.includes("saved") ? "text-green-600" : "text-red-500"}`}>{avatarMsg}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-navy mb-4">Account Details</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Name</span><div className="font-semibold text-navy">{user.name}</div></div>
            <div><span className="text-slate-500">Email</span><div className="font-semibold text-navy">{user.email}</div></div>
            <div><span className="text-slate-500">Role</span><div className="font-semibold text-navy capitalize">{user.role}</div></div>
            <div><span className="text-slate-500">Member since</span><div className="font-semibold text-navy">{new Date().toLocaleDateString()}</div></div>
          </div>
          <div className="mt-6">
            <Link href="/orders" className="text-berry font-semibold hover:underline">View all orders →</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-navy">Saved Addresses</h2>
            <Link href="/checkout" className="text-xs font-semibold text-berry hover:underline">Add at checkout →</Link>
          </div>
          {addresses.length === 0 ? (
            <p className="text-sm text-slate-500">
              No saved addresses yet. Your address is saved automatically when you tick “Save this address for next time” at checkout.
            </p>
          ) : (
            <div className="space-y-3">
              {addresses.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-navy flex items-center gap-2">
                      {a.label}
                      {a.isDefault && <span className="text-[10px] px-2 py-0.5 rounded-full bg-berry/10 text-berry font-semibold">Default</span>}
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      {!a.isDefault && (
                        <button onClick={() => makeDefaultAddress(a.id)} className="text-berry hover:underline">Make default</button>
                      )}
                      <button onClick={() => removeAddress(a.id)} className="text-red-600 hover:underline">Remove</button>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {a.name} · {a.phone}<br />
                    {a.address}, {a.city} {a.zip}, {a.country}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      )}
      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-5xl mb-3">📦</div>
              No orders yet. <Link href="/products" className="text-berry font-semibold hover:underline">Start shopping</Link>
            </div>
          ) : (
            orders.map((o) => (
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
                {o.status !== "cancelled" && o.status !== "delivered" && o.status !== "shipped" && (
                  <button
                    onClick={() => cancelOrder(o.id)}
                    disabled={cancelling === o.id}
                    className="mt-3 text-xs text-red-600 hover:underline disabled:opacity-50"
                  >
                    {cancelling === o.id ? "Cancelling..." : "Cancel order"}
                  </button>
                )}
                <div className="mt-3">
                  <Link href={`/orders/${encodeURIComponent(o.id)}`} className="text-xs font-semibold text-berry hover:underline">
                    View details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "wishlist" && (
        <div className="text-center py-8">
          <Link href="/wishlist" className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition">
            View Wishlist
          </Link>
        </div>
      )}
    </div>
  );
}
function compressImage(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Could not process image"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}
