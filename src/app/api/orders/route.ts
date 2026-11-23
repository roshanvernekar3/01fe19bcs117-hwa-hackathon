import { NextRequest, NextResponse } from "next/server";
import { saveOrder, listOrders, getOrder } from "@/lib/orders";
import { put } from "@vercel/blob";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    const order = await getOrder(id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  }
  // listing all orders is admin-only
  const cookie = req.cookies.get("pb_admin")?.value;
  const expected = process.env.ADMIN_PASSWORD || "pawberry-admin";
  if (cookie !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

type IncomingItem = {
  slug?: string;
  id?: string;
  productId?: string;
  name?: string;
  productName?: string;
  title?: string;
  price?: number | string;
  qty?: number | string;
  quantity?: number | string;
};

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body ?? {};
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const order = await getOrder(id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // allow owner (by email) or admin
    const cookie = req.cookies.get("pb_admin")?.value;
    const isAdmin = cookie === (process.env.ADMIN_PASSWORD || "pawberry-admin");
    const userEmail = req.cookies.get("pb_user")?.value;
    const isOwner = !!userEmail && userEmail.trim().toLowerCase() === String(order.customer.email || "").trim().toLowerCase();
    if (!isAdmin && !isOwner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // only allow cancel by owner; status changes by admin
    if (status === "cancelled") {
      if (!isOwner && !isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      order.status = "cancelled";
    } else if (isAdmin && status) {
      order.status = status;
    } else {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }
    await put(`orders/${order.id}.json`, JSON.stringify(order), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawItems: IncomingItem[] =
      body?.items || body?.cart || body?.products || body?.orderItems || body?.lineItems || [];
    const c = body?.customer || body || {};
    const customer = {
      name: c.name || c.fullName || c.customerName,
      email: c.email || c.customerEmail,
      phone: c.phone || c.phoneNumber,
      address: c.address || c.street || c.addressLine1,
      city: c.city,
      zip: c.zip || c.postalCode || c.postcode,
      country: c.country || "United States",
    };

    if (!customer.name || !customer.email || !customer.address || !customer.city || !customer.zip || !customer.country) {
      return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
    }
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const items = rawItems.map((i) => ({
      slug: String(i.slug || i.id || i.productId || ""),
      name: String(i.name || i.productName || i.title || "Item"),
      price: Number(i.price ?? 0),
      qty: Number(i.qty ?? i.quantity ?? 1),
    }));

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 49;
    const total = subtotal + shipping;
    const order = await saveOrder({
      customer,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      notes: body?.notes,
      paymentMethod: body?.paymentMethod === "razorpay" ? "razorpay" : body?.paymentMethod === "demo" ? "demo" : "cod",
      paymentStatus: body?.paymentStatus === "paid" ? "paid" : body?.paymentStatus === "test" ? "test" : "pending",
      paymentId: body?.paymentId,
    });
    return NextResponse.json({ success: true, orderId: order.id, order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
