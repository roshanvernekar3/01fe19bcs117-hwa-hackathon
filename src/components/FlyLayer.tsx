"use client";

import { useEffect, useRef, useState } from "react";
import { playAddToCart, playWish } from "@/lib/sound";

type FlyDetail = {
  kind: "cart" | "wish";
  source: HTMLElement;
  emoji: string;
  image?: string;
  name: string;
};

type Flying = {
  id: number;
  emoji: string;
  image?: string;
  from: { x: number; y: number; w: number; h: number };
  to: { x: number; y: number; w: number; h: number };
  name: string;
};

type Toast = {
  id: number;
  message: string;
  x: number;
  y: number;
};

let flySeq = 0;

export default function FlyLayer() {
  const [flying, setFlying] = useState<Flying | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<FlyDetail>).detail;
      const src = detail.source;
      if (!src) return;
      const r = src.getBoundingClientRect();
      const target = document.querySelector<HTMLElement>(detail.kind === "cart" ? '[data-pawberry-fly="cart"]' : '[data-pawberry-fly="wish"]');
      const tRect = target ? target.getBoundingClientRect() : null;
      const end: { x: number; y: number; w: number; h: number } = tRect
        ? { x: tRect.x, y: tRect.y, w: tRect.width, h: tRect.height }
        : { x: window.innerWidth - 80, y: 64, w: 56, h: 56 };
      const el = document.createElement("div");
      el.style.position = "fixed";
      el.style.left = `${r.x}px`;
      el.style.top = `${r.y}px`;
      el.style.width = `${r.width}px`;
      el.style.height = `${r.height}px`;
      el.style.zIndex = "9998";
      el.style.transition = "transform 0.55s cubic-bezier(0.22,0.61,0.36,1), opacity 0.55s ease";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.fontSize = "24px";
      el.style.borderRadius = "12px";
      el.style.background = "rgba(255,255,255,0.95)";
      el.style.boxShadow = "0 12px 32px rgba(47,62,70,0.18)";
      el.style.backdropFilter = "blur(6px)";
      if (detail.image) {
        const img = document.createElement("img");
        img.src = detail.image;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        el.innerHTML = "";
        el.appendChild(img);
      } else {
        el.textContent = detail.emoji;
      }
      el.style.transform = "translate(-50%, -50%)";
      document.body.appendChild(el);
      const toX = end.x + end.w / 2 - r.width / 2;
      const toY = end.y + end.h / 2 - r.height / 2;
      setFlying({ id: ++flySeq, emoji: detail.emoji, image: detail.image, from: { x: r.x, y: r.y, w: r.width, h: r.height }, to: { x: toX, y: toY, w: r.width, h: r.height }, name: detail.name });
      requestAnimationFrame(() => {
        el.style.transform = `translate(${toX - r.x}px, ${toY - r.y}px)`;
      });
      setTimeout(() => {
        el.remove();
        const t = document.querySelector<HTMLElement>(detail.kind === "cart" ? '[data-pawberry-fly="cart"]' : '[data-pawberry-fly="wish"]');
        if (t) {
          t.classList.remove("pawberry-fly-pop");
          void t.offsetWidth;
          t.classList.add("pawberry-fly-pop");
          setTimeout(() => t.classList.remove("pawberry-fly-pop"), 900);
        }
        setFlying(null);
        if (detail.kind === "cart") playAddToCart();
        else playWish();
        setToast({ id: Date.now(), message: detail.kind === "cart" ? "Added to Cart! 🛒" : "Added to Wishlist! ❤️", x: end.x, y: end.y });
        const tt = setTimeout(() => setToast(null), 1400);
        timersRef.current.push(tt);
      }, 620);
    };

    document.addEventListener("pawberry:fly", handler);
    return () => {
      document.removeEventListener("pawberry:fly", handler);
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  if (!flying) return null;
  const toX = flying.to.x;
  const toY = flying.to.y;
  return (
    <>
      <div className="fixed pointer-events-none z-[9997]" style={{ left: flying.from.x, top: flying.from.y, width: flying.from.w, height: flying.from.h, transform: `translate(${toX - flying.from.x}px, ${toY - flying.from.y}px)`, transition: "transform 0.55s cubic-bezier(0.22,0.61,0.36,1)" }}>
        <div className="pawberry-fly-thumb" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.95)", borderRadius: "999px", boxShadow: "0 12px 32px rgba(47,62,70,0.18)", backdropFilter: "blur(6px)" }}>
          <span style={{ fontSize: Math.min(24, flying.from.w * 0.5, flying.from.h * 0.5), lineHeight: 1 }}>{flying.emoji}</span>
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
