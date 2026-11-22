import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featured = PRODUCTS.slice(0, 4);
  const bestsellers = PRODUCTS.filter((p) => p.badge).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-amber-50 to-teal-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-berry/10 text-berry text-xs font-semibold mb-4">
              🐾 New arrivals every week
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-navy leading-tight">
              Happy pets,<br />
              <span className="text-berry">happier homes.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-lg">
              Innovative, affordable products for dogs and cats — interactive toys, cozy houses and odor-free washrooms. Designed with love, built to last.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="px-6 py-3 rounded-full bg-berry text-white font-semibold hover:bg-berry-dark transition shadow-lg shadow-berry/20">
                Shop Now
              </Link>
              <Link href="/products?category=interactive-toys" className="px-6 py-3 rounded-full bg-white text-navy font-semibold hover:bg-slate-50 transition border border-slate-200">
                Explore Toys
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div><span className="font-bold text-navy">10k+</span> happy pets</div>
              <div><span className="font-bold text-navy">4.8★</span> avg rating</div>
              <div><span className="font-bold text-navy">Free</span> shipping $75+</div>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {bestsellers.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition border border-slate-100">
                  <div className={`h-24 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-5xl mb-3 group-hover:scale-105 transition`}>
                    {p.emoji}
                  </div>
                  <div className="font-semibold text-navy text-sm">{p.name}</div>
                  <div className="text-berry font-bold">${p.price.toFixed(2)}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Shop by Category</h2>
          <p className="text-slate-500 mt-2">Everything your pet needs, all in one place.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-8 hover:shadow-xl transition">
              <div className="text-5xl mb-4">{c.emoji}</div>
              <h3 className="text-xl font-bold text-navy">{c.name}</h3>
              <p className="text-slate-500 mt-1 text-sm">{c.desc}</p>
              <span className="mt-4 inline-block text-berry font-semibold text-sm group-hover:translate-x-1 transition">Shop now →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Featured Products</h2>
              <p className="text-slate-500 mt-1">Hand-picked favorites from our catalog.</p>
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

      {/* About */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Why PAWBERRY?</h2>
          <p className="text-slate-600 mt-4">
            We believe every pet deserves joy, comfort and a clean home — without breaking the bank. Our products are tested by real pets and real families.
          </p>
          <ul className="mt-6 space-y-3 text-slate-700">
            <li className="flex gap-3"><span className="text-berry">✓</span> Affordable premium quality</li>
            <li className="flex gap-3"><span className="text-berry">✓</span> Vet-approved materials</li>
            <li className="flex gap-3"><span className="text-berry">✓</span> 30-day hassle-free returns</li>
            <li className="flex gap-3"><span className="text-berry">✓</span> Free shipping over $75</li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-rose-200 to-pink-300 rounded-3xl h-40 flex items-center justify-center text-6xl">🐶</div>
          <div className="bg-gradient-to-br from-teal-200 to-cyan-300 rounded-3xl h-40 flex items-center justify-center text-6xl mt-6">🐱</div>
          <div className="bg-gradient-to-br from-amber-200 to-orange-300 rounded-3xl h-40 flex items-center justify-center text-6xl">🏠</div>
          <div className="bg-gradient-to-br from-indigo-200 to-violet-300 rounded-3xl h-40 flex items-center justify-center text-6xl mt-6">🛁</div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-navy text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Get in touch</h2>
          <p className="text-slate-300 mt-3">Questions about an order or a product? We&apos;re here to help.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:hello@pawberry.com" className="px-6 py-3 rounded-full bg-berry font-semibold hover:bg-berry-dark transition">hello@pawberry.com</a>
            <a href="tel:+18005551234" className="px-6 py-3 rounded-full bg-white/10 font-semibold hover:bg-white/20 transition">1-800-555-1234</a>
          </div>
        </div>
      </section>
    </div>
  );
}
