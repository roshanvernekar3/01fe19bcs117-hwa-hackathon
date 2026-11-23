import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/restock";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!slug || !email) return NextResponse.json({ error: "slug and email required" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    const { added, subscribers } = await addSubscriber(slug, email);
    return NextResponse.json({ ok: true, added, alreadySubscribed: !added, total: subscribers.length });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  // admin only for listing subscribers
  const cookie = req.cookies.get("pb_admin")?.value;
  const expected = process.env.ADMIN_PASSWORD || "pawberry-admin";
  if (cookie !== expected) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { getSubscribers } = await import("@/lib/restock");
  const subscribers = await getSubscribers(slug);
  return NextResponse.json({ slug, subscribers, count: subscribers.length });
}
