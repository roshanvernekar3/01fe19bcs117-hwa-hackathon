"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { playAddToCart, playWish } from "@/lib/sound";

export type FlyDetail = {
  kind: "cart" | "wish";
  source: HTMLElement;
  emoji: string;
  image?: string;
  name?: string;
  target?: HTMLElement | null;
};

type FlyRect = { x: number; y: number; w: number; h: number };

type Flying = {
  id: number;
  emoji: string;
  from: FlyRect;
  to: FlyRect;
};

type FlyToast = { id: number; message: string; x: number; y: number };

const FLY_W = 40;
const FLY_H = 40;
const FLY_MS = 620;

let flySeq = 0;
export const wishSources = new Map<string, HTMLElement>();

export default function FlyLayer() {
  const [flying, setFlying] = useState<Flying | null>(null);
  const [toast, setToast] = useState<FlyToast | null>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<FlyDetail>).detail;
      const src = detail.source;
      const r = src.getBoundingClientRect();
      const target =
        detail.target ??
        (document.querySelector<HTMLElement>(detail.kind === "cart" ? '[data-pawberry-fly="cart"]' : '[data-pberry-fly="wish"]') as HTMLElement | null);
      const endR = target ? target.getBoundingClientRect() : null;
      const endRect: FlyRect = endR
        ? { x: endR.x, y: endR.y, w: endR.width, h: endR.height }
        : { x: window.innerWidth - 80, y: 64, w: FLY_W, h: FLY_H };
      setFlying({ id: ++flySeq, emoji: detail.emoji, from: { x: r.x, y: r.y, w: r.width, h: r.height }, to: { x: endRect.x, y: endRect.y, w: endRect.w, h: endRect.h } });
      const t = setTimeout(() => {
        setFlying(null);
        if (detail.kind === "cart") playAddToCart();
        else playWish();
        setToast({ id: Date.now(), message: detail.kind === "cart" ? "Added to Cart! 🛒" : "Added to Wishlist! ❤️", x: endRect.x, y: endRect.y });
        const tt = setTimeout(() => setToast(null), 1400);
        timersRef.current.push(tt);
        const icon = detail.target ?? document.querySelector<HTMLElement>(detail.kind === "cart" ? '[data-pberry-fly="cart"]' : '[data-pawberry-fly="wish"]');
        if (icon) icon.classList.add("pawberry-fly-pop");
        setTimeout(() => icon?.classList.remove("pawberry-fly-pop"), 900);
      }, FLY_MS);
      timersRef.current.push(t);
    };
    document.addEventListener("pawberry:fly", handler);
    return () => {
      document.removeEventListener("pawberry:fly", handler);
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  if (!flying) return null;
  const sx = flying.from.x + flying.from.w / 2 - FLY_W / 2;
  const sy = flying.from.y + flying.from.h / 2 - FLY_H / 2;
  const tx = flying.to.x + flying.to.w / 2 - FLY_W / 2;
  const ty = flying.to.y + flying.to.h / 2 - FLY_H / 2;
  return (
    <>
      <div
        key={flying.id}
        className="pawberry-fly"
        style={
          {
            position: "fixed",
            left: sx,
            top: sy,
            width: FLY_W,
            height: FLY_H,
            pointerEvents: "none",
            zIndex: 9997,
            animation: "pawberry-fly-anim 0.55s cubic-bezier(0.22,0.61,0.36,1) forwards",
            "--paw-fly-dx": `${tx - sx}px`,
            "--paw-fly-dy": `${ty - sy}px`,
          } as CSSProperties
        }
      >
        <div
          className="pawberry-fly-thumb"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "999px",
            boxShadow: "0 12px 32px rgba(47,62,70,0.18)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span style={{ fontSize: Math.min(20, FLY_W * 0.5), lineHeight: 1 }}>{flying.emoji}</span>
        </div>
      </div>
      {toast && (
        <div className="fixed z-[9998] px-5 py-2.5 rounded-full bg-navy text-white text-sm font-semibold shadow-xl animate-text-pop" style={{ left: Math.max(16, toast.x - 90), top: Math.max(16, toast.y - 20) }}>
          {toast.message}
        </div>
      )}
    </>
  );
}
