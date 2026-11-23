import { NextRequest, NextResponse } from "next/server";
import { listOrders } from "@/lib/orders";

export async function GET(req: NextRequest) {
  const email = req.cookies.get("pb_user")?.value;
  if (!email) return NextResponse.json({ orders: [] });
  const all = await listOrders();
  const mine = all.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase());
  return NextResponse.json({ orders: mine });
}