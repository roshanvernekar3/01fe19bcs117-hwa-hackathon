"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

type Toast = { id: number; name: string };

export default function FlyLayer() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onAdd = (e: Event) => {
      const detail = (e as CustomEvent<{ name?: string }>).detail;
      setToast({ id: Date.now(), name: detail?.name || "Piece" });
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 3200);
    };
    document.addEventListener("rewear:cart-add", onAdd);
    return () => {
      document.removeEventListener("rewear:cart-add", onAdd);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className="fixed bottom-5 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-rise sm:bottom-7 sm:left-7 sm:translate-x-0"
      role="status"
      aria-live="polite"
    >
      <div className="glass-strong flex items-center gap-3 rounded-2xl p-3 pr-4 shadow-2xl shadow-black/60">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet/15 text-violet-bright">
          <Icon name="check" size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/40">Added to bag</p>
          <p className="truncate text-sm font-medium text-chrome">{toast.name}</p>
        </div>
        <Link
          href="/cart"
          className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-chrome transition-colors hover:border-violet/50 hover:text-violet-bright"
        >
          View bag
        </Link>
      </div>
    </div>
  );
}
