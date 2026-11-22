import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/users";

function adminToken() {
  return process.env.ADMIN_PASSWORD || "pawberry-admin";
}

export async function GET(req: NextRequest) {
  const email = req.cookies.get("pb_user")?.value;
  if (!email) return NextResponse.json({ user: null, isAdmin: false });
  const user = await getUser(email);
  const adminCookie = req.cookies.get("pb_admin")?.value;
  const isAdmin = adminCookie === adminToken() || user?.role === "admin";
  if (!user) return NextResponse.json({ user: null, isAdmin });
  return NextResponse.json({ user: { email: user.email, name: user.name, role: user.role }, isAdmin });
}
