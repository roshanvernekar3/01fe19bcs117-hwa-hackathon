"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Mascot from "@/components/Mascot";

type PetType = "dog" | "cat";
type Age = "young" | "adult" | "senior";
type Size = "small" | "medium" | "large";
type Activity = "chasing" | "foraging" | "puzzle" | "licking" | "resting" | "sensory";

const QUESTIONS = [
  { key: "pet", title: "Who are we shopping for?", subtitle: "Pick your pet" },
  { key: "age", title: "How old is your pet?", subtitle: "Age matters for play" },
  { key: "size", title: "What's their size?", subtitle: "Helps us fit the right gear" },
  { key: "activities", title: "Favourite activities?", subtitle: "Select all that apply" },
];

const PRODUCT_TAGS: Record<string, string[]> = {
  treattrek: ["foraging", "treat", "mental", "universal"],
  snufflesafari: ["foraging", "sniffing", "calming", "universal"],
  pawmystery: ["puzzle", "mental", "foraging", "universal"],
  wigglewobble: ["chasing", "active", "playing", "universal"],
  pawsensation: ["sensory", "playing", "universal"],
  lickalicious: ["licking", "calming", "anxiety", "universal"],
  pawhideout: ["resting", "cozy", "hiding", "universal"],
  pawhaven: ["cat", "resting", "cozy"],
  pawnest: ["dog", "resting", "cozy"],
  pawfresh: ["cat", "washroom", "hygiene"],
};

const ACTIVITY_LABELS: { key: Activity; label: string; emoji: string }[] = [
  { key: "chasing", label: "Chasing & running", emoji: "🏃" },
  { key: "foraging", label: "Sniffing & foraging", emoji: "👃" },
  { key: "puzzle", label: "Puzzles & problem solving", emoji: "🧩" },
  { key: "licking", label: "Licking & calming", emoji: "👅" },
  { key: "resting", label: "Cozy resting", emoji: "💤" },
  { key: "sensory", label: "Sensory play", emoji: "✨" },
];

export default function PawPlayMatch() {
  const { add } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [step, setStep] = useState(0);
  const [pet, setPet] = useState<PetType | null>(null);
  const [age, setAge] = useState<Age | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const loadingProducts = products.length === 0;

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  function toggleActivity(a: Activity) {
    setActivities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function canNext() {
    if (step === 0) return !!pet;
    if (step === 1) return !!age;
    if (step === 2) return !!size;
    if (step === 3) return activities.length > 0;
    return true;
  }

  function next() {
    if (step < 3) setStep(step + 1);
    else setShowResults(true);
  }

  function reset() {
    setStep(0);
    setPet(null);
    setAge(null);
    setSize(null);
    setActivities([]);
    setShowResults(false);
    setAdded({});
  }

  function recommend() {
    const acts = activities.length ? activities : (["foraging"] as unknown as Activity[]);
    const scored = products.map((p) => {
      const tags = PRODUCT_TAGS[p.slug] || [];
      let score = 0;
      // species filter
      if (pet === "dog" && tags.includes("cat") && !tags.includes("universal")) score -= 100;
      if (pet === "cat" && tags.includes("dog") && !tags.includes("universal")) score -= 100;
      // activity match
      acts.forEach((a) => {
        if (tags.includes(a)) score += 3;
      });
      // universal boost
      if (tags.includes("universal")) score += 1;
      // size adjustments
      if (size === "small" && (p.slug === "pawsensation" || p.slug === "lickalicious")) score += 2;
      if (size === "large" && (p.slug === "wigglewobble" || p.slug === "pawnest")) score += 2;
      // age adjustments
      if (age === "young" && (p.slug === "wigglewobble" || p.slug === "pawmystery")) score += 2;
      if (age === "senior" && (p.slug === "lickalicious" || p.slug === "pawhideout")) score += 2;
      return { product: p, score };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 6).map((x) => x.product);
  }

  const results = showResults ? recommend() : [];

  function handleAdd(p: Product) {
    add({ slug: p.slug, name: p.name, price: p.price, emoji: p.emoji });
    setAdded((a) => ({ ...a, [p.slug]: true }));
    setTimeout(() => setAdded((a) => ({ ...a, [p.slug]: false })), 1500);
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-cream via-blush to-peach py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/70 backdrop-blur text-berry text-xs font-semibold mb-4 shadow-sm">
            🐾 PawPlay Match
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight">
            Find your pet&apos;s perfect play
          </h1>
          <p className="text-muted mt-3">Answer a few quick questions and we&apos;ll fetch the best matches from our store.</p>
        </div>

        {!showResults ? (
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 md:p-8 border border-white">
            {/* progress */}
            <div className="flex gap-2 mb-6">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i <= step ? "bg-berry" : "bg-slate-200"}`} />
              ))}
            </div>
            <div className="mb-6">
              <div className="text-xs font-semibold text-berry uppercase tracking-wide">
                Step {step + 1} of {QUESTIONS.length}
              </div>
              <h2 className="text-2xl font-bold text-navy mt-1">{QUESTIONS[step].title}</h2>
              <p className="text-muted text-sm">{QUESTIONS[step].subtitle}</p>
            </div>

            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">
                {(["dog", "cat"] as PetType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPet(t)}
                    className={`p-6 rounded-2xl border-2 text-center transition hover-lift ${
                      pet === t ? "border-berry bg-berry/10" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-6xl mb-2">{t === "dog" ? "🐶" : "🐱"}</div>
                    <div className="font-bold text-navy capitalize">{t}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-3 gap-3">
                {(["young", "adult", "senior"] as Age[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className={`p-5 rounded-2xl border-2 text-center transition hover-lift ${
                      age === a ? "border-berry bg-berry/10" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-4xl mb-2">{a === "young" ? "🍼" : a === "adult" ? "💪" : "🧓"}</div>
                    <div className="font-bold text-navy capitalize">{a}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-3 gap-3">
                {(["small", "medium", "large"] as Size[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`p-5 rounded-2xl border-2 text-center transition hover-lift ${
                      size === s ? "border-berry bg-berry/10" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-4xl mb-2">{s === "small" ? "🐾" : s === "medium" ? "🐕" : "🐕‍🦺"}</div>
                    <div className="font-bold text-navy capitalize">{s}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-3">
                {ACTIVITY_LABELS.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => toggleActivity(a.key)}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition hover-lift ${
                      activities.includes(a.key) ? "border-berry bg-berry/10" : "border-slate-200 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{a.emoji}</span>
                    <span className="font-semibold text-navy text-sm">{a.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => (step > 0 ? setStep(step - 1) : reset())}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-navy font-semibold hover:bg-slate-50 transition"
              >
                {step === 0 ? "Reset" : "Back"}
              </button>
              <button
                onClick={next}
                disabled={!canNext() || loadingProducts}
                className="px-6 py-2.5 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition disabled:opacity-40 shadow-lg shadow-berry/20"
              >
                {loadingProducts ? "🐾 Loading…" : step === 3 ? "See Matches" : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-navy">Your top matches</h2>
              <p className="text-muted text-sm mt-1">Based on {pet}&apos;s profile. Add favourites straight to your cart.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((p, i) => (
                <div
                  key={p.slug}
                  className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-white shadow-sm hover-lift h-full flex flex-col"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex gap-3 flex-1">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="80px" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="font-bold text-navy">{p.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-2">{p.tagline}</div>
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <span className="text-berry font-extrabold">₹{p.price}</span>
                        <button
                          onClick={() => handleAdd(p)}
                          className="px-3 py-1.5 rounded-full bg-berry text-white text-xs font-semibold hover:bg-berry-dark transition"
                        >
                          {added[p.slug] ? "Added ✓" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {results.length === 0 && (
              <div className="text-center py-10">
                <Mascot type="dog" size="lg" anim="peek" />
                <div className="text-muted mt-3">No matches found. Try different activities.</div>
              </div>
            )}
            <div className="mt-8 flex gap-3 justify-center">
              <button onClick={reset} className="px-6 py-2.5 rounded-full border border-slate-200 text-navy font-semibold hover:bg-white transition">
                Retake Quiz
              </button>
              <Link href="/cart" className="px-6 py-2.5 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition shadow-lg shadow-berry/20">
                Go to Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
