"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Getting the paws ready...",
  "Warming up the treats...",
  "Fluffing the pet houses...",
  "Almost time to play!",
  "Fetching your favourites...",
  "Sniffing out the best deals...",
];

const TOYS = ["🎾", "🦴", "🧶", "🛏️", "🛁", "🐾", "✨", "🏠"];

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 900);

    const hide = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 600);
    };

    if (document.readyState === "complete") {
      const t = setTimeout(hide, 700);
      return () => { clearInterval(msgTimer); clearTimeout(t); };
    }
    const onLoad = () => { setTimeout(hide, 500); };
    window.addEventListener("load", onLoad);
    const fallback = setTimeout(hide, 2500);
    return () => {
      clearInterval(msgTimer);
      clearTimeout(fallback);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-blush to-peach ${fading ? "animate-load-fade-out" : ""}`}
      aria-live="polite"
      aria-label="Loading PAWBERRY"
    >
      {/* floating toys */}
      <div className="pointer-events-none absolute inset-0">
        {TOYS.map((t, i) => (
          <span
            key={i}
            className="absolute text-3xl md:text-4xl select-none animate-toy-drift opacity-70"
            style={{
              top: `${12 + (i * 11) % 70}%`,
              left: `${8 + (i * 13) % 84}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3.5 + (i % 3)}s`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* bouncing paw prints */}
      <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="text-2xl animate-paw-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            🐾
          </span>
        ))}
      </div>

      {/* mascots */}
      <div className="relative flex items-end gap-6 md:gap-10 mb-8">
        <div className="relative animate-mascot-bob">
          <span className="text-6xl md:text-8xl select-none drop-shadow-lg">🐶</span>
          <span className="absolute -right-2 bottom-3 text-3xl animate-mascot-tail">🐾</span>
        </div>
        <div className="relative animate-mascot-bob" style={{ animationDelay: "0.6s" }}>
          <span className="text-6xl md:text-8xl select-none drop-shadow-lg">🐱</span>
          <span className="absolute -right-2 bottom-3 text-3xl animate-mascot-tail" style={{ animationDelay: "0.3s" }}>🐾</span>
        </div>
      </div>

      {/* brand */}
      <div className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">
        PAW<span className="text-berry">BERRY</span>
      </div>

      {/* message */}
      <div key={msgIndex} className="mt-4 text-sm md:text-base font-semibold text-muted animate-text-pop">
        {MESSAGES[msgIndex]}
      </div>

      {/* progress bar */}
      <div className="mt-6 w-48 md:w-64 h-2 rounded-full bg-white/60 overflow-hidden shadow-inner">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-berry to-peach animate-load-bar" />
      </div>

      <div className="mt-3 text-xs text-slate-500">Loading your pet paradise…</div>
    </div>
  );
}
