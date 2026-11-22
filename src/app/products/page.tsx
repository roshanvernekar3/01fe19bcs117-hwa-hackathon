"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState, useEffect } from "react";
import type { Product, Category } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

function ProductsInner() {
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get("category") as Category | null;
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";
  const [search, setSearch] = useState(q);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(q);
  }, [q]);

  const filtered = useMemo(() => {
    let list = products;
    if (cat) list = list.filter((p) => p.category === cat);
    if (search) list = list.filter((p) => (p.name + p.tagline + p.description).toLowerCase().includes(search.toLowerCase()));
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [products, cat, search, sort]);

  function setParam(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value); else sp.delete(key);
    router.replace(`/products?${sp.toString()}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy">
            {cat ? CATEGORIES.find((c) => c.slug === cat)?.name ?? "Products" : "All Products"}
          </h1>
          <p className="text-slate-500 mt-1">{loading ? "Loading..." : `${filtered.length} products`}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setParam("q", e.target.value);
            }}
            className="px-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-berry text-sm"
          />
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="px-4 py-2 rounded-full border border-slate-200 text-sm bg-white"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setParam("category", "")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${!cat ? "bg-berry text-white" : "bg-white border border-slate-200 text-slate-700 hover:border-berry"}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setParam("category", c.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${cat === c.slug ? "bg-berry text-white" : "bg-white border border-slate-200 text-slate-700 hover:border-berry"}`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No products found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ProductsInner />
    </Suspense>
  );
}
