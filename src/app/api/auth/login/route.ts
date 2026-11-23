export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUser, verifyPassword } from "@/lib/users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const user = await getUser(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, user: { email: user.email, name: user.name, role: user.role } });
    res.cookies.set("pb_user", user.email, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
