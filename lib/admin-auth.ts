import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "tom_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string | null {
  const key = process.env.ADMIN_SECRET_KEY;
  return key && key.length > 0 ? key : null;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Checks a raw admin key typed by the user. */
export function verifyAdminKey(candidate: string): boolean {
  const secret = getSecret();
  if (!secret || !candidate) return false;
  return safeEqual(candidate, secret);
}

/** Creates a signed, expiring session token. */
export function createSessionToken(now = Date.now()): string {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SECRET_KEY is not configured");
  const expires = String(now + SESSION_TTL_MS);
  return `${expires}.${sign(`admin:${expires}`, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(`admin:${expires}`, secret));
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};

/** True when the request carries a valid session cookie or Bearer key. */
export function isAdminRequest(request: NextRequest): boolean {
  if (verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value)) return true;
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return verifyAdminKey(header.slice("Bearer ".length));
  }
  return false;
}

/** For server components: is the current visitor signed in as admin? */
export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/* -------------------------------------------------------------------------- */
/* Tiny in-memory rate limiter (per server instance).                          */
/* Good enough to stop casual brute force / spam on a portfolio.              */
/* -------------------------------------------------------------------------- */

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
    }
    return { ok: true, retryAfter: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
