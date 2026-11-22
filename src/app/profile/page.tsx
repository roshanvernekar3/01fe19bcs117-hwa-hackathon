"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Me = { user: { email: string; name: string; role: string } | null; isAdmin: boolean };

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMe(d))
      .catch(() => setMe({ user: null, isAdmin: false }))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-navy mb-6">My Profile</h1>
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blush to-peach flex items-center justify-center text-3xl">👤</div>
          <div>
            <div className="font-bold text-navy text-lg">{me.user.name}</div>
            <div className="text-slate-500 text-sm">{me.user.email}</div>
            <div className="text-xs text-berry font-semibold capitalize mt-1">{me.user.role}{me.isAdmin ? " · admin" : ""}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <Link href="/orders" className="p-4 rounded-2xl bg-cream border border-slate-100 hover-lift">
            <div className="text-2xl mb-1">📦</div>
            <div className="font-bold text-navy">My Orders</div>
            <div className="text-xs text-slate-500">Track your purchases</div>
          </Link>
          <Link href="/wishlist" className="p-4 rounded-2xl bg-cream border border-slate-100 hover-lift">
            <div className="text-2xl mb-1">♡</div>
            <div className="font-bold text-navy">Wishlist</div>
            <div className="text-xs text-slate-500">Saved favourites</div>
          </Link>
          {me.isAdmin && (
            <Link href="/admin" className="p-4 rounded-2xl bg-cream border border-slate-100 hover-lift">
              <div className="text-2xl mb-1">🛠️</div>
              <div className="font-bold text-navy">Admin Dashboard</div>
              <div className="text-xs text-slate-500">Manage products & orders</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
