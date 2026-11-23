export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/users";
import { createComplaint, listComplaints, type SupportTopic } from "@/lib/support";

const TOPICS: SupportTopic[] = ["order", "delivery", "return", "refund", "cancel", "payment", "product", "other"];

export async function GET(req: NextRequest) {
  const email = req.cookies.get("pb_user")?.value;
  if (!email) return NextResponse.json({ complaints: [] });
  const user = await getUser(email);
  const complaints = await listComplaints();
  const mine = complaints.filter((c) => c.userEmail === (user?.email || email).toLowerCase());
  return NextResponse.json({ complaints: mine });
}

export async function POST(req: NextRequest) {
  const email = req.cookies.get("pb_user")?.value;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getUser(email);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await req.json();
    const topic = TOPICS.includes(body?.topic) ? body.topic : "other";
    const message = String(body?.message || "").trim();
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });
    const complaint = await createComplaint({ userEmail: user.email, userName: user.name, topic, orderId: body?.orderId, message });
    return NextResponse.json({ complaint }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
