import { put, list, head, del } from "@vercel/blob";
import { fetchBlobJson } from "@/lib/blob";

export type OrderItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
};

export type PaymentMethod = "cod" | "razorpay" | "demo";
export type Order = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "received" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed" | "test";
  paymentId?: string;
  notes?: string;
  stockDeducted?: boolean;
  restocked?: boolean;
};

function genId() {
  return "RW-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

// Orders are written as immutable, uniquely named version files. Object storage
// overwrites on the same path are eventually consistent (and CDN-cached), which
// made status changes appear stale. Unique paths are always read fresh.
function versionPath(id: string) {
  return `orders/${id}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.json`;
}

async function writeVersion(order: Order) {
  await put(versionPath(order.id), JSON.stringify(order), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  await pruneOldVersions(order.id);
}

async function pruneOldVersions(id: string) {
  try {
    const { blobs } = await list({ prefix: `orders/${id}/`, limit: 1000 });
    if (blobs.length <= 1) return;
    const sorted = [...blobs].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    const stale = sorted.slice(1).map((b) => b.url);
    if (stale.length) await del(stale);
  } catch {}
}

export async function saveOrder(
  input: Omit<Order, "id" | "createdAt" | "status"> & Partial<Pick<Order, "paymentMethod" | "paymentStatus" | "paymentId">>
): Promise<Order> {
  const order: Order = {
    ...input,
    paymentMethod: input.paymentMethod ?? "cod",
    paymentStatus: input.paymentStatus ?? "pending",
    stockDeducted: input.stockDeducted ?? true,
    restocked: false,
    id: genId(),
    createdAt: new Date().toISOString(),
    status: "received",
  };
  await writeVersion(order);
  return order;
}

export async function saveOrderState(order: Order): Promise<Order> {
  await writeVersion(order);
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const { blobs } = await list({ prefix: `orders/${id}/`, limit: 1000 });
    if (blobs.length > 0) {
      const latest = [...blobs].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
      const found = await fetchBlobJson<Order>(latest.url);
      if (found) return found;
    }
  } catch {}
  // legacy flat layout: orders/<id>.json
  try {
    const meta = await head(`orders/${id}.json`);
    return await fetchBlobJson<Order>(meta.url);
  } catch {
    return null;
  }
}

type BlobRef = { url: string; pathname: string; uploadedAt: Date };

export async function listOrders(limit = 1000): Promise<Order[]> {
  try {
    const { blobs } = await list({ prefix: "orders/", limit });
    const latestById = new Map<string, BlobRef>();
    const versionedIds = new Set<string>();

    for (const b of blobs) {
      const rest = b.pathname.slice("orders/".length);
      if (rest.includes("/")) {
        const id = rest.split("/")[0];
        if (!id) continue;
        versionedIds.add(id);
        const prev = latestById.get(id);
        if (!prev || b.uploadedAt.getTime() > prev.uploadedAt.getTime()) {
          latestById.set(id, { url: b.url, pathname: b.pathname, uploadedAt: b.uploadedAt });
        }
      } else if (rest.endsWith(".json")) {
        const id = rest.slice(0, -".json".length);
        if (!id) continue;
        const prev = latestById.get(id);
        if (!prev) latestById.set(id, { url: b.url, pathname: b.pathname, uploadedAt: b.uploadedAt });
      }
    }

    // If a versioned copy exists for an id, ignore any legacy flat copy.
    for (const id of versionedIds) {
      const ref = latestById.get(id);
      if (ref && !ref.pathname.includes("/")) latestById.delete(id);
    }

    const orders = await Promise.all(
      [...latestById.entries()].map(async ([id, ref]) => {
        const o = await fetchBlobJson<Order>(ref.url);
        return o && o.id ? o : null;
      })
    );
    return (orders.filter(Boolean) as Order[]).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}
