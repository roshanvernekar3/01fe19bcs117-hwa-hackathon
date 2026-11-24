export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

function token() {
  return process.env.ADMIN_PASSWORD || "rewear-admin";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pw = token();
    if (String(body?.password || "") !== pw) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set("pb_admin", token(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
