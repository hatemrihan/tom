import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  CONTACT_STATUSES,
  toContactRecord,
  type ContactRow,
  type ContactStatus,
} from "@/lib/contact";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const serverError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Internal server error";
  console.error("[admin/contacts]", message);
  return NextResponse.json({ error: message }, { status: 500 });
};

const isStatus = (value: unknown): value is ContactStatus =>
  typeof value === "string" && (CONTACT_STATUSES as readonly string[]).includes(value);

function parseIds(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [value];
  return list.filter((id): id is string => typeof id === "string" && UUID_RE.test(id)).slice(0, 500);
}

/** Make a search term safe inside a PostgREST `or=(…ilike…)` filter. */
function toIlikePattern(q: string) {
  const cleaned = q
    .slice(0, 100)
    .replace(/[,()"\\]/g, " ")
    .replace(/[%_]/g, (m) => `\\${m}`)
    .trim();
  return cleaned ? `%${cleaned}%` : null;
}

/** GET — list contacts + dashboard stats. */
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const db = adminClient();
    const params = request.nextUrl.searchParams;
    const limit = Math.min(Math.max(Number(params.get("limit")) || 200, 1), 500);
    const status = params.get("status");
    const pattern = toIlikePattern(params.get("q") ?? "");

    let list = db
      .from("contacts")
      .select("id,name,email,phone,company_name,project_type,message,status,source,submitted_at,updated_at")
      .order("submitted_at", { ascending: false })
      .limit(limit);
    if (isStatus(status)) list = list.eq("status", status);
    if (pattern) {
      list = list.or(
        ["name", "email", "company_name", "message"].map((col) => `${col}.ilike.${pattern}`).join(",")
      );
    }

    // Stats are computed from a light projection of every row — plenty for a
    // portfolio inbox. Swap for a Postgres view/RPC if this ever grows large.
    const [listRes, statsRes] = await Promise.all([
      list,
      db.from("contacts").select("status,project_type,submitted_at").limit(10_000),
    ]);
    if (listRes.error) throw new Error(listRes.error.message);
    if (statsRes.error) throw new Error(statsRes.error.message);

    const rows = statsRes.data as Pick<ContactRow, "status" | "project_type" | "submitted_at">[];

    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - 29);

    const statusCounts = Object.fromEntries(CONTACT_STATUSES.map((s) => [s, 0])) as Record<ContactStatus, number>;
    const typeCounts = new Map<string, number>();
    const dailyCounts = new Map<string, number>();

    for (const row of rows) {
      const s = isStatus(row.status) ? row.status : "unread";
      statusCounts[s] += 1;
      const type = row.project_type ?? "unknown";
      typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
      const day = new Date(row.submitted_at);
      if (day >= since) {
        const key = day.toISOString().slice(0, 10);
        dailyCounts.set(key, (dailyCounts.get(key) ?? 0) + 1);
      }
    }

    // Fill every one of the last 30 days, even empty ones, for the chart.
    const timeline = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      return { date: key, count: dailyCounts.get(key) ?? 0 };
    });

    return NextResponse.json({
      contacts: (listRes.data as ContactRow[]).map(toContactRecord),
      stats: {
        total: rows.length,
        status: statusCounts,
        projectTypes: [...typeCounts.entries()]
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count),
        timeline,
      },
    });
  } catch (error) {
    return serverError(error);
  }
}

/** PATCH — update one or many contacts' status. Body: { ids: string[] | contactId: string, status } */
export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const body = (await request.json()) as { contactId?: unknown; ids?: unknown; status?: unknown };
    const ids = parseIds(Array.isArray(body.ids) ? body.ids : body.contactId);
    if (ids.length === 0 || !isStatus(body.status)) {
      return NextResponse.json({ error: "Provide valid id(s) and status" }, { status: 400 });
    }

    const { data, error } = await adminClient()
      .from("contacts")
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .in("id", ids)
      .select("id");
    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, updated: data.length });
  } catch (error) {
    return serverError(error);
  }
}

/** DELETE — permanently delete contacts. Body: { ids: string[] } */
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const body = (await request.json()) as { ids?: unknown };
    const ids = parseIds(Array.isArray(body.ids) ? body.ids : []);
    if (ids.length === 0) {
      return NextResponse.json({ error: "Provide id(s) to delete" }, { status: 400 });
    }

    const { data, error } = await adminClient().from("contacts").delete().in("id", ids).select("id");
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true, deleted: data?.length ?? 0 });
  } catch (error) {
    return serverError(error);
  }
}
