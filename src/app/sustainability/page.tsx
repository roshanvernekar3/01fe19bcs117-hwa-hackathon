import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import GarmentArt from "@/components/GarmentArt";
import Icon from "@/components/ui/Icon";
import { CARE_STEPS, MATERIALS, SUSTAINABILITY_PILLARS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "REWEAR's circular system: traceable fibre, zero-waste construction, free repairs for life and take-back that turns old pieces into the next drop.",
};

const REPORT_ROWS = [
  { label: "Textile waste diverted", value: "12.8 tonnes", note: "since launch" },
  { label: "Recycled / regenerated content", value: "100%", note: "across Drop 01" },
  { label: "Virgin plastic", value: "0 g", note: "by design" },
  { label: "Average CO₂e avoided", value: "9.9 kg", note: "per piece" },
  { label: "Water saved vs. conventional", value: "76%", note: "dye + wash" },
  { label: "Repairs completed", value: "2,410", note: "free, lifetime" },
];

const TIMELINE = [
  {
    index: "01",
    title: "Recover",
    body: "Marine plastic, post-consumer denim and production offcuts are collected, sorted by fibre type and cleaned without virgin solvents.",
  },
  {
    index: "02",
    title: "Regenerate",
    body: "Fibre is re-spun or re-grown in a closed-loop biorefinery. Dye chemistry is reclaimed and recirculated, cutting water use by 76%.",
  },
  {
    index: "03",
    title: "Build",
    body: "Patterns are laser-cut for near-zero waste. Seams are stitched to be undone, and every component carries a material ID.",
  },
  {
    index: "04",
    title: "Return",
    body: "When you are done, send the piece back. It is repaired, re-sold, or re-spun — and the passport records where it went next.",
  },
];

export default function SustainabilityPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-bg opacity-45" />
          <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-violet/12 blur-[130px]" />
          <p className="absolute -right-6 top-24 select-none text-[24vw] font-bold leading-none tracking-[-0.08em] text-outline opacity-[0.05]">
            LOOP
          </p>
        </div>

        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="eyebrow mb-4">Impact / 2026</p>
              <h1 className="text-[clamp(2.8rem,8vw,6.6rem)] font-bold leading-[0.88] tracking-[-0.055em] text-chrome">
                Nothing is waste.
                <br />
                <span className="text-gradient">Everything is material.</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-silver/55 sm:text-base">
                Circularity is the architecture, not a campaign. We track fibre from recovery to
                re-spin, design every seam for disassembly, and keep each piece in use for as long as
                possible. The most sustainable garment is the one you already own — so we build them
                to be kept.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="chip"><Icon name="recycle" size={11} /> Closed loop</span>
                <span className="chip"><Icon name="leaf" size={11} /> Carbon-neutral</span>
                <span className="chip"><Icon name="scan" size={11} /> Fibre passports</span>
                <span className="chip"><Icon name="shield" size={11} /> Repair for life</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[420px]">
              <div className="absolute inset-8 rounded-full bg-violet/10 blur-[80px]" />
              <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
              <div className="absolute inset-6 rounded-full border border-dashed border-white/[0.08] animate-spin-slow" />
              <GarmentArt
                kind="trench"
                label="Circular trench"
                slug="sustainability"
                variant="hero"
                showHud={false}
                className="relative h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="report" className="border-y border-white/[0.07] bg-white/[0.012]">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-px overflow-hidden bg-white/[0.08] sm:grid-cols-3 lg:grid-cols-6">
            {REPORT_ROWS.map((row, i) => (
              <Reveal key={row.label} delay={i * 60} variant="fade">
                <div className="h-full bg-void px-4 py-6 sm:px-5">
                  <p className="text-xl font-medium tracking-tight text-chrome sm:text-2xl">{row.value}</p>
                  <p className="mt-1 font-mono text-[7px] uppercase leading-relaxed tracking-[0.14em] text-silver/35 sm:text-[8px]">
                    {row.label}
                  </p>
                  <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.12em] text-violet-bright/50">
                    {row.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="materials" className="py-24 sm:py-28">
        <div className="container-x">
          <Reveal>
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-4">01 / Materials</p>
                <h2 className="text-[clamp(2.2rem,5.6vw,4.4rem)] font-medium leading-[0.95] tracking-[-0.045em] text-chrome">
                  Feedstock, <span className="text-outline">not excuse.</span>
                </h2>
              </div>
              <p className="max-w-xs text-xs leading-relaxed text-silver/40">
                Every material in Drop 01 is listed with its source, use and measured saving. If we
                cannot verify it, we do not claim it.
              </p>
            </div>
          </Reveal>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.9fr] gap-4 border-b border-white/[0.08] bg-white/[0.02] px-5 py-3 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/35 md:grid">
              <span>Material</span>
              <span>Source</span>
              <span>Used in</span>
              <span className="text-right">Saving</span>
            </div>
            <div className="divide-y divide-white/[0.08]">
              {MATERIALS.map((m, i) => (
                <Reveal key={m.name} delay={i * 70} variant="fade">
                  <div className="grid gap-1.5 px-5 py-4 transition-colors hover:bg-white/[0.02] md:grid-cols-[1.2fr_1fr_0.8fr_0.9fr] md:items-center md:gap-4">
                    <p className="text-sm font-medium text-chrome">{m.name}</p>
                    <p className="text-xs text-silver/45">{m.source}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-silver/35">{m.use}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-violet-bright md:text-right">
                      {m.saving}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="circularity" className="border-t border-white/[0.07] py-24 sm:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow mb-4">02 / Circularity</p>
            <h2 className="max-w-3xl text-[clamp(2.2rem,5.6vw,4.4rem)] font-medium leading-[0.95] tracking-[-0.045em] text-chrome">
              Four moves.
              <span className="text-violet-gradient"> One loop.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((step, i) => (
              <Reveal key={step.index} delay={i * 100}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-violet/30">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-violet/60">{step.index}</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent" style={{ marginLeft: 12 }} />
                  </div>
                  <h3 className="mt-5 text-lg font-medium tracking-tight text-chrome">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-silver/40">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {SUSTAINABILITY_PILLARS.map((pillar, i) => (
              <Reveal key={pillar.index} delay={i * 90} variant="fade">
                <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-violet-bright/70">
                    Pillar {pillar.index}
                  </p>
                  <h3 className="mt-2 text-sm font-medium text-chrome">{pillar.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-silver/40">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="care" className="border-t border-white/[0.07] py-24 sm:py-28">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
            <Reveal>
              <p className="eyebrow mb-4">03 / Care & repair</p>
              <h2 className="text-[clamp(2.2rem,5.6vw,4.4rem)] font-medium leading-[0.95] tracking-[-0.045em] text-chrome">
                Keep it longer.
                <br />
                <span className="text-outline">That is the point.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-silver/50">
                Wear it hard. We will keep it alive. Repairs are free for life on every REWEAR piece,
                including alterations, re-dyeing and hardware replacement. We cover the label both
                ways.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/support" className="btn btn-primary">
                  Book a repair <Icon name="arrow-up-right" size={15} />
                </Link>
                <Link href="/orders" className="btn btn-ghost">
                  Track a return
                </Link>
              </div>
            </Reveal>

            <div className="space-y-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]">
              {CARE_STEPS.map((step, i) => (
                <Reveal key={step} delay={i * 80} variant="fade">
                  <div className="flex items-start gap-4 bg-carbon px-5 py-5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet/30 font-mono text-[9px] text-violet-bright">
                      0{i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-silver/60">{step}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.07] py-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl border border-violet/20 bg-violet/[0.05] p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet/20 blur-[80px]" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-violet-bright/80">
                  Take-back programme
                </p>
                <h2 className="mt-3 max-w-xl text-2xl font-medium leading-snug tracking-tight text-chrome sm:text-3xl">
                  Finished with a piece? Send it back and we will re-spin it into the next drop.
                </h2>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-silver/40">
                  You get store credit, the fibre stays in motion, and the passport records its next
                  life.
                </p>
              </div>
              <Link href="/support" className="btn btn-primary shrink-0">
                Start a take-back <Icon name="recycle" size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
