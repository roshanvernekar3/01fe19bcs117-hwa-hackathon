export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    // check duplicate
    const { blobs } = await list({ prefix: "newsletter/", limit: 100 });
    for (const b of blobs) {
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        if (res.ok) {
          const d = await res.json();
          if (d?.email === email) {
            return NextResponse.json({ ok: true, duplicate: true });
          }
        }
      } catch {}
    }
    await put(`newsletter/${Date.now()}.json`, JSON.stringify({ email, createdAt: new Date().toISOString() }), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
