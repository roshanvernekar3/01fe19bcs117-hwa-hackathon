export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "gallery/", limit: 30 });
    const items = blobs.map((b) => ({ url: b.url, name: b.pathname }));
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, name } = body ?? {};
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }
    // image is data URL: data:image/...;base64,...
    const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");
    const filename = `gallery/${Date.now()}-${(name || "paw").toString().replace(/[^a-z0-9]/gi, "")}.jpg`;
    const blob = await put(filename, buffer, { access: "public", contentType });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
