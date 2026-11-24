import Link from "next/link";
import Reveal from "@/components/Reveal";
import GarmentArt from "@/components/GarmentArt";
import Icon from "@/components/ui/Icon";
import { COLLECTIONS, PRODUCTS } from "@/lib/products";

const toneClass = {
  violet: "from-violet/25 via-violet-deep/[0.06] to-transparent",
  silver: "from-white/[0.12] via-white/[0.02] to-transparent",
  chrome: "from-white/[0.08] via-violet/[0.05] to-transparent",
};

export default function CollectionsSection() {
  return (
    <section id="collections" className="relative border-t border-white/[0.07] py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">02 / Collections</p>
              <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.92] tracking-[-0.045em] text-chrome">
                Three systems.
                <br />
                <span className="text-outline">One loop.</span>
              </h2>
            </div>
            <Link href="/products" className="btn btn-ghost self-start sm:self-end">
              View all pieces
              <Icon name="arrow-up-right" size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {COLLECTIONS.map((collection, i) => {
            const count = PRODUCTS.filter((p) => p.collection === collection.slug).length;
            return (
              <Reveal key={collection.slug} delay={i * 120} className={i === 1 ? "lg:mt-14" : ""}>
                <Link
                  href={`/products?collection=${collection.slug}`}
                  className="group relative flex h-[460px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.09] bg-carbon p-6 transition-all duration-500 hover:border-violet/40 hover:shadow-[0_40px_100px_-50px_rgba(168,85,247,0.7)] sm:h-[520px]"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneClass[collection.tone]} opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <div className="pointer-events-none absolute inset-0 grid-bg-fine opacity-30" />

                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-silver/40">
                        Collection {collection.index}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium tracking-tight text-chrome sm:text-3xl">
                        {collection.name}
                      </h3>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-silver/50 transition-all duration-300 group-hover:border-violet/50 group-hover:bg-violet/10 group-hover:text-violet-bright">
                      <Icon name="arrow-up-right" size={16} />
                    </span>
                  </div>

                  <div className="pointer-events-none absolute inset-x-4 bottom-24 top-24 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                    <GarmentArt
                      kind={collection.art}
                      label={`${collection.name} collection`}
                      slug={`collection-${collection.slug}`}
                      variant="detail"
                      showHud={false}
                      className="h-full w-full opacity-90 drop-shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="mb-4 h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
                    <p className="text-lg font-medium leading-snug tracking-tight text-chrome">
                      {collection.statement}
                    </p>
                    <p className="mt-2 max-w-xs text-xs leading-relaxed text-silver/45 transition-colors duration-300 group-hover:text-silver/60">
                      {collection.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-silver/35">
                      <span>{count} pieces</span>
                      <span className="text-violet-bright/70">Explore →</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
