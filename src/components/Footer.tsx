import Link from "next/link";
import { Logo } from "@/components/Brand";
import NewsletterForm from "@/components/NewsletterForm";
import Icon from "@/components/ui/Icon";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All pieces", href: "/products" },
      { label: "Outerwear", href: "/products?category=outerwear" },
      { label: "Tops", href: "/products?category=tops" },
      { label: "Bottoms", href: "/products?category=bottoms" },
      { label: "Accessories", href: "/products?category=accessories" },
    ],
  },
  {
    title: "System",
    links: [
      { label: "AI Style Match", href: "/style-match" },
      { label: "Collections", href: "/#collections" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Materials", href: "/sustainability#materials" },
      { label: "Circularity", href: "/sustainability#circularity" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/support" },
      { label: "Shipping & returns", href: "/support#shipping" },
      { label: "Care & repair", href: "/sustainability#care" },
      { label: "Track order", href: "/orders" },
      { label: "FAQ", href: "/support#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal#privacy" },
      { label: "Terms", href: "/legal#terms" },
      { label: "Accessibility", href: "/legal#accessibility" },
      { label: "Impact reports", href: "/sustainability#report" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-0 overflow-hidden border-t border-white/[0.08] bg-carbon">
      <div className="container-x">
        {/* Newsletter band */}
        <div className="grid gap-10 border-b border-white/[0.08] py-16 md:grid-cols-[1.1fr_1fr] md:items-end md:py-20">
          <div>
            <p className="eyebrow mb-5">Stay in the loop</p>
            <h2 className="max-w-xl text-4xl font-medium leading-[0.95] tracking-[-0.04em] text-chrome sm:text-5xl lg:text-6xl">
              The next drop
              <br />
              <span className="text-violet-gradient">leaves no trace.</span>
            </h2>
          </div>
          <div className="md:justify-self-end">
            <NewsletterForm />
          </div>
        </div>

        {/* Link grid */}
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-silver/50">
              A circular fashion system for people who refuse to choose between future-facing design and a
              planet that keeps up.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip">
                <Icon name="recycle" size={11} /> Circular
              </span>
              <span className="chip">
                <Icon name="leaf" size={11} /> Carbon-neutral
              </span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 font-mono text-[9px] uppercase tracking-[0.24em] text-silver/35">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-silver/55 transition-colors hover:text-chrome"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant wordmark */}
        <div className="pointer-events-none select-none border-t border-white/[0.06] pt-10">
          <p className="text-outline whitespace-nowrap text-[19vw] font-bold leading-[0.72] tracking-[-0.06em] opacity-30 lg:text-[15rem]">
            REWEAR
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.08] py-6 font-mono text-[9px] uppercase tracking-[0.18em] text-silver/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} REWEAR Systems — All rights reserved</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-bright animate-pulse-dot" />
              System online
            </span>
            <span>SS26 / 01</span>
            <span>Made for circularity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
