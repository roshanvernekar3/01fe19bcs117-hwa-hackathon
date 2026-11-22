import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/products/${p.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition">
      <div className={`h-40 bg-gradient-to-br ${p.gradient} flex items-center justify-center text-6xl group-hover:scale-105 transition`}>
        {p.emoji}
      </div>
      <div className="p-4">
        {p.badge && <span className="inline-block text-xs font-semibold text-berry bg-berry/10 px-2 py-0.5 rounded-full mb-2">{p.badge}</span>}
        <h3 className="font-bold text-navy">{p.name}</h3>
        <p className="text-slate-500 text-sm line-clamp-1">{p.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-berry font-extrabold">${p.price.toFixed(2)}</span>
          <span className="text-xs text-slate-400">★ {p.rating} ({p.reviews})</span>
        </div>
      </div>
    </Link>
  );
}
