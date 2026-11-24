"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AvatarViewer from "@/components/AvatarViewer";
import Icon from "@/components/ui/Icon";

type Me = { user: { email: string; name: string; role: string; avatar?: string } | null; isAdmin: boolean };

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  async function load() {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      setMe(await res.json());
    } catch {
      setMe({ user: null, isAdmin: false });
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        aria-label="Account"
        aria-expanded={open}
        className="icon-btn"
      >
        {user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("data:")) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
        ) : (
          <Icon name="user" size={19} />
        )}
      </button>

      {open && (
        <div className="glass-strong absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl p-2 shadow-2xl shadow-black/60">
          {user ? (
            <>
              <div className="border-b border-white/[0.08] px-3 pb-3 pt-2">
                <p className="truncate text-sm font-medium text-chrome">{user.name}</p>
                <p className="truncate font-mono text-[10px] text-silver/45">{user.email}</p>
              </div>
              <div className="py-1">
                <MenuLink href="/profile" onClick={() => setOpen(false)}>Profile</MenuLink>
                <MenuLink href="/orders" onClick={() => setOpen(false)}>Orders</MenuLink>
                <MenuLink href="/wishlist" onClick={() => setOpen(false)}>Wishlist</MenuLink>
                {isAdmin && (
                  <MenuLink href="/admin" onClick={() => setOpen(false)} accent>Ops console</MenuLink>
                )}
              </div>
              <button
                onClick={logout}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-300/80 hover:bg-red-500/10 hover:text-red-200"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="p-2">
              <p className="px-1 pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-silver/40">
                Access the system
              </p>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="btn btn-primary btn-sm mb-2 w-full"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="btn btn-ghost btn-sm w-full"
              >
                Create account
              </Link>
              {isAdmin && (
                <MenuLink href="/admin" onClick={() => setOpen(false)} accent>
                  Ops console
                </MenuLink>
              )}
            </div>
          )}
        </div>
      )}

      {viewerSrc && <AvatarViewer src={viewerSrc} onClose={() => setViewerSrc(null)} />}
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  children,
  accent,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-xl px-3 py-2 text-sm hover:bg-white/[0.06] ${
        accent ? "text-violet-bright" : "text-silver/70 hover:text-chrome"
      }`}
    >
      {children}
    </Link>
  );
}
