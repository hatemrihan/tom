import "server-only";
import { registry, type RegistryEntry } from "@/components/library/registry";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";

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

const COLLECTION = "component_settings";

export async function getOverrides(): Promise<Record<string, ComponentOverride>> {
  if (!isDatabaseConfigured()) return {};
  try {
    const { db } = await connectToDatabase();
    const rows = await db.collection<ComponentOverride>(COLLECTION).find({}, { projection: { _id: 0 } }).toArray();
    return Object.fromEntries(rows.map((r) => [r.slug, r]));
  } catch (error) {
    console.error("[component-settings] falling back to defaults:", error instanceof Error ? error.message : error);
    return {};
  }
}

export async function saveOverride(override: ComponentOverride) {
  const { db } = await connectToDatabase();
  const { slug, ...rest } = override;
  const fields = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
  await db.collection(COLLECTION).updateOne({ slug }, { $set: { ...fields, slug, updatedAt: new Date() } }, { upsert: true });
}

export async function resetOverride(slug: string) {
  const { db } = await connectToDatabase();
  await db.collection(COLLECTION).deleteOne({ slug });
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
