import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/** Admin-only database health check (replaces the old public /api/test-db). */
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "MONGODB_URI is not set" });
  }

  const started = Date.now();
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    return NextResponse.json({
      ok: true,
      database: db.databaseName,
      latencyMs: Date.now() - started,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
