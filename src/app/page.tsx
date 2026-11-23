"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import GallerySection from "@/components/GallerySection";
import ReviewsSection from "@/components/ReviewsSection";
import NewsletterSection from "@/components/NewsletterSection";
import type { Product } from "@/lib/products";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  const featured = products.slice(0, 4);
  const bestsellers = products.filter((p) => p.badge).slice(0, 4);
  const showcase = products.slice(0, 6);

  // refs
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const parallaxRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const factor = mobile ? 0.4 : 1;
    let raf = 0;
    function update() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Hero parallax
      const hero = heroRef.current;
      if (hero) {
        const h = hero.offsetHeight;
        const p = Math.min(1, Math.max(0, scrollY / h));
        if (heroBgRef.current) {
          heroBgRef.current.style.transform = `translate3d(0, ${scrollY * 0.25 * factor}px, 0)`;
        }
        if (dogRef.current) {
          dogRef.current.style.transform = `translate3d(0, ${scrollY * 0.4 * factor}px, 0) scale(${1 + p * 0.06})`;
        }
        if (catRef.current) {
          catRef.current.style.transform = `translate3d(0, ${scrollY * 0.25 * factor}px, 0) scale(${1 + p * 0.04})`;
        }
        if (titleRef.current) {
          titleRef.current.style.transform = `translate3d(0, ${scrollY * 0.15 * factor}px, 0)`;
          titleRef.current.style.opacity = String(Math.max(0, 1 - p * 1.1));
        }
        hero.style.opacity = String(Math.max(0, 1 - p * 0.9));
        hero.style.transform = `scale(${1 - p * 0.04})`;
      }

      // Horizontal showcase
      const sc = showcaseRef.current;
      const tr = trackRef.current;
      if (sc && tr) {
        const top = sc.offsetTop;
        const height = sc.offsetHeight;
        const progress = Math.min(1, Math.max(0, (scrollY - top + vh * 0.5) / (height - vh)));
        const max = tr.scrollWidth - sc.clientWidth;
        tr.style.transform = `translate3d(${-progress * max}px, 0, 0)`;
      }

      // Generic parallax layers
      parallaxRefs.current.forEach((el) => {
        if (!el) return;
        const speed = parseFloat(el.dataset.speed || "0.3");
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed * factor;
        el.style.transform = `translate3d(0, ${-offset}px, 0)`;
      });

      raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero (sticky-ish full screen) */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden" style={{ willChange: "transform, opacity" }}>
        <div ref={heroBgRef} className="absolute inset-0 bg-gradient-to-br from-cream via-blush to-peach" style={{ willChange: "transform" }} />
        <div className="absolute top-20 left-10 w-72 h-72 bg-sage/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-berry/20 rounded-full blur-3xl animate-float-slow" />

        {/* floating 3D elements */}
        <div className="pointer-events-none absolute inset-0" style={{ perspective: "900px" }}>
          <span className="absolute top-24 left-[8%] text-5xl animate-toy-float drop-shadow-lg" style={{ transform: "translateZ(40px)" }}>🐾</span>
          <span className="absolute top-40 right-[12%] text-4xl animate-toy-float drop-shadow-lg" style={{ animationDelay: "0.5s", transform: "translateZ(60px)" }}>🎾</span>
          <span className="absolute bottom-32 left-[18%] text-4xl animate-float-slow drop-shadow-lg" style={{ transform: "translateZ(20px)" }}>🦴</span>
          <span className="absolute top-28 right-[30%] text-3xl animate-float drop-shadow-lg">✨</span>
          <span className="absolute bottom-24 right-[8%] text-5xl animate-float drop-shadow-lg" style={{ transform: "translateZ(50px)" }}>🐱</span>
          <span className="absolute top-1/2 left-[4%] text-3xl animate-float-slow drop-shadow-lg">❤️</span>
          <span className="absolute top-16 left-[40%] text-3xl animate-toy-float drop-shadow-lg" style={{ animationDelay: "1.2s", transform: "translateZ(80px)" }}>🧶</span>
          <span className="absolute bottom-16 right-[35%] text-3xl animate-toy-float drop-shadow-lg" style={{ animationDelay: "2s", transform: "translateZ(30px)" }}>🛏️</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-center w-full">
          <div ref={titleRef} style={{ willChange: "transform, opacity" }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/70 backdrop-blur text-berry text-xs font-semibold mb-6 shadow-sm">
              🐾 New arrivals every week
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-navy leading-[1.05]">
              Little Adventures.<br />
              <span className="text-berry">Happy Paws.</span><br />
              Everyday Fun.
            </h1>
            <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
              Innovative, affordable products for dogs and cats — interactive toys, cozy houses and odor-free washrooms. Designed with love, built to last.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="px-7 py-3.5 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition shadow-lg shadow-berry/30 hover-lift">
                Shop the Collection
              </Link>
              <Link href="/products?category=interactive-toys" className="px-7 py-3.5 rounded-full bg-white/80 backdrop-blur text-navy font-semibold hover:bg-white transition border border-white shadow-sm hover-lift">
                Explore Toys
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-muted">
              <div><span className="font-bold text-navy text-lg">10k+</span><br />happy pets</div>
              <div><span className="font-bold text-navy text-lg">4.8★</span><br />avg rating</div>
              <div><span className="font-bold text-navy text-lg">Free</span><br />ship ₹1000+</div>
            </div>
          </div>

          {/* cute dog & cat with 3D floating */}
          <div className="relative h-[420px] md:h-[520px]" style={{ perspective: "1000px" }}>
            <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-72 h-20 bg-sage/50 rounded-[50%] blur-md" />
              <div ref={dogRef} className="absolute bottom-16 left-6 text-[150px] md:text-[190px] drop-shadow-2xl select-none" style={{ willChange: "transform" }}>
                🐶
                <span className="absolute -right-2 bottom-4 text-3xl animate-tail-wag">🐾</span>
              </div>
              <div ref={catRef} className="absolute bottom-20 right-6 text-[140px] md:text-[170px] drop-shadow-2xl select-none" style={{ willChange: "transform" }}>
                🐱
                <span className="absolute -right-4 bottom-6 text-3xl animate-tail-wag" style={{ animationDelay: "0.3s" }}>🐾</span>
              </div>
              <div className="absolute top-8 left-1/3 w-20 h-20 rounded-full bg-white/60 backdrop-blur shadow-xl flex items-center justify-center text-3xl animate-float preserve-3d tilt-3d">🏠</div>
              <div className="absolute top-20 right-1/4 w-16 h-16 rounded-full bg-peach/80 shadow-xl flex items-center justify-center text-2xl animate-float-slow preserve-3d tilt-3d">🛁</div>
              <div className="absolute top-1/2 left-8 w-14 h-14 rounded-full bg-blush shadow-lg flex items-center justify-center text-2xl animate-float preserve-3d tilt-3d">🎾</div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal product showcase */}
      <section ref={showcaseRef} className="relative py-24 overflow-hidden" style={{ minHeight: "160vh" }}>
        <div className="sticky top-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Featured Collection</h2>
              <p className="text-muted mt-2">Scroll to explore our bestsellers.</p>
            </Reveal>
          </div>
          <div className="overflow-hidden">
            <div ref={trackRef} className="flex gap-6 px-4 sm:px-6 lg:px-8 will-change-transform" style={{ width: "max-content" }}>
              {showcase.map((p) => (
                <div key={p.id} className="w-[280px] sm:w-[320px] flex-shrink-0">
                  <ProductCard p={p} />
                </div>
              ))}
              {showcase.map((p) => (
                <div key={`dup-${p.id}`} className="w-[280px] sm:w-[320px] flex-shrink-0">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parallax story */}
      <section className="relative py-24 overflow-hidden">
        <div ref={(el) => { if (el) parallaxRefs.current[0] = el; }} data-speed="0.4" className="absolute -top-10 left-10 text-[120px] opacity-10 select-none pointer-events-none">🐾</div>
        <div ref={(el) => { if (el) parallaxRefs.current[1] = el; }} data-speed="0.6" className="absolute top-20 right-16 text-[100px] opacity-10 select-none pointer-events-none">🐱</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Designed for Joy</h2>
              <p className="text-muted mt-4 leading-relaxed">
                Every PAWBERRY product is crafted to spark curiosity, comfort and connection between you and your pet. Thoughtful details, honest prices, real results.
              </p>
              <Link href="/products" className="inline-block mt-6 px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition shadow-lg shadow-berry/20 hover-lift">
                Explore Products
              </Link>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-4" style={{ perspective: "900px" }}>
              <div className="bg-gradient-to-br from-blush to-peach rounded-3xl h-40 flex items-center justify-center text-6xl tilt-3d depth-shadow">🐶</div>
              <div className="bg-gradient-to-br from-sage to-cream rounded-3xl h-40 flex items-center justify-center text-6xl mt-6 tilt-3d depth-shadow">🐱</div>
              <div className="bg-gradient-to-br from-peach to-blush rounded-3xl h-40 flex items-center justify-center text-6xl tilt-3d depth-shadow">🏠</div>
              <div className="bg-gradient-to-br from-cream to-sage rounded-3xl h-40 flex items-center justify-center text-6xl mt-6 tilt-3d depth-shadow">🛁</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="flex justify-center gap-3 mb-4 text-2xl">
                <span className="animate-paw-trail">🐾</span>
                <span className="animate-paw-trail" style={{ animationDelay: "0.4s" }}>🐾</span>
                <span className="animate-paw-trail" style={{ animationDelay: "0.8s" }}>🐾</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Shop by Category</h2>
              <p className="text-muted mt-2">Everything your pet needs, all in one place.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {CATEGORIES.map((c, i) => {
              const gradients = ["from-blush to-peach", "from-sage to-cream", "from-peach to-blush"];
              return (
                <Reveal key={c.slug} delay={i * 100}>
                  <Link href={`/products?category=${c.slug}`} className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradients[i]} p-8 hover:shadow-xl hover:-translate-y-1 transition border border-white/60 hover-lift block`}>
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{c.emoji}</div>
                    <h3 className="text-xl font-bold text-navy">{c.name}</h3>
                    <p className="text-navy/70 mt-1 text-sm">{c.desc}</p>
                    <span className="mt-4 inline-block text-berry font-semibold text-sm group-hover:translate-x-1 transition">Shop now →</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white/60 backdrop-blur py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Featured Products</h2>
                <p className="text-muted mt-1">Hand-picked favorites from our catalog.</p>
              </div>
              <Link href="/products" className="text-berry font-semibold hover:underline">View all →</Link>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <div className="hover-lift"><ProductCard p={p} /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Loved by Pets & Parents</h2>
              <p className="text-muted mt-2">Our bestsellers, chosen by thousands of happy homes.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <div className="hover-lift"><ProductCard p={p} /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why PAWBERRY */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="flex justify-center gap-3 mb-4 text-2xl">
                <span className="animate-paw-trail">🐾</span>
                <span className="animate-paw-trail" style={{ animationDelay: "0.4s" }}>🐾</span>
                <span className="animate-paw-trail" style={{ animationDelay: "0.8s" }}>🐾</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Why PAWBERRY?</h2>
              <p className="text-muted mt-2 max-w-2xl mx-auto">
                We believe every pet deserves joy, comfort and a clean home — without breaking the bank. Our products are designed with love, tested by real pets, and built to last.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "💡", title: "Innovative Design", desc: "Smart, thoughtful products that spark curiosity and play." },
              { emoji: "💰", title: "Honest Prices", desc: "Premium quality at prices every family can afford." },
              { emoji: "🌿", title: "Safe Materials", desc: "Vet-friendly, non-toxic materials you can trust." },
              { emoji: "🚚", title: "Fast & Free Ship", desc: "Quick delivery with free shipping over ₹1000." },
              { emoji: "↩️", title: "Easy Returns", desc: "30-day hassle-free returns, no questions asked." },
              { emoji: "🐾", title: "Pet-Tested", desc: "Every product tried and approved by real pets." },
              { emoji: "🧼", title: "Easy to Clean", desc: "Machine-washable and quick-clean designs." },
              { emoji: "❤️", title: "Made with Love", desc: "Crafted by a team that adores animals." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className="bg-white/80 rounded-2xl p-5 border border-white hover-lift h-full">
                  <div className="text-3xl mb-2">{f.emoji}</div>
                  <div className="font-bold text-navy">{f.title}</div>
                  <p className="text-muted text-sm mt-1">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Collections */}
      <section className="py-20 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Gift Collections</h2>
              <p className="text-muted mt-2">Curated bundles that make tails wag and whiskers twitch.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "🎁", title: "Playtime Bundle", desc: "Interactive toys for endless fun.", href: "/products?category=interactive-toys", grad: "from-blush to-peach" },
              { emoji: "🏠", title: "Cozy Home Bundle", desc: "Houses and hideouts for sweet dreams.", href: "/products?category=pet-houses", grad: "from-sage to-cream" },
              { emoji: "🛁", title: "Fresh & Clean Bundle", desc: "Washroom essentials for a tidy home.", href: "/products?category=cat-washrooms", grad: "from-peach to-blush" },
            ].map((g, i) => (
              <Reveal key={g.title} delay={i * 100}>
                <Link href={g.href} className={`group block rounded-3xl bg-gradient-to-br ${g.grad} p-8 border border-white hover-lift`}>
                  <div className="text-5xl mb-3 group-hover:scale-110 transition">{g.emoji}</div>
                  <h3 className="text-xl font-bold text-navy">{g.title}</h3>
                  <p className="text-navy/70 text-sm mt-1">{g.desc}</p>
                  <span className="mt-4 inline-block text-berry font-semibold text-sm group-hover:translate-x-1 transition">Shop bundle →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <GallerySection />
      <ReviewsSection />
      <NewsletterSection />

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-br from-sage to-blush py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Get in touch</h2>
          <p className="text-navy/70 mt-3">Questions about an order or a product? We&apos;re here to help.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:hello@pawberry.com" className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition shadow-lg shadow-berry/20 hover-lift">hello@pawberry.com</a>
            <a href="tel:+18005551234" className="px-6 py-3 rounded-full bg-white/80 text-navy font-semibold hover:bg-white transition hover-lift">1-800-555-1234</a>
          </div>
        </div>
      </section>
    </div>
  );
}