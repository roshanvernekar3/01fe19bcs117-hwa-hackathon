"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AvatarViewer from "@/components/AvatarViewer";

type Me = { user: { email: string; name: string; role: string; avatar?: string } | null; isAdmin: boolean };

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      setMe(await res.json());
    } catch {
      setMe({ user: null, isAdmin: false });
    }
  }

  const pathname = usePathname();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    await load();
    window.location.href = "/";
  }

  const user = me?.user;
  const isAdmin = me?.isAdmin;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="profile"
        className="inline-flex items-center gap-1 px-3 py-2 rounded-full hover:bg-slate-100 transition"
      >
        <span className="w-7 h-7 inline-flex items-center justify-center text-xl overflow-hidden rounded-full">
          {user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("data:")) ? (
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            user ? (user.avatar || "👤") : "👤"
          )}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
          {user ? (
            <>
              <Link href="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-50">My Profile</Link>
              <Link href="/orders" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-50">My Orders</Link>
              <Link href="/wishlist" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-50">Wishlist</Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm font-semibold text-berry hover:bg-slate-50">Admin Dashboard</Link>
              )}
              <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-50">Login</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-50">Sign Up</Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm font-semibold text-berry hover:bg-slate-50">Admin Dashboard</Link>
              )}
            </>
          )}
        </div>
      )}
      {viewerSrc && <AvatarViewer src={viewerSrc} onClose={() => setViewerSrc(null)} />}
    </div>
  );
}