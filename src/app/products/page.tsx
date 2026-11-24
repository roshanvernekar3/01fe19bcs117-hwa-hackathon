"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Category, CollectionSlug, Product } from "@/lib/products";
import { CATEGORIES, COLLECTIONS, PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";
import Icon from "@/components/ui/Icon";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "carbon";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price · low" },
  { value: "price-desc", label: "Price · high" },
  { value: "rating", label: "Top rated" },
  { value: "carbon", label: "Highest impact" },
];

function CatalogueInner() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") as Category | null;
  const collection = params.get("collection") as CollectionSlug | null;
  const q = params.get("q") ?? "";
  const sort = (params.get("sort") as SortKey) || "featured";

  const [search, setSearch] = useState(q);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.products) && d.products.length > 0) setProducts(d.products as Product[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(q);
  }, [q]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.category === category);
    if (collection) list = list.filter((p) => p.collection === collection);
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((p) =>
        [p.name, p.tagline, p.description, p.material, p.category, p.collection]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "carbon") list.sort((a, b) => (b.carbon ?? 0) - (a.carbon ?? 0));
    return list;
  }, [products, category, collection, search, sort]);

  const activeCollection = collection ? COLLECTIONS.find((c) => c.slug === collection) : null;
  const activeCategory = category ? CATEGORIES.find((c) => c.slug === category) : null;

  function setParam(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.replace(`/products${sp.toString() ? `?${sp.toString()}` : ""}`, { scroll: false });
  }

  function clearAll() {
    setSearch("");
    router.replace("/products", { scroll: false });
  }

  const heading = activeCollection
    ? activeCollection.name
    : activeCategory
      ? activeCategory.name
      : search
        ? `“${search}”`
        : "The catalogue";

  return (
    <>
      {/* Page masthead */}
      <section className="relative overflow-hidden border-b border-white/[0.07] pb-12 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-violet/10 blur-[100px]" />
        </div>
        <div className="container-x">
          <p className="eyebrow mb-4">SS26 / Drop 01</p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.86] tracking-[-0.055em] text-chrome">
                {activeCollection ? (
                  <>
                    {activeCollection.name}
                    <span className="text-violet-bright">.</span>
                  </>
                ) : activeCategory ? (
                  <>
                    {activeCategory.name}
                    <span className="text-violet-bright">.</span>
                  </>
                ) : search ? (
                  <span className="text-gradient">{heading}</span>
                ) : (
                  <>
                    The <span className="text-gradient">catalogue</span>
                    <span className="text-violet-bright">.</span>
                  </>
                )}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-silver/50 sm:text-base">
                {activeCollection
                  ? activeCollection.description
                  : activeCategory
                    ? activeCategory.desc
                    : "Ten pieces. One closed loop. Every garment carries a fibre passport, a lifetime repair credit and a plan for its next life."}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-6 font-mono text-[9px] uppercase tracking-[0.16em] text-silver/35">
              <span>{filtered.length} pieces</span>
              <span className="h-8 w-px bg-white/10" />
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-bright animate-pulse-dot" />
                In stock
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="sticky top-[104px] z-30 border-b border-white/[0.07] bg-void/85 backdrop-blur-2xl">
        <div className="container-x flex flex-col gap-3 py-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={clearAll}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition ${
                !category && !collection
                  ? "border-violet bg-violet text-void"
                  : "border-white/12 text-silver/55 hover:border-white/25 hover:text-chrome"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setParam("category", category === c.slug ? "" : c.slug)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition ${
                  category === c.slug
                    ? "border-violet bg-violet text-void"
                    : "border-white/12 text-silver/55 hover:border-white/25 hover:text-chrome"
                }`}
              >
                {c.name}
              </button>
            ))}
            <span className="mx-1 hidden w-px shrink-0 bg-white/10 sm:block" />
            {COLLECTIONS.map((c) => (
              <button
                key={c.slug}
                onClick={() => setParam("collection", collection === c.slug ? "" : c.slug)}
                className={`hidden shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition sm:block ${
                  collection === c.slug
                    ? "border-violet/60 bg-violet/15 text-violet-bright"
                    : "border-white/12 text-silver/45 hover:border-white/25 hover:text-chrome"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="relative flex flex-1 items-center lg:w-56">
              <Icon name="search" size={14} className="absolute left-3 text-silver/35" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setParam("q", e.target.value);
                }}
                placeholder="Search pieces…"
                className="w-full rounded-full border border-white/12 bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-chrome placeholder:text-silver/30 focus:border-violet/50 focus:outline-none"
                aria-label="Search pieces"
              />
            </label>
            <label className="relative">
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="appearance-none rounded-full border border-white/12 bg-white/[0.03] py-2 pl-3 pr-8 font-mono text-[9px] uppercase tracking-[0.12em] text-silver/60 focus:border-violet/50 focus:outline-none"
                aria-label="Sort pieces"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-carbon text-chrome">
                    {s.label}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                size={12}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-silver/40"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-10 sm:py-14">
        <div className="container-x">
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[4/5] animate-shimmer rounded-2xl border border-white/[0.06]" />
                  <div className="mt-4 h-3 w-2/3 animate-shimmer rounded-full" />
                  <div className="mt-2 h-2 w-1/2 animate-shimmer rounded-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 px-6 py-24 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 text-silver/40">
                <Icon name="search" size={20} />
              </span>
              <h2 className="mt-5 text-xl font-medium text-chrome">No pieces found</h2>
              <p className="mt-2 max-w-sm text-sm text-silver/45">
                Remove a filter or search a different material, silhouette or collection.
              </p>
              <button onClick={clearAll} className="btn btn-ghost btn-sm mt-6">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {filtered.map((product, i) => (
                <ProductCard key={product.slug} p={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-40"><Loader message="Loading the catalogue…" /></div>}>
      <CatalogueInner />
    </Suspense>
  );
}
