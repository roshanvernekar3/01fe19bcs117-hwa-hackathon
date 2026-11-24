import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Legal & accessibility",
  description:
    "REWEAR privacy, terms, accessibility statement, shipping and returns policy. Written to be read, not buried.",
};

const SECTIONS = [
  {
    id: "privacy",
    index: "01",
    title: "Privacy",
    body: [
      "We collect only what an order needs: your name, email, delivery address and — if you choose — a phone number for the carrier. Cart and wishlist data live in your browser, not on our servers.",
      "Style Match runs on-device. Your answers are not transmitted, stored or profiled. We do not sell data, run third-party ad pixels or build shadow profiles.",
      "Order records are kept for accounting and repair history. You can ask us to delete your account and associated personal data at any time; order records required by tax law are retained in anonymised form.",
    ],
  },
  {
    id: "terms",
    index: "02",
    title: "Terms",
    body: [
      "Prices are listed in INR and include applicable taxes. Delivery is free over ₹5,000 within India; international duties may apply at the border.",
      "Orders are confirmed when payment is authorised or cash-on-delivery is accepted. We may cancel an order if stock is unavailable, in which case you are refunded in full.",
      "Lifetime repair cover applies to normal wear, structural failure and hardware. It does not cover deliberate damage or loss. Take-back credit is issued at our assessed fibre value.",
    ],
  },
  {
    id: "shipping",
    index: "03",
    title: "Shipping & returns",
    body: [
      "Dispatch within 24 hours; delivery in 2–4 working days across India, 5–9 internationally. All deliveries are carbon-neutral and tracked.",
      "Returns are accepted within 30 days on unworn pieces with tags attached. Return shipping is free within India. Refunds are issued to the original payment method within 5 working days of inspection.",
      "Returned pieces are inspected, repaired where needed, and re-sold or re-spun. Nothing returned to REWEAR is sent to landfill.",
    ],
  },
  {
    id: "accessibility",
    index: "04",
    title: "Accessibility",
    body: [
      "REWEAR targets WCAG 2.2 AA. The site is fully keyboard navigable, uses semantic landmarks, visible focus states and respects prefers-reduced-motion by disabling decorative motion and parallax.",
      "The 3D hero is decorative and degrades to a static holographic illustration on small screens, low-power devices and when WebGL is unavailable. All meaningful content is available as text.",
      "If any part of this site blocks you from shopping, email help@rewear.systems and we will fix it — and help you place the order in the meantime.",
    ],
  },
];

export default function LegalPage() {
  return (
    <div className="relative pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80">
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="container-x max-w-5xl pb-24">
        <div className="border-b border-white/[0.08] pb-8">
          <p className="eyebrow mb-3">Legal / plain language</p>
          <h1 className="text-[clamp(2.6rem,7vw,5rem)] font-medium leading-none tracking-[-0.05em] text-chrome">
            The fine print, <span className="text-gradient">readable.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-silver/45">
            No dark patterns, no hidden arbitration clauses, no data harvesting. If something here is
            unclear, write to us and we will rewrite it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="chip hover:border-violet/50 hover:text-chrome">
                {s.index} — {s.title}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-14">
          {SECTIONS.map((section, i) => (
            <Reveal key={section.id} delay={i * 60}>
              <section id={section.id} className="scroll-mt-32 grid gap-5 sm:grid-cols-[180px_1fr] sm:gap-10">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-violet/60">{section.index}</p>
                  <h2 className="mt-1 text-xl font-medium tracking-tight text-chrome sm:text-2xl">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="text-sm leading-relaxed text-silver/55">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-white/[0.09] bg-white/[0.02] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/35">Contact</p>
              <p className="mt-2 text-sm text-chrome">help@rewear.systems</p>
              <p className="mt-1 text-xs text-silver/40">REWEAR Systems · Bengaluru, India</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/support" className="btn btn-ghost btn-sm">
                Support <Icon name="mail" size={13} />
              </Link>
              <Link href="/sustainability" className="btn btn-ghost btn-sm">
                Impact report <Icon name="arrow-up-right" size={13} />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/25">
          Last updated — November 2026
        </p>
      </div>
    </div>
  );
}
