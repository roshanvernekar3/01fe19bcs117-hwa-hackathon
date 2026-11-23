import { NextRequest, NextResponse } from "next/server";
import { getUser, saveUser } from "@/lib/users";
import { put } from "@vercel/blob";

export async function GET(req: NextRequest) {
  const email = req.cookies.get("pb_user")?.value;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getUser(email);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user: { email: user.email, name: user.name, role: user.role, avatar: user.avatar } });
}

export async function PATCH(req: NextRequest) {
  const email = req.cookies.get("pb_user")?.value;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getUser(email);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await req.json();
    if (body?.name) user.name = String(body.name).slice(0, 60);
    if (body?.avatar !== undefined) user.avatar = String(body.avatar).slice(0, 200);
    // optional photo upload
    if (body?.image) {
      const match = String(body.image).match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        const buffer = Buffer.from(match[2], "base64");
        const blob = await put(`avatars/${Date.now()}.jpg`, buffer, { access: "public", contentType: match[1], allowOverwrite: true });
        user.avatar = blob.url;
      }
    }
    await saveUser(user);
    return NextResponse.json({ ok: true, user: { email: user.email, name: user.name, role: user.role, avatar: user.avatar } });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}