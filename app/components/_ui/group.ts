import type { SidebarGroup } from "./Sidebar";

/** Groups entries by category, in the given category order. */
export function groupByCategory<T extends { slug: string; name: string; category: string }>(entries: T[], order: string[]): SidebarGroup[] {
  return order
    .map((category) => ({
      category,
      items: entries.filter((e) => e.category === category).map((e) => ({ slug: e.slug, name: e.name })),
    }))
    .filter((g) => g.items.length > 0);
}
