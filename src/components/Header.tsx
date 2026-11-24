"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import ProfileMenu from "@/components/ProfileMenu";
import Icon from "@/components/ui/Icon";
import { Logo } from "@/components/Brand";
import { CATEGORIES } from "@/lib/products";
import { NAV_LINKS } from "@/lib/brand";

const UTILITY_LINKS = [
  { label: "Track order", href: "/orders" },
  { label: "Support", href: "/support" },
  { label: "Journal", href: "/sustainability" },
  { label: "Legal", href: "/legal" },
];

export default function Header() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  const isHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-white/[0.07] bg-void/90 backdrop-blur-xl">
        <div className="container-x flex h-9 items-center justify-between gap-4">
          <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-silver/55 sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-bright animate-pulse-dot" />
            SS26 / Drop 01 — now live
          </p>
          <p className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-silver/45 sm:block">
            Carbon-neutral delivery worldwide
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-silver/55 sm:text-[10px]">
            IND / INR ₹
          </p>
        </div>
      </div>

      <div
        className={`border-b transition-all duration-500 ${
          scrolled
            ? "border-white/[0.08] bg-void/88 backdrop-blur-2xl"
            : isHome
              ? "border-transparent bg-gradient-to-b from-void/70 to-transparent"
              : "border-white/[0.06] bg-void/70 backdrop-blur-xl"
        }`}
      >
        <div
          className={`container-x flex items-center justify-between gap-6 transition-all duration-500 ${
            scrolled ? "h-16" : "h-[72px]"
          }`}
        >
          <Logo compact={scrolled} />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                data-active={
                  link.href.startsWith("/#")
                    ? undefined
                    : pathname === link.href || pathname.startsWith(`${link.href}/`)
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSearchOpen((s) => !s);
              }}
              className="icon-btn"
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
            >
              <Icon name={searchOpen ? "close" : "search"} size={19} />
            </button>

            <ProfileMenu />

            <Link href="/wishlist" className="icon-btn relative" aria-label={`Wishlist, ${wishCount} items`}>
              <Icon name="heart" size={19} />
              {wishCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet px-1 font-mono text-[9px] font-bold text-void">
                  {wishCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="icon-btn relative" aria-label={`Bag, ${count} items`}>
              <Icon name="bag" size={19} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet px-1 font-mono text-[9px] font-bold text-void">
                  {count}
                </span>
              )}
            </Link>

            <span className="lg:hidden">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setOpen((o) => !o);
                }}
                className="icon-btn ml-0.5"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                <Icon name={open ? "close" : "menu"} size={21} />
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Search panel */}
      <div
        className={`overflow-hidden border-b border-white/[0.07] bg-void/95 backdrop-blur-2xl transition-all duration-500 ${
          searchOpen ? "max-h-44 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="container-x py-6">
          <form onSubmit={submitSearch} className="flex items-center gap-4 border-b border-white/15 pb-4">
            <Icon name="search" size={22} className="text-silver/50" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the system — shell, knit, cargo, bag…"
              className="w-full bg-transparent text-lg text-chrome placeholder:text-silver/30 focus:outline-none sm:text-xl"
              aria-label="Search products"
            />
            <button type="submit" className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-bright">
              Search
            </button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/35">Trending</span>
            {["Shell", "Knit", "Cargo", "Crossbody"].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  router.push(`/products?q=${encodeURIComponent(term)}`);
                }}
                className="chip hover:border-violet/50 hover:text-chrome"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 top-[108px] z-40 overflow-y-auto bg-void/97 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="container-x flex min-h-full flex-col py-8">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between border-b border-white/[0.08] py-5"
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-violet/70">0{i + 1}</span>
                  <span className="text-3xl font-medium tracking-tight text-chrome transition-transform duration-300 group-hover:translate-x-2">
                    {link.label}
                  </span>
                </span>
                <Icon name="arrow-up-right" size={20} className="text-silver/35" />
              </Link>
            ))}
          </nav>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onClick={() => setOpen(false)}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver/55 hover:text-violet-bright"
              >
                {cat.index} — {cat.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <div className="grid grid-cols-2 gap-3">
              {UTILITY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-silver/55 hover:text-chrome"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.2em] text-silver/30">
              REWEAR / SS26 — Wear the future. Waste nothing.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
