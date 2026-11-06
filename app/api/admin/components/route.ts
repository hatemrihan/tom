import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";
import { getOverrides, getResolvedRegistry, isKnownSlug, resetOverride, saveOverride } from "@/lib/component-settings";
import { isAdminDatabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

function refresh(slug?: string) {
  revalidatePath("/components");
  if (slug) revalidatePath(`/components/${slug}`);
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  const [entries, overrides] = await Promise.all([getResolvedRegistry({ includeHidden: true }), getOverrides()]);
  return NextResponse.json({
    databaseConfigured: isAdminDatabaseConfigured(),
    components: entries.map((e) => ({
      slug: e.slug,
      name: e.name,
      description: e.description,
      category: e.category,
      hidden: e.hidden,
      featured: e.featured,
      order: e.order,
      customized: Boolean(overrides[e.slug]),
    })),
  });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const slug = typeof body.slug === "string" ? body.slug : "";
    if (!isKnownSlug(slug)) return NextResponse.json({ error: "Unknown component" }, { status: 400 });

    const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);
    await saveOverride({
      slug,
      name: text(body.name, 60),
      description: text(body.description, 240),
      hidden: typeof body.hidden === "boolean" ? body.hidden : undefined,
      featured: typeof body.featured === "boolean" ? body.featured : undefined,
      order: typeof body.order === "number" && Number.isFinite(body.order) ? body.order : undefined,
    });
    refresh(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Save failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const { slug } = (await request.json()) as { slug?: string };
    if (!slug || !isKnownSlug(slug)) return NextResponse.json({ error: "Unknown component" }, { status: 400 });
    await resetOverride(slug);
    refresh(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Reset failed" }, { status: 500 });
  }
}
