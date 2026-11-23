export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body ?? {};
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await put(`support/${Date.now()}.json`, JSON.stringify({ name, email, subject, message, createdAt: new Date().toISOString() }), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
