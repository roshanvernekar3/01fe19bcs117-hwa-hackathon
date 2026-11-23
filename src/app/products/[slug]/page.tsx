import { notFound } from "next/navigation";
import Link from "next/link";
import { getCatalog } from "@/lib/products-store";
import AddToCart from "@/components/AddToCart";
import NotifyMe from "@/components/NotifyMe";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = catalog.filter((p) => p.category === product.category && p.slug !== slug).slice(0, 4);

  const isToy = product.category === "interactive-toys";
  const stepsTitle = isToy ? "How to Play" : "How to Use";
  const steps = isToy
    ? [
        { title: "Introduce", desc: "Place the toy near your pet and let them sniff and explore at their own pace.", emoji: "👃" },
        { title: "Activate", desc: "Turn it on or hide a treat to spark curiosity and get them moving.", emoji: "⚡" },
        { title: "Play together", desc: "Join the fun, praise and reward your pet for engaging.", emoji: "🎉" },
      ]
    : product.category === "pet-houses"
    ? [
        { title: "Set up", desc: "Assemble and place the house in a quiet, cozy corner of your home.", emoji: "🛠️" },
        { title: "Add comfort", desc: "Line it with a soft blanket or cushion for extra warmth.", emoji: "🛏️" },
        { title: "Invite", desc: "Encourage your pet with treats to explore and claim their new den.", emoji: "🐾" },
      ]
    : [
        { title: "Prepare", desc: "Fill with your preferred litter and place in a well-ventilated spot.", emoji: "🧹" },
        { title: "Introduce", desc: "Let your cat explore the station freely and get comfortable.", emoji: "🐱" },
        { title: "Maintain", desc: "Scoop daily and refresh litter weekly to keep it fresh.", emoji: "✨" },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-berry">Home</Link> / <Link href="/products" className="hover:text-berry">Products</Link> / <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <ProductImage src={product.image} alt={product.name} />

        <div>
          {product.badge && <span className="inline-block text-xs font-semibold text-berry bg-berry/10 px-3 py-1 rounded-full mb-3">{product.badge}</span>}
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy">{product.name}</h1>
          <p className="text-slate-500 mt-2">{product.tagline}</p>
          {!product.inStock && (
            <span className="inline-block mt-3 text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">Out of Stock</span>
          )}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-extrabold text-berry">₹{product.price}</span>
            <span className="text-sm text-slate-400">★ {product.rating} ({product.reviews} reviews)</span>
          </div>
          <p className="mt-6 text-slate-700 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <h3 className="font-semibold text-navy mb-2">Features</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2"><span className="text-berry">✓</span>{f}</li>
              ))}
            </ul>
          </div>

          {/* How to Play / Use */}
          <div className="mt-8">
            <h3 className="font-semibold text-navy mb-3">{stepsTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {steps.map((s, i) => (
                <div key={s.title} className="bg-gradient-to-br from-cream to-blush rounded-2xl p-4 border border-white hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full bg-berry text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-2xl">{s.emoji}</span>
                  </div>
                  <div className="font-bold text-navy text-sm">{s.title}</div>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {product.inStock ? (
              <AddToCart product={product} />
            ) : (
              <NotifyMe slug={product.slug} productName={product.name} />
            )}
          </div>

          <div className="mt-6 text-sm text-slate-500 space-y-1">
            <div>🚚 Free shipping on orders over ₹1000</div>
            <div>↩️ 30-day hassle-free returns</div>
            <div>✅ In stock & ready to ship</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <Reveal>
          <section className="mt-20">
            <h2 className="text-2xl font-extrabold text-navy mb-6">You may also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <div key={p.id} className="hover-lift">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}
    </div>
  );
}
