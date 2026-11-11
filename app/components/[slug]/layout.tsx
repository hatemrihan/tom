import { CATEGORIES, registry } from "@/components/library/registry";
import { getResolvedRegistry } from "@/lib/component-settings";
import { Sidebar } from "../_ui/Sidebar";
import { groupByCategory } from "../_ui/group";

export function generateStaticParams() {
  return registry.map((e) => ({ slug: e.slug }));
}

export default async function ComponentLayout({ children }: { children: React.ReactNode }) {
  const groups = groupByCategory(await getResolvedRegistry(), CATEGORIES);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] gap-10 px-4 sm:px-6">
      <aside className="sticky top-[72px] hidden h-[calc(100dvh-72px)] w-[170px] shrink-0 overflow-y-auto pb-10 pt-8 [scrollbar-width:thin] lg:block">
        <Sidebar groups={groups} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
