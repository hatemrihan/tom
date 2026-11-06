import "server-only";
import { registry, type RegistryEntry } from "@/components/library/registry";
import { adminClient, isDatabaseConfigured, publicClient } from "@/lib/supabase/server";

/** Fields the admin can override per component. */
export interface ComponentOverride {
  slug: string;
  name?: string;
  description?: string;
  hidden?: boolean;
  featured?: boolean;
  order?: number;
}

export type ResolvedEntry = RegistryEntry & {
  hidden: boolean;
  featured: boolean;
  order: number;
};

const TABLE = "component_settings";

interface SettingsRow {
  slug: string;
  name: string | null;
  description: string | null;
  hidden: boolean | null;
  featured: boolean | null;
  sort_order: number | null;
}

/** Public read (RLS allows select for the publishable key). */
export async function getOverrides(): Promise<Record<string, ComponentOverride>> {
  if (!isDatabaseConfigured()) return {};
  try {
    const { data, error } = await publicClient()
      .from(TABLE)
      .select("slug,name,description,hidden,featured,sort_order");
    if (error) throw new Error(error.message);
    return Object.fromEntries(
      (data as SettingsRow[]).map((r) => [
        r.slug,
        {
          slug: r.slug,
          name: r.name ?? undefined,
          description: r.description ?? undefined,
          hidden: r.hidden ?? undefined,
          featured: r.featured ?? undefined,
          order: r.sort_order ?? undefined,
        },
      ])
    );
  } catch (error) {
    console.error("[component-settings] falling back to defaults:", error instanceof Error ? error.message : error);
    return {};
  }
}

/** Merge the given fields into the slug's override (undefined fields are left as they are). */
export async function saveOverride({ slug, name, description, hidden, featured, order }: ComponentOverride) {
  const fields = Object.fromEntries(
    Object.entries({ name, description, hidden, featured, sort_order: order }).filter(([, v]) => v !== undefined)
  );
  const { error } = await adminClient()
    .from(TABLE)
    .upsert({ ...fields, slug, updated_at: new Date().toISOString() }, { onConflict: "slug" });
  if (error) throw new Error(error.message);
}

export async function resetOverride(slug: string) {
  const { error } = await adminClient().from(TABLE).delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

/** Registry merged with admin overrides, sorted. `includeHidden` for admin. */
export async function getResolvedRegistry({ includeHidden = false } = {}): Promise<ResolvedEntry[]> {
  const overrides = await getOverrides();
  const featuredDefault = new Set(["hold-to-confirm", "receipt-printer", "liquid-glass-logo"]);

  return registry
    .map((entry, index): ResolvedEntry => {
      const o = overrides[entry.slug];
      return {
        ...entry,
        name: o?.name?.trim() || entry.name,
        description: o?.description?.trim() || entry.description,
        hidden: o?.hidden ?? false,
        featured: o?.featured ?? featuredDefault.has(entry.slug),
        order: o?.order ?? index,
      };
    })
    .filter((e) => includeHidden || !e.hidden)
    .sort((a, b) => a.order - b.order);
}

export function isKnownSlug(slug: string) {
  return registry.some((e) => e.slug === slug);
}
