import Reveal from "@/components/Reveal";
import Icon from "@/components/ui/Icon";

const QUOTES = [
  {
    quote:
      "The Aegis shell is the first technical piece I've owned that feels like it was designed to be kept, not replaced.",
    name: "Mira K.",
    role: "Architect / Bengaluru",
    piece: "Aegis Shell",
  },
  {
    quote:
      "I scanned the passport, booked a repair, and had it back in five days. The whole system just makes sense.",
    name: "Dev R.",
    role: "Sound designer / Mumbai",
    piece: "Circuit Knit",
  },
  {
    quote:
      "Zero-waste without looking like a compromise. The Strata trench is the quietest statement I own.",
    name: "Anaya S.",
    role: "Creative director / Delhi",
    piece: "Strata Trench",
  },
];

export default function SignalSection() {
  return (
    <section className="border-t border-white/[0.07] py-24 sm:py-28">
      <div className="container-x">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">05 / Field notes</p>
              <h2 className="text-[clamp(2.4rem,5.6vw,4.8rem)] font-medium leading-[0.94] tracking-[-0.045em] text-chrome">
                Signal, <span className="text-outline">not noise.</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 text-violet-bright">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={12} fill="currentColor" />
                ))}
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver/35">
                4.9 / 5 · 1,284 verified
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {QUOTES.map((item, i) => (
            <Reveal key={item.name} delay={i * 110}>
              <figure className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-violet/30 hover:bg-white/[0.035]">
                <span className="pointer-events-none absolute -right-2 -top-4 font-serif text-[90px] leading-none text-violet/10">
                  &ldquo;
                </span>
                <blockquote className="relative text-sm leading-relaxed text-silver/65">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-white/[0.08] pt-4">
                  <p className="text-sm font-medium text-chrome">{item.name}</p>
                  <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/35">
                    {item.role}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-violet-bright/70">
                    <Icon name="check" size={11} />
                    Verified · {item.piece}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
