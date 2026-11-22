import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featured = PRODUCTS.slice(0, 4);
  const bestsellers = PRODUCTS.filter((p) => p.badge).slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-blush to-peach" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-sage/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-berry/20 rounded-full blur-3xl" />

        {/* floating 3D elements */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute top-24 left-[8%] text-5xl animate-float drop-shadow-lg">🐾</span>
          <span className="absolute top-40 right-[12%] text-4xl animate-float-slow drop-shadow-lg">🎾</span>
          <span className="absolute bottom-32 left-[18%] text-4xl animate-float-slow drop-shadow-lg">🦴</span>
          <span className="absolute top-28 right-[30%] text-3xl animate-float drop-shadow-lg">✨</span>
          <span className="absolute bottom-24 right-[8%] text-5xl animate-float drop-shadow-lg">🐱</span>
          <span className="absolute top-1/2 left-[4%] text-3xl animate-float-slow drop-shadow-lg">❤️</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-center w-full">
          <div>
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
              <Link href="/products" className="px-7 py-3.5 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition shadow-lg shadow-berry/30">
                Shop the Collection
              </Link>
              <Link href="/products?category=interactive-toys" className="px-7 py-3.5 rounded-full bg-white/80 backdrop-blur text-navy font-semibold hover:bg-white transition border border-white shadow-sm">
                Explore Toys
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-muted">
              <div><span className="font-bold text-navy text-lg">10k+</span><br />happy pets</div>
              <div><span className="font-bold text-navy text-lg">4.8★</span><br />avg rating</div>
              <div><span className="font-bold text-navy text-lg">Free</span><br />ship $75+</div>
            </div>
          </div>

          {/* cute dog & cat with 3D floating */}
          <div className="relative h-[420px] md:h-[520px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* soft platform */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-72 h-20 bg-sage/50 rounded-[50%] blur-md" />
                {/* dog */}
                <div className="absolute bottom-16 left-6 text-[150px] md:text-[190px] animate-wiggle drop-shadow-2xl select-none">🐶</div>
                {/* cat */}
                <div className="absolute bottom-20 right-6 text-[140px] md:text-[170px] animate-float drop-shadow-2xl select-none">🐱</div>
                {/* floating 3D bubbles */}
                <div className="absolute top-8 left-1/3 w-20 h-20 rounded-full bg-white/60 backdrop-blur shadow-xl flex items-center justify-center text-3xl animate-float">🏠</div>
                <div className="absolute top-20 right-1/4 w-16 h-16 rounded-full bg-peach/80 shadow-xl flex items-center justify-center text-2xl animate-float-slow">🛁</div>
                <div className="absolute top-1/2 left-8 w-14 h-14 rounded-full bg-blush shadow-lg flex items-center justify-center text-2xl animate-float">🎾</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Shop by Category</h2>
            <p className="text-muted mt-2">Everything your pet needs, all in one place.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {CATEGORIES.map((c, i) => {
              const gradients = ["from-blush to-peach", "from-sage to-cream", "from-peach to-blush"];
              return (
                <Link key={c.slug} href={`/products?category=${c.slug}`} className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradients[i]} p-8 hover:shadow-xl hover:-translate-y-1 transition border border-white/60`}>
                  <div className="text-6xl mb-4 group-hover:scale-110 transition">{c.emoji}</div>
                  <h3 className="text-xl font-bold text-navy">{c.name}</h3>
                  <p className="text-navy/70 mt-1 text-sm">{c.desc}</p>
                  <span className="mt-4 inline-block text-berry font-semibold text-sm group-hover:translate-x-1 transition">Shop now →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white/60 backdrop-blur py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Featured Products</h2>
              <p className="text-muted mt-1">Hand-picked favorites from our catalog.</p>
            </div>
            <Link href="/products" className="text-berry font-semibold hover:underline">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers strip */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Loved by Pets & Parents</h2>
            <p className="text-muted mt-2">Our bestsellers, chosen by thousands of happy homes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Why PAWBERRY?</h2>
            <p className="text-muted mt-4 leading-relaxed">
              We believe every pet deserves joy, comfort and a clean home — without breaking the bank. Our products are tested by real pets and real families.
            </p>
            <ul className="mt-6 space-y-3 text-navy/80">
              <li className="flex gap-3"><span className="text-berry">✓</span> Affordable premium quality</li>
              <li className="flex gap-3"><span className="text-berry">✓</span> Vet-approved materials</li>
              <li className="flex gap-3"><span className="text-berry">✓</span> 30-day hassle-free returns</li>
              <li className="flex gap-3"><span className="text-berry">✓</span> Free shipping over $75</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blush to-peach rounded-3xl h-40 flex items-center justify-center text-6xl animate-float">🐶</div>
            <div className="bg-gradient-to-br from-sage to-cream rounded-3xl h-40 flex items-center justify-center text-6xl mt-6 animate-float-slow">🐱</div>
            <div className="bg-gradient-to-br from-peach to-blush rounded-3xl h-40 flex items-center justify-center text-6xl animate-float-slow">🏠</div>
            <div className="bg-gradient-to-br from-cream to-sage rounded-3xl h-40 flex items-center justify-center text-6xl mt-6 animate-float">🛁</div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-br from-sage to-blush py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Get in touch</h2>
          <p className="text-navy/70 mt-3">Questions about an order or a product? We&apos;re here to help.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:hello@pawberry.com" className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition shadow-lg shadow-berry/20">hello@pawberry.com</a>
            <a href="tel:+18005551234" className="px-6 py-3 rounded-full bg-white/80 text-navy font-semibold hover:bg-white transition">1-800-555-1234</a>
          </div>
        </div>
      </section>
    </div>
  );
}
