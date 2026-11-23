import { NextRequest, NextResponse } from "next/server";
import { getUser, saveUser, hashPassword } from "@/lib/users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const name = String(body?.name || "").trim();
    const password = String(body?.password || "");
    if (!email || !name || password.length < 6) {
      return NextResponse.json({ error: "Name, valid email and password (6+ chars) required" }, { status: 400 });
    }
    const existing = await getUser(email);
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    const role: "admin" | "user" = adminEmails.includes(email) ? "admin" : "user";
    const user = {
      email,
      name,
      passwordHash: hashPassword(password),
      role,
      avatar: "🐾",
      createdAt: new Date().toISOString(),
    };
    await saveUser(user);
    const res = NextResponse.json({ ok: true, user: { email, name, role } }, { status: 201 });
    res.cookies.set("pb_user", email, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
