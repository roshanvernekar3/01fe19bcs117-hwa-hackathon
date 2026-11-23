export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCatalog, saveCatalog } from "@/lib/products-store";
import type { Product } from "@/lib/products";

export async function GET() {
  const products = await getCatalog();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = await getCatalog();
    const newProduct: Product = {
      id: body.id || `p-${Date.now()}`,
      slug: body.slug,
      name: body.name,
      category: body.category,
      tagline: body.tagline || "",
      description: body.description || "",
      price: Number(body.price) || 0,
      rating: Number(body.rating) || 4.5,
      reviews: Number(body.reviews) || 0,
      badge: body.badge || undefined,
      emoji: body.emoji || "🐾",
      gradient: body.gradient || "from-cream to-blush",
      image: body.image || "/products/treattrek.jpeg",
      features: Array.isArray(body.features) ? body.features : String(body.features || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      inStock: body.inStock !== false,
    };
    if (!newProduct.slug || !newProduct.name) {
      return NextResponse.json({ error: "Name and slug required" }, { status: 400 });
    }
    if (products.some((p) => p.slug === newProduct.slug)) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    products.push(newProduct);
    await saveCatalog(products);
    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const products = await getCatalog();
    const idx = products.findIndex((p) => p.slug === body.slug || p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const p = products[idx];
    if (body.name !== undefined) p.name = body.name;
    if (body.category !== undefined) p.category = body.category;
    if (body.tagline !== undefined) p.tagline = body.tagline;
    if (body.description !== undefined) p.description = body.description;
    if (body.price !== undefined) p.price = Number(body.price);
    if (body.rating !== undefined) p.rating = Number(body.rating);
    if (body.reviews !== undefined) p.reviews = Number(body.reviews);
    if (body.badge !== undefined) p.badge = body.badge || undefined;
    if (body.emoji !== undefined) p.emoji = body.emoji;
    if (body.image !== undefined) p.image = body.image;
    if (body.features !== undefined) p.features = Array.isArray(body.features) ? body.features : String(body.features).split(",").map((s: string) => s.trim()).filter(Boolean);
    if (body.inStock !== undefined) p.inStock = Boolean(body.inStock);
    products[idx] = p;
    await saveCatalog(products);
    return NextResponse.json({ product: p });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
    const products = await getCatalog();
    const filtered = products.filter((p) => p.slug !== slug);
    if (filtered.length === products.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await saveCatalog(filtered);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
