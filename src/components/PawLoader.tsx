"use client";

import { useEffect, useState } from "react";

const MSGS = ["Getting paws ready…", "Almost there…", "Fetching goodies…", "Sniffing it out…"];

export default function PawLoader({ message, size = "md" }: { message?: string; size?: "sm" | "md" | "lg" }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MSGS.length), 1200);
    return () => clearInterval(t);
  }, []);
  const text = message || MSGS[i];
  const mascotSize = size === "sm" ? "text-3xl" : size === "lg" ? "text-6xl" : "text-4xl";
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center" role="status" aria-live="polite">
      <div className="flex items-end gap-2">
        <span className={`${mascotSize} animate-mascot-bob select-none drop-shadow`}>🐶</span>
        <span className={`${mascotSize} animate-mascot-bob select-none drop-shadow`} style={{ animationDelay: "0.5s" }}>🐱</span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((n) => (
          <span key={n} className="text-lg animate-paw-bounce" style={{ animationDelay: `${n * 0.18}s` }}>🐾</span>
        ))}
      </div>
      <div className="text-sm font-semibold text-muted animate-text-pop" key={text}>{text}</div>
    </div>
  );
}
