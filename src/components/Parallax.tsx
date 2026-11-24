"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lightweight scroll parallax. Disabled for reduced-motion users and on
 * viewports where it would cost more than it adds.
 */
export default function Parallax({
  children,
  speed = 0.12,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    if (reduce || small) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [enabled, speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: enabled ? "transform" : undefined }}>
      {children}
    </div>
  );
}
