import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Icon from "@/components/ui/Icon";
import { PRODUCTS } from "@/lib/products";

const FEATURED = ["aegis-shell", "circuit-knit", "cargo-trace", "orbits-crossbody"];

export default function TrendingSection() {
  const products = FEATURED.map((slug) => PRODUCTS.find((p) => p.slug === slug)).filter(
    (p): p is (typeof PRODUCTS)[number] => Boolean(p)
  );

  return (
    <section id="trending" className="border-t border-white/[0.07] py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <p className="eyebrow">03 / Trending</p>
                <span className="chip border-violet/30 bg-violet/10 text-violet-bright">
                  <span className="h-1 w-1 rounded-full bg-violet-bright animate-pulse-dot" />
                  Moving fast
                </span>
              </div>
              <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.92] tracking-[-0.045em] text-chrome">
                Wanted <span className="text-violet-gradient">now.</span>
              </h2>
            </div>
            <Link href="/products" className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-silver/50 transition-colors hover:text-chrome">
              All pieces
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-all group-hover:border-violet/50 group-hover:text-violet-bright">
                <Icon name="arrow-right" size={14} />
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.slug} p={product} index={i} />
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver/40">
              Every order includes a digital fibre passport + lifetime repair credit
            </p>
            <div className="flex flex-wrap gap-4 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/30">
              <span className="flex items-center gap-1.5"><Icon name="truck" size={12} /> Free delivery</span>
              <span className="flex items-center gap-1.5"><Icon name="rotate" size={12} /> 30-day returns</span>
              <span className="flex items-center gap-1.5"><Icon name="shield" size={12} /> Secure checkout</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
