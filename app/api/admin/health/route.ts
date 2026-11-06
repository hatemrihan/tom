import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { adminClient, isAdminDatabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Admin-only database health check. */
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY is not set" });
  }

  const started = Date.now();
  const { count, error } = await adminClient()
    .from("contacts")
    .select("id", { count: "exact", head: true });

  if (error) return NextResponse.json({ ok: false, error: error.message });
  return NextResponse.json({ ok: true, contacts: count ?? 0, latencyMs: Date.now() - started });
}
