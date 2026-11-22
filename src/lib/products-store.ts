import { put, head } from "@vercel/blob";
import { PRODUCTS as STATIC } from "@/lib/products";
import type { Product } from "@/lib/products";

const KEY = "products/catalog.json";

export async function getCatalog(): Promise<Product[]> {
  try {
    const meta = await head(KEY);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as Product[];
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  return STATIC;
}

export async function saveCatalog(products: Product[]) {
  await put(KEY, JSON.stringify(products), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}
