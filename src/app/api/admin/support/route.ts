export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { updateComplaint, listComplaints } from "@/lib/support";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("pb_admin")?.value;
  const expected = process.env.ADMIN_PASSWORD || "pawberry-admin";
  if (cookie !== expected) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const complaints = await listComplaints();
  return NextResponse.json({ complaints });
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("pb_admin")?.value;
  const expected = process.env.ADMIN_PASSWORD || "pawberry-admin";
  if (cookie !== expected) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const complaint = await updateComplaint(String(body?.id || ""), {
      status: "in-progress",
      reply: { authorEmail: "admin@pawberry.pet", authorName: "PawBerry Support", message: String(body?.message || "") },
    });
    if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ complaint });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const cookie = req.cookies.get("pb_admin")?.value;
  const expected = process.env.ADMIN_PASSWORD || "pawberry-admin";
  if (cookie !== expected) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const complaint = await updateComplaint(String(body?.id || ""), { status: body?.status });
    if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ complaint });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
