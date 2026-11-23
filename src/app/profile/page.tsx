"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/orders";

type Me = { user: { email: string; name: string; role: string; avatar?: string } | null; isAdmin: boolean };

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "orders" | "wishlist">("profile");
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const [savingAvatar, setSavingAvatar] = useState(false);

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
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

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

  if (loading) return <div className="p-10 text-center text-slate-500">Loading...</div>;

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
                {avatar && (avatar.startsWith("http") ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : avatar)}
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
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      setSavingAvatar(true);
                      try {
                        const res = await fetch("/api/auth/profile", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ image: reader.result }),
                        });
                        const d = await res.json();
                        if (res.ok) setAvatar(d.user.avatar);
                      } finally {
                        setSavingAvatar(false);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <button
                onClick={async () => {
                  setSavingAvatar(true);
                  try {
                    const res = await fetch("/api/auth/profile", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ avatar }),
                    });
                    const d = await res.json();
                    if (res.ok) setAvatar(d.user.avatar);
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
                    <div className="font-bold text-navy">{o.id}</div>
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