export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif)$/i;

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "gallery/", limit: 60 });
    const items = blobs
      .filter((b) => IMAGE_EXT.test(b.pathname) && b.size > 1024)
      .sort((a, b) => b.pathname.localeCompare(a.pathname))
      .map((b) => ({ url: b.url, name: b.pathname }));
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
    const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");
    if (buffer.length < 1024) {
      return NextResponse.json({ error: "That image looks broken. Try another photo." }, { status: 400 });
    }
    const ext = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
        ? "webp"
        : contentType.includes("gif")
          ? "gif"
          : "jpg";
    const safe = (name || "rewear").toString().replace(/[^a-z0-9]/gi, "").slice(0, 40) || "rewear";
    const filename = `gallery/${Date.now()}-${safe}.${ext}`;
    const blob = await put(filename, buffer, { access: "public", contentType, addRandomSuffix: false });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
