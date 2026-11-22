import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  productSlug?: string;
  createdAt: string;
};

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "reviews/", limit: 50 });
    const reviews = await Promise.all(
      blobs.map(async (b) => {
        try {
          const res = await fetch(b.url, { cache: "no-store" });
          if (!res.ok) return null;
          return (await res.json()) as Review;
        } catch {
          return null;
        }
      })
    );
    const list2 = reviews.filter(Boolean) as Review[];
    list2.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ reviews: list2 });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, rating, text, productSlug } = body ?? {};
    if (!name || !text || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const r = Math.min(5, Math.max(1, Number(rating)));
    const review: Review = {
      id: `RV-${Date.now().toString(36).toUpperCase()}`,
      name: String(name).slice(0, 60),
      rating: r,
      text: String(text).slice(0, 500),
      productSlug: productSlug || undefined,
      createdAt: new Date().toISOString(),
    };
    await put(`reviews/${review.id}.json`, JSON.stringify(review), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
