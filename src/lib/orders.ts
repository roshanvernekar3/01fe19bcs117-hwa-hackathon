import { put, list, head } from "@vercel/blob";

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
};

function genId() {
  return "PB-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function saveOrder(input: Omit<Order, "id" | "createdAt" | "status"> & Partial<Pick<Order, "paymentMethod" | "paymentStatus" | "paymentId">>): Promise<Order> {
  const order: Order = {
    ...input,
    paymentMethod: input.paymentMethod ?? "cod",
    paymentStatus: input.paymentStatus ?? "pending",
    id: genId(),
    createdAt: new Date().toISOString(),
    status: "received",
  };
  await put(`orders/${order.id}.json`, JSON.stringify(order), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const meta = await head(`orders/${id}.json`);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Order;
  } catch {
    return null;
  }
}

export async function listOrders(limit = 50): Promise<Order[]> {
  try {
    const { blobs } = await list({ prefix: "orders/", limit });
    const orders = await Promise.all(
      blobs.map(async (b) => {
        try {
          const res = await fetch(b.url, { cache: "no-store" });
          if (!res.ok) return null;
          return (await res.json()) as Order;
        } catch {
          return null;
        }
      })
    );
    return (orders.filter(Boolean) as Order[]).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}
