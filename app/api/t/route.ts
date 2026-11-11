import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { registry } from "@/components/library/registry";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { adminClient, isAdminDatabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Anonymous usage events from the site and the command-line tools.
 * What is and is not stored is described on /telemetry. In short: no names,
 * emails, IP addresses, file paths or code.
 */

const KINDS = new Set(["view", "copy", "switch", "cli_add", "cli_list"]);
const SOURCES = new Set(["site", "npm", "pub"]);
const SLUGS = new Set(registry.map((e) => e.slug));
const BOT = /bot|crawl|spider|slurp|preview|monitor|lighthouse|headless|curl|wget|python-requests/i;

const done = () => new NextResponse(null, { status: 204 });
const text = (value: unknown, max: number) => (typeof value === "string" && value.length > 0 ? value.slice(0, max) : null);

/** A component name from either tool: `hold-to-confirm` or `hold_to_confirm`. */
function slug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.replace(/_/g, "-").toLowerCase();
  return SLUGS.has(s) ? s : null;
}

/** The site an outside visitor came from, without the path. */
function referrerHost(value: unknown, own: string | null): string | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const host = new URL(value).hostname.replace(/^www\./, "");
    return host && host !== own?.replace(/^www\./, "").split(":")[0] ? host.slice(0, 120) : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  // Always answer the same way, so nothing can be learned by probing and no tool ever fails because of this.
  if (!isAdminDatabaseConfigured()) return done();
  const ip = clientIp(request);
  if (!rateLimit(`t:${ip}`, 120, 60 * 1000).ok) return done();

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 4000) return done();
    body = JSON.parse(raw);
  } catch {
    return done();
  }

  const kind = text(body.kind, 16);
  const source = text(body.source, 8);
  if (!kind || !source || !KINDS.has(kind) || !SOURCES.has(source)) return done();

  const agent = request.headers.get("user-agent") ?? "";
  const site = source === "site";
  if (site && (kind.startsWith("cli") || BOT.test(agent) || !agent)) return done();
  if (!site && !kind.startsWith("cli")) return done();

  // Site visitors get a hash that changes every day, so a person can be counted once a day
  // without a cookie and without keeping their address. Tools send a random id of their own.
  const day = new Date().toISOString().slice(0, 10);
  const visitor = site
    ? createHash("sha256").update(`${day}|${ip}|${agent}|${process.env.SUPABASE_SECRET_KEY}`).digest("hex").slice(0, 32)
    : typeof body.id === "string" && /^[a-f0-9-]{8,64}$/.test(body.id)
      ? body.id
      : null;

  const edition = body.edition === "react" || body.edition === "flutter" ? body.edition : source === "pub" ? "flutter" : source === "npm" ? "react" : null;
  const path = typeof body.path === "string" && body.path.startsWith("/") ? body.path.split(/[?#]/)[0].slice(0, 160) : null;

  const base = {
    kind,
    source,
    edition,
    visitor,
    detail: kind === "view" ? path : text(body.detail, 160),
    country: text(request.headers.get("x-vercel-ip-country"), 2),
    referrer: site ? referrerHost(body.referrer, request.headers.get("host")) : null,
    version: site ? null : text(body.version, 24),
    os: site ? null : text(body.os, 24),
    runtime: site ? null : text(body.runtime, 32),
    manager: site ? null : text(body.manager, 12),
    ci: site ? null : body.ci === true,
  };

  // A tool may add several components in one go: one row each.
  const many = Array.isArray(body.components) ? body.components.map(slug).filter(Boolean).slice(0, 30) : [];
  const rows = many.length > 0 ? many.map((component) => ({ ...base, component })) : [{ ...base, component: slug(body.component) }];

  try {
    const { error } = await adminClient().from("events").insert(rows);
    if (error) console.error("[events]", error.message);
  } catch (error) {
    console.error("[events]", error instanceof Error ? error.message : error);
  }
  return done();
}
