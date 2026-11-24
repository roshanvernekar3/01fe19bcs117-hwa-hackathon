"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCTS, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import Reveal from "@/components/Reveal";
import GarmentArt from "@/components/GarmentArt";
import ProductCard from "@/components/ProductCard";
import Icon from "@/components/ui/Icon";

type Answer = string;

const QUESTIONS: {
  id: string;
  index: string;
  title: string;
  hint: string;
  options: { value: Answer; label: string; desc: string }[];
}[] = [
  {
    id: "climate",
    index: "01",
    title: "What climate are you dressing for?",
    hint: "This sets the weight and weatherproofing of your edit.",
    options: [
      { value: "cold", label: "Cold / wet", desc: "Layers, shells, long silhouettes" },
      { value: "mild", label: "Mild / variable", desc: "Transitional layers that adapt" },
      { value: "warm", label: "Warm / humid", desc: "Lightweight, breathable, minimal" },
    ],
  },
  {
    id: "silhouette",
    index: "02",
    title: "How do you want it to sit?",
    hint: "Silhouette drives the whole system, not just one piece.",
    options: [
      { value: "sharp", label: "Sharp + architectural", desc: "Structured, precise, intentional" },
      { value: "relaxed", label: "Relaxed + oversized", desc: "Volume, movement, ease" },
      { value: "close", label: "Close + technical", desc: "Second-skin, kinetic, clean" },
    ],
  },
  {
    id: "palette",
    index: "03",
    title: "Pick your signal.",
    hint: "We tune the accent, not the whole wardrobe.",
    options: [
      { value: "noir", label: "Full noir", desc: "Black on black, chrome flashes" },
      { value: "violet", label: "Violet circuit", desc: "Neon purple, luminous thread" },
      { value: "silver", label: "Liquid silver", desc: "Iridescent, reflective, pale" },
    ],
  },
  {
    id: "priority",
    index: "04",
    title: "What matters most right now?",
    hint: "The matcher weights your edit around this.",
    options: [
      { value: "impact", label: "Lowest impact", desc: "Maximum CO₂e avoided" },
      { value: "versatility", label: "Most versatile", desc: "Pieces that work together" },
      { value: "statement", label: "Strongest statement", desc: "The piece people remember" },
    ],
  },
];

function scoreProduct(p: Product, answers: Record<string, Answer>) {
  let score = 0;
  const { climate, silhouette, palette, priority } = answers;

  if (climate === "cold") {
    if (p.category === "outerwear") score += 5;
    if (p.category === "bottoms") score += 2;
    if (p.slug === "aegis-shell" || p.slug === "strata-trench") score += 2;
  } else if (climate === "warm") {
    if (p.category === "tops") score += 3;
    if (p.category === "accessories") score += 2;
    if (p.slug === "second-skin-tee" || p.slug === "null-cap") score += 2;
    if (p.category === "outerwear") score -= 2;
  } else {
    if (p.category === "tops") score += 2;
    if (p.category === "outerwear") score += 2;
    if (p.slug === "halo-bomber" || p.slug === "flux-hoodie") score += 2;
  }

  if (silhouette === "sharp") {
    if (["aegis-shell", "strata-trench", "cargo-trace", "orbits-crossbody"].includes(p.slug)) score += 3;
  } else if (silhouette === "relaxed") {
    if (["flux-hoodie", "rift-denim", "cargo-trace", "halo-bomber"].includes(p.slug)) score += 3;
  } else {
    if (["circuit-knit", "second-skin-tee", "aegis-shell", "null-cap"].includes(p.slug)) score += 3;
  }

  if (palette === "noir") {
    if (["strata-trench", "cargo-trace", "second-skin-tee", "null-cap"].includes(p.slug)) score += 2;
  } else if (palette === "violet") {
    if (["circuit-knit", "rift-denim", "cargo-trace"].includes(p.slug)) score += 3;
  } else {
    if (["halo-bomber", "flux-hoodie", "orbits-crossbody"].includes(p.slug)) score += 3;
  }

  if (priority === "impact") score += (p.carbon ?? 0) * 0.35;
  if (priority === "versatility") {
    if (p.category === "tops" || p.category === "bottoms") score += 2;
    if (p.collection === "circuit-noir") score += 1;
  }
  if (priority === "statement") {
    if (p.badge) score += 1.5;
    if (p.price > 14000) score += 1.5;
  }

  score += p.rating * 0.6;
  return score;
}

function buildEdit(answers: Record<string, Answer>) {
  const ranked = [...PRODUCTS].sort((a, b) => scoreProduct(b, answers) - scoreProduct(a, answers));
  const edit: Product[] = [];
  const wantCategories: Product["category"][] =
    answers.climate === "cold"
      ? ["outerwear", "tops", "bottoms", "accessories"]
      : answers.climate === "warm"
        ? ["tops", "bottoms", "accessories"]
        : ["outerwear", "tops", "bottoms"];

  for (const cat of wantCategories) {
    const pick = ranked.find((p) => p.category === cat && !edit.includes(p));
    if (pick) edit.push(pick);
  }
  for (const p of ranked) {
    if (edit.length >= 4) break;
    if (!edit.includes(p)) edit.push(p);
  }
  return edit;
}

function matchPercent(edit: Product[], answers: Record<string, Answer>) {
  if (edit.length === 0) return 0;
  const avg = edit.reduce((sum, p) => sum + scoreProduct(p, answers), 0) / edit.length;
  return Math.min(99, Math.round(72 + avg * 1.6));
}

export default function StyleMatchPage() {
  const { add } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<Product[] | null>(null);
  const [addedAll, setAddedAll] = useState(false);

  const total = useMemo(
    () => (result ? result.reduce((sum, p) => sum + p.price, 0) : 0),
    [result]
  );
  const carbon = useMemo(
    () => (result ? result.reduce((sum, p) => sum + (p.carbon ?? 0), 0) : 0),
    [result]
  );

  const question = QUESTIONS[step];
  const progress = result ? 100 : (step / QUESTIONS.length) * 100;

  function choose(value: Answer) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setResult(buildEdit(next));
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setResult(null);
    setAddedAll(false);
  }

  function addEdit() {
    if (!result) return;
    result.forEach((p) => {
      add({ slug: p.slug, name: p.name, price: p.price, emoji: p.emoji });
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2600);
  }

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute left-1/2 top-20 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-violet/12 blur-[120px]" />
      </div>

      <div className="container-x pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">AI Style Match / on-device</p>
          <h1 className="mt-4 text-[clamp(2.6rem,7.5vw,5.6rem)] font-medium leading-[0.9] tracking-[-0.05em] text-chrome">
            Your next uniform,
            <br />
            <span className="text-gradient">computed.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-silver/50 sm:text-base">
            Four questions. One curated edit. The matcher reads silhouette, fibre, climate and intent —
            then assembles pieces that work as a system. No account, nothing stored.
          </p>
        </div>

        {/* progress */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-silver/35">
            <span>{result ? "Match complete" : `Question ${String(step + 1).padStart(2, "0")} / 04`}</span>
            <span className="text-violet-bright/70">{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-px w-full bg-white/10">
            <div
              className="h-px bg-gradient-to-r from-violet-deep via-violet to-violet-bright transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!result ? (
          <div className="mx-auto mt-10 max-w-3xl">
            <div key={question.id} className="animate-rise rounded-3xl border border-white/[0.1] bg-white/[0.02] p-6 sm:p-9">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] tracking-[0.2em] text-violet/70">{question.index}</span>
                <div>
                  <h2 className="text-xl font-medium tracking-tight text-chrome sm:text-2xl">{question.title}</h2>
                  <p className="mt-1 text-xs text-silver/40">{question.hint}</p>
                </div>
              </div>

              <div className="mt-7 space-y-2.5">
                {question.options.map((opt) => {
                  const active = answers[question.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => choose(opt.value)}
                      className={`group flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                        active
                          ? "border-violet/60 bg-violet/[0.08]"
                          : "border-white/10 bg-white/[0.015] hover:border-violet/35 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-chrome">{opt.label}</p>
                        <p className="mt-0.5 text-xs text-silver/40">{opt.desc}</p>
                      </div>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
                          active
                            ? "border-violet bg-violet text-void"
                            : "border-white/12 text-silver/30 group-hover:border-violet/50 group-hover:text-violet-bright"
                        }`}
                      >
                        <Icon name="arrow-right" size={14} />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/35 transition-colors hover:text-chrome disabled:opacity-30"
                >
                  ← Back
                </button>
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-silver/25">
                  {Object.keys(answers).length} answered
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/25">
              <span className="flex items-center gap-1.5"><Icon name="scan" size={11} /> On-device</span>
              <span className="flex items-center gap-1.5"><Icon name="shield" size={11} /> No data stored</span>
              <span className="flex items-center gap-1.5"><Icon name="recycle" size={11} /> Circular by default</span>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <Reveal>
              <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-violet/25 bg-violet/[0.05] px-5 py-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-violet/40 bg-violet/15 text-violet-bright">
                    <Icon name="sparkle" size={18} />
                  </span>
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-violet-bright/80">
                      Match confidence
                    </p>
                    <p className="text-sm font-medium text-chrome">
                      {matchPercent(result, answers)}% — built for {answers.climate === "cold" ? "cold" : answers.climate === "warm" ? "warm" : "variable"} weather
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/40">
                  <span>{result.length} pieces</span>
                  <span className="h-4 w-px bg-white/10" />
                  <span className="text-violet-bright">{carbon.toFixed(1)} kg CO₂e avoided</span>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-6">
              {result.map((p, i) => (
                <ProductCard key={p.slug} p={p} index={i} />
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-white/[0.1] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver/35">
                      Your edit / total
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-chrome">{formatPrice(total)}</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">
                      Free carbon-neutral delivery · lifetime repairs included
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={addEdit}
                      className={`btn ${addedAll ? "btn-chrome" : "btn-primary"}`}
                    >
                      {addedAll ? (
                        <>
                          <Icon name="check" size={15} /> Edit added
                        </>
                      ) : (
                        <>
                          Add entire edit <Icon name="bag" size={15} />
                        </>
                      )}
                    </button>
                    <button onClick={restart} className="btn btn-ghost">
                      <Icon name="rotate" size={14} /> Run again
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.08] pt-4 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">
                  <span>Silhouette / {answers.silhouette}</span>
                  <span>Signal / {answers.palette}</span>
                  <span>Priority / {answers.priority}</span>
                  <span className="text-violet-bright/70">No account needed</span>
                </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-3">
              <Link
                href="/products"
                className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40 hover:text-chrome"
              >
                Browse the full catalogue <Icon name="arrow-right" size={12} />
              </Link>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "scan" as const,
                title: "Fibre passport",
                body: "Every matched piece ships with a scannable passport showing origin and end-of-life route.",
              },
              {
                icon: "shield" as const,
                title: "Repair for life",
                body: "Free repairs on every piece in the edit, for as long as you own it.",
              },
              {
                icon: "recycle" as const,
                title: "Return the fibre",
                body: "When a piece is truly finished, send it back and it re-enters the next drop.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-violet-bright">
                  <Icon name={item.icon} size={16} />
                </span>
                <p className="mt-3 text-sm font-medium text-chrome">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-silver/40">{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
