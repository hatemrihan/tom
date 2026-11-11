import { NextResponse } from "next/server";
import { registry } from "@/components/library/registry";

export const revalidate = 300;

/** The public list of components: what exists, and in which editions. */
export function GET() {
  return NextResponse.json({
    components: registry.map((e) => ({
      slug: e.slug,
      name: e.name,
      description: e.description,
      category: e.category,
      flutter: Boolean(e.flutter),
    })),
  });
}
