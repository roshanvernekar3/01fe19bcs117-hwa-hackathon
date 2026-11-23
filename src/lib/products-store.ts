import { put, head } from "@vercel/blob";
import { fetchBlobJson } from "@/lib/blob";
import { PRODUCTS as STATIC } from "@/lib/products";
import type { Product } from "@/lib/products";

const KEY = "products/catalog.json";

export async function getCatalog(): Promise<Product[]> {
  try {
    const meta = await head(KEY);
    const data = await fetchBlobJson<Product[]>(meta.url);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {}
  return STATIC;
}

export async function saveCatalog(products: Product[]) {
  await put(KEY, JSON.stringify(products), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
