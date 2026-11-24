import Link from "next/link";
import Reveal from "@/components/Reveal";
import Icon from "@/components/ui/Icon";
import { Mark } from "@/components/Brand";
import { STYLE_MATCH_STEPS } from "@/lib/brand";

export default function StyleMatchPromo() {
  return (
    <section id="style-match" className="relative py-20 sm:py-28">
      <div className="container-x">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0a0910]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 grid-bg-fine opacity-40" />
              <div className="absolute -right-20 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-violet/15 blur-[100px]" />
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-violet/[0.08] to-transparent" />
            </div>

            <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6 lg:p-14">
              <div className="max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3 py-1.5">
                  <Icon name="sparkle" size={12} className="text-violet-bright" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-violet-bright">
                    AI Style Match / Beta
                  </span>
                </div>

                <h2 className="text-[clamp(2.3rem,5.5vw,4.6rem)] font-medium leading-[0.94] tracking-[-0.045em] text-chrome">
                  Your next uniform,
                  <br />
                  <span className="text-gradient">computed.</span>
                </h2>

                <p className="mt-5 max-w-md text-sm leading-relaxed text-silver/55 sm:text-base">
                  Four questions. One curated edit. Our matcher reads the collection DNA — silhouette,
                  fibre, climate and the way you move — then assembles a system that works together.
                </p>

                <ol className="mt-8 space-y-3">
                  {STYLE_MATCH_STEPS.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-[9px] text-violet-bright">
                        0{i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-silver/55">{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/style-match" className="btn btn-primary group">
                    Run style match
                    <Icon
                      name="arrow-up-right"
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                  <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-silver/30">
                    No account needed / 40 sec
                  </span>
                </div>
              </div>

              {/* scanner visual */}
              <div className="relative mx-auto flex aspect-square w-full max-w-[430px] items-center justify-center">
                <div className="absolute inset-[6%] rounded-full border border-white/[0.07]" />
                <div className="absolute inset-[16%] rounded-full border border-dashed border-white/[0.08] animate-spin-slow" />
                <div
                  className="absolute inset-[8%] rounded-full opacity-70"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(168,85,247,0.55) 350deg, transparent 360deg)",
                    maskImage: "radial-gradient(circle, transparent 58%, black 60%, black 66%, transparent 68%)",
                    WebkitMaskImage:
                      "radial-gradient(circle, transparent 58%, black 60%, black 66%, transparent 68%)",
                    animation: "spin-slow 8s linear infinite",
                  }}
                />
                <div className="absolute inset-[26%] rounded-full border border-violet/25 bg-violet/[0.06] backdrop-blur-sm" />
                <div className="absolute inset-[34%] flex flex-col items-center justify-center rounded-full border border-white/10 bg-void/60 text-center backdrop-blur-xl">
                  <span className="text-chrome">
                    <Mark size={48} />
                  </span>
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.22em] text-silver/40">
                    Match engine
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-violet-bright">
                    Reading…
                  </p>
                </div>

                {/* floating readouts */}
                <div className="glass absolute left-0 top-[18%] rounded-xl px-3 py-2 animate-float-slow">
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-silver/40">Silhouette</p>
                  <p className="mt-0.5 text-[11px] font-medium text-chrome">98% match</p>
                </div>
                <div className="glass absolute right-0 top-[34%] rounded-xl px-3 py-2 animate-float" style={{ animationDelay: "1s" }}>
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-silver/40">Fibre</p>
                  <p className="mt-0.5 text-[11px] font-medium text-violet-bright">Circular</p>
                </div>
                <div className="glass absolute bottom-[12%] left-[8%] rounded-xl px-3 py-2 animate-float" style={{ animationDelay: "2s" }}>
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-silver/40">Climate</p>
                  <p className="mt-0.5 text-[11px] font-medium text-chrome">−12.4 kg</p>
                </div>
                <div className="glass absolute bottom-[20%] right-[2%] hidden rounded-xl px-3 py-2 animate-float-slow sm:block" style={{ animationDelay: "1.6s" }}>
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-silver/40">Edit</p>
                  <p className="mt-0.5 text-[11px] font-medium text-chrome">4 pieces</p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] bg-white/[0.02] px-6 py-3.5 sm:px-10">
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/35">
                On-device matching · no data stored
              </p>
              <div className="flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.18em] text-silver/30">
                <span>Fit</span>
                <span>Climate</span>
                <span>Impact</span>
                <span className="text-violet-bright">Style</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
