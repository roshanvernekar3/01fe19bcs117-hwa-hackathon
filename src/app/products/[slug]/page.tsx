import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProduct, byCategory } from "@/lib/products";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = byCategory(product.category).filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-berry">Home</Link> / <Link href="/products" className="hover:text-berry">Products</Link> / <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative rounded-3xl overflow-hidden h-80 md:h-[480px] shadow-lg bg-gradient-to-br from-cream to-blush">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" priority />
        </div>

        <div>
          {product.badge && <span className="inline-block text-xs font-semibold text-berry bg-berry/10 px-3 py-1 rounded-full mb-3">{product.badge}</span>}
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy">{product.name}</h1>
          <p className="text-slate-500 mt-2">{product.tagline}</p>
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

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <div className="mt-6 text-sm text-slate-500 space-y-1">
            <div>🚚 Free shipping on orders over ₹1000</div>
            <div>↩️ 30-day hassle-free returns</div>
            <div>✅ In stock & ready to ship</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-extrabold text-navy mb-6">You may also like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
