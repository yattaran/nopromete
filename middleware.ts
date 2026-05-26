import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

function unauthorizedResponse() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="NoPromete Admin", charset="UTF-8"',
    },
  });
}

function passesBasicAuth(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASSWORD;

  // If not configured, don't gate (useful for local/dev).
  if (!user || !pass) return true;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  const b64 = header.slice("Basic ".length).trim();
  let decoded = "";
  try {
    decoded = Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return false;
  }

  const idx = decoded.indexOf(":");
  if (idx < 0) return false;
  const u = decoded.slice(0, idx);
  const p = decoded.slice(idx + 1);
  return u === user && p === pass;
}

export default auth((request) => {
  const { pathname } = request.nextUrl;

  const isAdmin = pathname.startsWith("/admin");
  const isCron = pathname.startsWith("/api/cron");
  const isPublishApi = pathname.startsWith("/api/publish");

  if (isAdmin || isCron || isPublishApi) {
    if (!passesBasicAuth(request)) return unauthorizedResponse();
  }

  // Let NextAuth's `authorized` callback handle session gating for /admin.
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/cron/:path*", "/api/publish/:path*"],
};
