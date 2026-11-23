export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, name } = body ?? {};
    if (!image) return NextResponse.json({ error: "Missing image" }, { status: 400 });
    const match = String(image).match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    const buffer = Buffer.from(match[2], "base64");
    const filename = `products/${Date.now()}-${(name || "img").toString().replace(/[^a-z0-9]/gi, "")}.jpg`;
    const blob = await put(filename, buffer, { access: "public", contentType: match[1] });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
