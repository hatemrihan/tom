import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Filter, type Document } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";
import { isAdminRequest } from "@/lib/admin-auth";
import { CONTACT_STATUSES, type ContactStatus } from "@/lib/contact";

export const dynamic = "force-dynamic";

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const serverError = (error: unknown) => {
  console.error("[admin/contacts]", error instanceof Error ? error.message : error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Internal server error" },
    { status: 500 }
  );
};

function toObjectId(id: unknown): ObjectId | null {
  return typeof id === "string" && ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** GET — list contacts + dashboard stats. */
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const { db } = await connectToDatabase();
    const contacts = db.collection("contacts");
    const params = request.nextUrl.searchParams;

    const limit = Math.min(Math.max(Number(params.get("limit")) || 200, 1), 500);
    const status = params.get("status");
    const q = params.get("q")?.trim();

    const filter: Filter<Document> = {};
    if (status && (CONTACT_STATUSES as readonly string[]).includes(status)) {
      filter.status = status;
    }
    if (q) {
      const re = new RegExp(escapeRegex(q.slice(0, 100)), "i");
      filter.$or = [{ name: re }, { email: re }, { companyName: re }, { message: re }];
    }

    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - 29);

    const [items, total, byStatus, byType, daily] = await Promise.all([
      contacts.find(filter).sort({ submittedAt: -1 }).limit(limit).toArray(),
      contacts.countDocuments({}),
      contacts.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
      contacts
        .aggregate([{ $group: { _id: "$projectType", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
        .toArray(),
      contacts
        .aggregate([
          { $match: { submittedAt: { $gte: since } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
    ]);

    // Fill every one of the last 30 days, even empty ones, for the chart.
    const dailyMap = new Map(daily.map((d) => [d._id as string, d.count as number]));
    const timeline = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      return { date: key, count: dailyMap.get(key) ?? 0 };
    });

    const statusCounts = Object.fromEntries(
      CONTACT_STATUSES.map((s) => [s, 0])
    ) as Record<ContactStatus, number>;
    for (const row of byStatus) {
      const key = (row._id ?? "unread") as ContactStatus;
      if (key in statusCounts) statusCounts[key] += row.count as number;
    }

    return NextResponse.json({
      contacts: items.map((c) => ({
        ...c,
        _id: c._id.toString(),
        submittedAt: c.submittedAt instanceof Date ? c.submittedAt.toISOString() : c.submittedAt,
        updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
      })),
      stats: {
        total,
        status: statusCounts,
        projectTypes: byType.map((t) => ({ type: (t._id as string) ?? "unknown", count: t.count as number })),
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
    const body = (await request.json()) as {
      contactId?: unknown;
      ids?: unknown;
      status?: unknown;
    };
    const rawIds = Array.isArray(body.ids) ? body.ids : [body.contactId];
    const ids = rawIds.map(toObjectId).filter((id): id is ObjectId => id !== null);
    const status = body.status;

    if (ids.length === 0 || typeof status !== "string" || !(CONTACT_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: "Provide valid id(s) and status" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection("contacts")
      .updateMany({ _id: { $in: ids } }, { $set: { status, updatedAt: new Date() } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, updated: result.modifiedCount });
  } catch (error) {
    return serverError(error);
  }
}

/** DELETE — permanently delete contacts. Body: { ids: string[] } */
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  try {
    const body = (await request.json()) as { ids?: unknown };
    const ids = (Array.isArray(body.ids) ? body.ids : [])
      .map(toObjectId)
      .filter((id): id is ObjectId => id !== null);
    if (ids.length === 0) {
      return NextResponse.json({ error: "Provide id(s) to delete" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("contacts").deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    return serverError(error);
  }
}
