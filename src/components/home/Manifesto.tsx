import Reveal from "@/components/Reveal";
import { HOME_STATS } from "@/lib/brand";

export default function Manifesto() {
  return (
    <section id="system" className="relative border-t border-white/[0.07] py-24 sm:py-32">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-violet/[0.035] to-transparent" />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[0.32fr_1fr] lg:gap-20">
          <Reveal variant="fade">
            <div className="flex items-start gap-4 lg:sticky lg:top-36">
              <span className="mt-1 block h-14 w-px bg-gradient-to-b from-violet-bright to-transparent" />
              <div>
                <p className="eyebrow">01 / The system</p>
                <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-silver/40">
                  REWEAR is not a season. It is a closed loop, engineered to keep material in motion.
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="max-w-4xl text-[clamp(2.4rem,6.2vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.045em] text-chrome">
                We don&apos;t make clothes.
                <br />
                We build a system where
                <span className="text-violet-gradient"> nothing ends up as waste.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-[1.2fr_1fr] sm:gap-16">
                <p className="max-w-xl text-base leading-relaxed text-silver/55">
                  Most fashion is designed for the first wear and forgotten by the hundredth. We
                  design backwards from the end: every seam can be undone, every fibre can be
                  recovered, every piece can be repaired, re-cut and returned to the system. The
                  result is clothing with a memory — and a next life.
                </p>
                <p className="font-mono text-[10px] uppercase leading-[2] tracking-[0.16em] text-silver/30">
                  Zero virgin plastic
                  <br />
                  Zero landfill by design
                  <br />
                  Zero compromise on form
                </p>
              </div>
            </Reveal>

            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
              {HOME_STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 80} variant="fade">
                  <div className="h-full bg-carbon px-5 py-6">
                    <p className="text-2xl font-medium tracking-tight text-chrome sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/35">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
