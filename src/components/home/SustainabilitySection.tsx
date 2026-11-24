import Link from "next/link";
import Reveal from "@/components/Reveal";
import Icon from "@/components/ui/Icon";
import { SUSTAINABILITY_PILLARS } from "@/lib/brand";

const LOOP = [
  { label: "Source", value: "Reclaimed fibre", x: 50, y: 4 },
  { label: "Make", value: "Zero-waste cut", x: 96, y: 50 },
  { label: "Wear", value: "Repair for life", x: 50, y: 96 },
  { label: "Return", value: "Re-spin", x: 4, y: 50 },
];

export default function SustainabilitySection() {
  return (
    <section
      id="sustainability"
      className="relative overflow-hidden border-t border-white/[0.07] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <p className="absolute -right-10 top-10 select-none text-[28vw] font-bold leading-none tracking-[-0.08em] text-outline opacity-[0.06]">
          LOOP
        </p>
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-violet/10 blur-[120px]" />
      </div>

      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-24">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">04 / Sustainability</p>
              <h2 className="text-[clamp(2.5rem,6.4vw,5.4rem)] font-medium leading-[0.92] tracking-[-0.045em] text-chrome">
                Nothing is waste.
                <br />
                <span className="text-violet-gradient">Everything is material.</span>
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-silver/55 sm:text-base">
                Circularity is not a marketing layer here — it is the architecture. We track fibre
                from recovery to re-spin, design every seam for disassembly, and keep each piece in
                use for as long as possible. The most sustainable garment is the one you already own —
                so we build them to be kept.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/sustainability" className="btn btn-ghost group">
                  Read the impact report
                  <Icon name="arrow-up-right" size={15} className="text-violet-bright transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-12 space-y-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]">
              {SUSTAINABILITY_PILLARS.map((pillar, i) => (
                <Reveal key={pillar.index} delay={i * 100} variant="fade">
                  <div className="group grid gap-2 bg-carbon px-5 py-5 transition-colors hover:bg-white/[0.025] sm:grid-cols-[48px_1fr] sm:gap-5">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-violet/60">
                      {pillar.index}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-chrome">{pillar.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-silver/40">{pillar.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* loop diagram */}
          <Reveal variant="scale" delay={120}>
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              <div className="absolute inset-[8%] rounded-full bg-violet/[0.06] blur-2xl" />
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="loopGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F1F2F6" />
                    <stop offset="55%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#6D28D9" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.25" />
                <circle
                  cx="50"
                  cy="50"
                  r="34"
                  fill="none"
                  stroke="url(#loopGrad)"
                  strokeWidth="0.45"
                  strokeDasharray="3 4"
                  className="animate-spin-slow"
                  style={{ transformOrigin: "50% 50%", animationDuration: "40s" }}
                />
                <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(168,85,247,0.2)" strokeWidth="0.25" />
                <circle cx="50" cy="50" r="13" fill="rgba(168,85,247,0.05)" stroke="rgba(192,132,252,0.28)" strokeWidth="0.25" />
                <path d="M50 36V64M42 46L50 36L58 46" stroke="rgba(241,242,246,0.55)" strokeWidth="0.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <text x="50" y="73" textAnchor="middle" fill="rgba(201,203,212,0.45)" fontSize="2.6" fontFamily="var(--font-space-mono), monospace" letterSpacing="0.8">
                  0% WASTE
                </text>
              </svg>

              {LOOP.map((node) => (
                <div
                  key={node.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="glass w-[102px] rounded-xl px-2.5 py-2 text-center shadow-xl shadow-black/40 sm:w-[120px]">
                    <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-violet-bright/80">
                      {node.label}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-chrome sm:text-[11px]">
                      {node.value}
                    </p>
                  </div>
                </div>
              ))}

              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-bright animate-pulse-dot" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
            {[
              { value: "82%", label: "lower CO₂e per piece" },
              { value: "0", label: "virgin plastic" },
              { value: "100%", label: "fibre traceability" },
              { value: "∞", label: "repairs, free" },
            ].map((stat) => (
              <div key={stat.label} className="bg-carbon px-4 py-5 text-center sm:px-6">
                <p className="text-xl font-medium text-chrome sm:text-2xl">{stat.value}</p>
                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.14em] text-silver/35 sm:text-[8px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
