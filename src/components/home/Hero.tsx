"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import GarmentArt from "@/components/GarmentArt";
import Icon from "@/components/ui/Icon";
import Marquee from "@/components/Marquee";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const SIGNALS = [
  { value: "12.8t", label: "waste diverted" },
  { value: "100%", label: "traceable fibre" },
  { value: "∞", label: "repair cycles" },
];

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const stage = stageRef.current;
    if (!stage) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        stage.style.setProperty("--mx", x.toFixed(3));
        stage.style.setProperty("--my", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden pb-10 pt-[132px] sm:pt-[148px] lg:pb-16 lg:pt-[150px]">
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-70" />
        <div className="absolute -left-[22%] top-[-10%] h-[70vw] w-[70vw] rounded-full bg-violet/10 blur-[130px]" />
        <div className="absolute right-[-12%] top-[8%] h-[42vw] w-[42vw] rounded-full bg-violet-deep/20 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void via-void/70 to-transparent" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-6">
          {/* Copy */}
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-bright animate-pulse-dot" />
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-silver/60 sm:text-[10px]">
                SS26 / Drop 01 — system online
              </span>
            </div>

            <h1 className="text-[clamp(3.6rem,12.5vw,10.5rem)] font-bold leading-[0.82] tracking-[-0.055em] text-chrome">
              <span className="block">WEAR</span>
              <span className="block text-outline-violet">THE</span>
              <span className="block text-gradient">FUTURE.</span>
            </h1>

            <div className="mt-7 flex max-w-xl flex-col gap-7 sm:mt-9">
              <p className="max-w-lg text-base leading-relaxed text-silver/60 sm:text-lg">
                A circular fashion system built for the next century. Regenerated-fibre outerwear,
                conductive knits and modular accessories — every piece traceable, repairable and
                designed to return.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/products" className="btn btn-primary group">
                  Explore Drop 01
                  <Icon
                    name="arrow-up-right"
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <Link href="/style-match" className="btn btn-ghost group">
                  <Icon name="sparkle" size={16} className="text-violet-bright" />
                  AI Style Match
                </Link>
              </div>

              <div className="grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {SIGNALS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl font-semibold tracking-tight text-chrome sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/35 sm:text-[9px]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3D stage */}
          <div ref={stageRef} className="relative mx-auto w-full max-w-[640px] lg:max-w-none" style={{ "--mx": 0, "--my": 0 } as React.CSSProperties}>
            <div className="relative aspect-[4/5] w-full sm:aspect-square lg:aspect-[4/4.6]">
              {/* halo rings */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="absolute h-[78%] w-[78%] rounded-full bg-violet/10 blur-[70px]" />
                <div className="absolute h-[86%] w-[86%] rounded-full border border-white/[0.06]" />
                <div className="absolute h-[68%] w-[68%] rounded-full border border-violet/15" />
                <div
                  className="absolute h-[92%] w-[92%] rounded-full border border-dashed border-white/[0.08] animate-spin-slow"
                  style={{ transform: "translateX(calc(var(--mx) * -10px))" }}
                />
              </div>

              {/* WebGL layer */}
              <div
                className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
              >
                <HeroScene onReady={() => setReady(true)} className="h-full w-full" />
              </div>

              {/* Instant fallback / mobile art */}
              <div
                className={`absolute inset-0 transition-all duration-700 ${
                  ready ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
                style={{
                  transform:
                    "translate3d(calc(var(--mx) * 12px), calc(var(--my) * 10px), 0)",
                }}
              >
                <GarmentArt
                  kind="trench"
                  label="Aegis Shell floating techwear outfit"
                  slug="hero"
                  variant="hero"
                  showHud={false}
                  className="h-full w-full drop-shadow-[0_30px_80px_rgba(168,85,247,0.28)]"
                />
              </div>

              {/* floating data chips */}
              <div className="pointer-events-none absolute left-1 top-[18%] hidden sm:block">
                <div className="glass rounded-xl px-3 py-2 shadow-2xl shadow-black/40 animate-float-slow">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/40">Fibre origin</p>
                  <p className="mt-0.5 text-[11px] font-medium text-chrome">100% traceable</p>
                </div>
              </div>
              <div className="pointer-events-none absolute right-0 top-[34%] hidden sm:block">
                <div className="glass rounded-xl px-3 py-2 shadow-2xl shadow-black/40 animate-float" style={{ animationDelay: "1.2s" }}>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/40">Impact</p>
                  <p className="mt-0.5 text-[11px] font-medium text-violet-bright">−12.4 kg CO₂e</p>
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-[22%] right-[4%] hidden md:block">
                <div className="glass rounded-xl px-3 py-2 shadow-2xl shadow-black/40 animate-float-slow" style={{ animationDelay: "2s" }}>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/40">Status</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-chrome">
                    <span className="h-1 w-1 rounded-full bg-violet-bright animate-pulse-dot" />
                    Repair for life
                  </p>
                </div>
              </div>

              {/* HUD footer */}
              <div className="absolute inset-x-3 bottom-2 sm:inset-x-6 sm:bottom-4">
                <div className="flex items-end justify-between border-t border-white/10 pt-3">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/35">Object / 001</p>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.12em] text-chrome">
                      Aegis Shell — Bio-Synth
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/35">
                      {ready ? "Live 3D" : "Hologram"}
                    </p>
                    <p className="mt-0.5 flex items-center justify-end gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-violet-bright">
                      <span className="h-1 w-1 rounded-full bg-violet-bright animate-pulse-dot" />
                      SS26
                    </p>
                  </div>
                </div>
              </div>

              {/* corner brackets */}
              <div className="pointer-events-none absolute inset-2 sm:inset-4">
                <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-violet/40" />
                <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-violet/40" />
                <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-violet/40" />
                <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-violet/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom ticker */}
      <div className="mt-12 border-y border-white/[0.07] bg-white/[0.015] py-3 sm:mt-16">
        <Marquee speed="slow">
          {[
            "Designed to disappear",
            "Never to waste",
            "Circular by design",
            "Repair for life",
            "Trace every thread",
            "SS26 / Drop 01",
          ].map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="px-5 font-mono text-[9px] uppercase tracking-[0.26em] text-silver/45 sm:text-[10px]">
                {item}
              </span>
              <span className="text-violet/50">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x mt-5 hidden items-center justify-between sm:flex">
        <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-silver/25">
          Scroll to enter the system
        </p>
        <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-silver/25">
          <span className="h-6 w-px bg-gradient-to-b from-violet/60 to-transparent" />
          05 chapters
        </div>
      </div>
    </section>
  );
}
