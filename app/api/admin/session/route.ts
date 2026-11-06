import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  clientIp,
  createSessionToken,
  isAdminRequest,
  rateLimit,
  sessionCookieOptions,
  verifyAdminKey,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** GET — is the current browser signed in? */
export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isAdminRequest(request) });
}

/** POST — sign in with the admin key, receive an httpOnly session cookie. */
export async function POST(request: NextRequest) {
  const limit = rateLimit(`login:${clientIp(request)}`, 8, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  if (!process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json(
      { error: "ADMIN_SECRET_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let key = "";
  try {
    const body = (await request.json()) as { key?: unknown };
    key = typeof body.key === "string" ? body.key : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!verifyAdminKey(key)) {
    return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions);
  return response;
}

/** DELETE — sign out. */
export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
