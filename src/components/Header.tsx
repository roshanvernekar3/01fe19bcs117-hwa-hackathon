"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useState, useEffect } from "react";
import ProfileMenu from "@/components/ProfileMenu";

export default function Header() {
  const { count } = useCart();
  const { count: wcount } = useWishlist();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setIsAdmin(Boolean(d?.isAdmin)))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-navy">
          <span className="text-2xl">🐾</span>
          <span>PAW<span className="text-berry">BERRY</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link href="/products" className="hover:text-berry transition">Shop</Link>
          <Link href="/pawplay" className="hover:text-berry transition">PawPlay Match</Link>
          <Link href="/products?category=interactive-toys" className="hover:text-berry transition">Toys</Link>
          <Link href="/products?category=pet-houses" className="hover:text-berry transition">Houses</Link>
          <Link href="/products?category=cat-washrooms" className="hover:text-berry transition">Washrooms</Link>
          <Link href="/#about" className="hover:text-berry transition">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ProfileMenu />
          <Link href="/wishlist" className="relative inline-flex items-center gap-1 px-3 py-2 rounded-full hover:bg-slate-100 transition">
            <span className="text-xl">♡</span>
            {wcount > 0 && (
              <span className="absolute -top-1 -right-1 bg-berry text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {wcount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative inline-flex items-center gap-1 px-3 py-2 rounded-full hover:bg-slate-100 transition">
            <span className="text-xl">🛒</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-berry text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-3 text-sm font-medium">
            <Link href="/products" onClick={() => setOpen(false)}>Shop All</Link>
            <Link href="/pawplay" onClick={() => setOpen(false)}>PawPlay Match</Link>
            <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist ({wcount})</Link>
            <Link href="/cart" onClick={() => setOpen(false)}>Cart ({count})</Link>
            <Link href="/products?category=interactive-toys" onClick={() => setOpen(false)}>Interactive Toys</Link>
            <Link href="/products?category=pet-houses" onClick={() => setOpen(false)}>Pet Houses</Link>
            <Link href="/products?category=cat-washrooms" onClick={() => setOpen(false)}>Cat Washrooms</Link>
            <Link href="/profile" onClick={() => setOpen(false)}>My Profile</Link>
            <Link href="/orders" onClick={() => setOpen(false)}>My Orders</Link>
            <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
            <Link href="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
            {isAdmin && <Link href="/admin" onClick={() => setOpen(false)}>Admin Dashboard</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
