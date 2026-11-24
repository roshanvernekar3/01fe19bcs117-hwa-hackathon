import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/products-store";
import { getCollection } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import GarmentArt from "@/components/GarmentArt";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = catalog.find((p) => p.slug === slug);
  if (!product) return { title: "Piece not found" };
  return {
    title: `${product.name} — ${formatPrice(product.price)}`,
    description: product.tagline,
  };
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();

  const collection = product.collection ? getCollection(product.collection) : undefined;
  const related = catalog
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const sameA = a.category === product.category ? 1 : 0;
      const sameB = b.category === product.category ? 1 : 0;
      return sameB - sameA;
    })
    .slice(0, 4);

  const art = product.art ?? "jacket";
  const inStock = product.inStock && (product.stock ?? 0) > 0;

  return (
    <>
      <div className="relative pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute left-1/2 top-0 h-[360px] w-[520px] -translate-x-1/2 rounded-full bg-violet/10 blur-[110px]" />
        </div>

        <div className="container-x">
          <nav className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-silver/35" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-chrome">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-chrome">Catalogue</Link>
            <span>/</span>
            <span className="text-silver/60">{product.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Visual */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0a090f]">
                <div className="absolute inset-0 grid-bg-fine opacity-30" />
                <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-violet/15 blur-[80px]" />
                <span className="absolute left-5 top-5 z-10 flex flex-col gap-2">
                  {product.badge && (
                    <span className="w-fit rounded-full border border-violet/35 bg-void/70 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-violet-bright backdrop-blur">
                      {product.badge}
                    </span>
                  )}
                  <span className="w-fit rounded-full border border-white/12 bg-void/60 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/50 backdrop-blur">
                    {collection?.name ?? product.category}
                  </span>
                </span>
                <span className="absolute right-5 top-5 z-10 font-mono text-[9px] uppercase tracking-[0.18em] text-silver/30">
                  {product.id.toUpperCase()}
                </span>

                <div className="relative aspect-[4/5] w-full p-4 sm:p-6">
                  <GarmentArt
                    kind={art}
                    label={product.name}
                    slug={product.slug}
                    variant="detail"
                    showHud={false}
                    className="h-full w-full"
                  />
                </div>

                <div className="relative flex items-center justify-between border-t border-white/[0.08] px-5 py-3">
                  <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/35">
                    <span className="h-1 w-1 rounded-full bg-violet-bright animate-pulse-dot" />
                    Holographic scan / 360°
                  </div>
                  <div className="flex gap-1.5">
                    {["Front", "Detail", "Fibre"].map((tab, i) => (
                      <span
                        key={tab}
                        className={`rounded-full border px-2.5 py-1 font-mono text-[7px] uppercase tracking-[0.14em] ${
                          i === 0 ? "border-violet/40 bg-violet/10 text-violet-bright" : "border-white/10 text-silver/30"
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* passport strip */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: "recycle" as const, label: "Recycled content", value: "100%" },
                  { icon: "leaf" as const, label: "CO₂e avoided", value: `${product.carbon ?? 8.4} kg` },
                  { icon: "shield" as const, label: "Repair cover", value: "Lifetime" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-3">
                    <Icon name={item.icon} size={14} className="text-violet-bright/80" />
                    <p className="mt-2 text-xs font-medium text-chrome">{item.value}</p>
                    <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-silver/30">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="pt-1">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-violet-bright/70">
                  {collection ? `Collection ${collection.index} — ${collection.name}` : "REWEAR / System piece"}
                </p>
                <div className="flex items-center gap-1 font-mono text-[9px] text-silver/40">
                  <Icon name="star" size={11} className="text-violet-bright" fill="currentColor" />
                  {product.rating.toFixed(1)} <span className="text-silver/25">({product.reviews})</span>
                </div>
              </div>

              <h1 className="mt-3 text-[clamp(2.6rem,6vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.045em] text-chrome">
                {product.name}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-silver/50 sm:text-base">
                {product.tagline}
              </p>

              <div className="mt-6 flex items-end justify-between gap-4 border-y border-white/[0.08] py-5">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-chrome">{formatPrice(product.price)}</p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/30">
                    Includes lifetime repair credit
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] ${
                    inStock
                      ? "border-emerald-300/25 bg-emerald-400/[0.06] text-emerald-200/80"
                      : "border-red-300/20 bg-red-400/[0.06] text-red-200/80"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-emerald-300/80" : "bg-red-300/80"}`} />
                  {inStock ? "Available now" : "Sold out"}
                </span>
              </div>

              <div className="mt-6">
                <AddToCart product={product} />
              </div>

              <p className="mt-7 text-sm leading-relaxed text-silver/55">{product.description}</p>

              <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-silver/55">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-violet/30 text-violet-bright">
                      <Icon name="check" size={10} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-2xl border border-violet/20 bg-violet/[0.045] p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-violet-bright">
                    <Icon name="scan" size={18} />
                  </span>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-violet-bright/80">
                      Fibre passport
                    </p>
                    <p className="mt-1 text-sm text-chrome">{product.material ?? "Regenerated fibre system"}</p>
                    <p className="mt-1 text-xs leading-relaxed text-silver/45">
                      Scan the woven tag inside your piece to see its origin, mill, dye process and
                      end-of-life route. Return it to us and the fibre re-enters the next drop.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {[
                  {
                    title: "Construction & fit",
                    body: "Cut for movement with articulated panels and a modular hem. Unisex sizing; take your usual size for a clean fit or size up for a relaxed layer.",
                  },
                  {
                    title: "Care & repair",
                    body: "Cold wash, line dry, no fabric softener. Free repairs for life — book a repair from your account or contact the concierge. We cover the return label.",
                  },
                  {
                    title: "Delivery & returns",
                    body: "Carbon-neutral delivery in 2–4 working days. Free over ₹5,000. 30-day returns on unworn pieces; returns are re-spun or re-sold, never landfilled.",
                  },
                ].map((row) => (
                  <details key={row.title} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-chrome">
                      {row.title}
                      <Icon name="plus" size={15} className="text-silver/35 transition-transform group-open:rotate-45" />
                    </summary>
                    <p className="mt-3 max-w-lg text-xs leading-relaxed text-silver/45">{row.body}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="border-t border-white/[0.07] py-20">
        <div className="container-x">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Continue the system</p>
                <h2 className="text-3xl font-medium tracking-tight text-chrome sm:text-4xl">
                  Pairs well with<span className="text-violet-bright">.</span>
                </h2>
              </div>
              <Link href="/products" className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/40 hover:text-chrome">
                View all →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.slug} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
