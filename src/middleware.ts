import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function token() {
  return process.env.ADMIN_PASSWORD || "pawberry-admin";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (isLogin) return NextResponse.next();
  const cookie = req.cookies.get("pb_admin")?.value;
  if (cookie === token()) return NextResponse.next();
  if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
