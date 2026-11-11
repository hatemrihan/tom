"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { PreviewFrame } from "./PreviewFrame";
import { Sidebar, type SidebarGroup } from "./Sidebar";

export interface BrowserEntry {
  slug: string;
  name: string;
  description: string;
}

// The chosen component lives in sessionStorage, so coming back to this page
// (Back button, or a link) shows the one you had open.
const KEY = "tom-components-selected";
const listeners = new Set<() => void>();
const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => void listeners.delete(notify);
};
const read = () => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const write = (slug: string) => {
  try {
    sessionStorage.setItem(KEY, slug);
  } catch {}
  listeners.forEach((notify) => notify());
};

/** Pick a component on the left, try it on the right. */
export function Browser({ groups, entries }: { groups: SidebarGroup[]; entries: BrowserEntry[] }) {
  const slug = useSyncExternalStore(subscribe, read, () => null);
  const setSlug = write;
  const entry = entries.find((e) => e.slug === slug) ?? entries[0];
  if (!entry) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[170px_minmax(0,1fr)] lg:gap-10">
      {/* phones: a plain select keeps the list one tap away */}
      <select
        aria-label="Component"
        value={entry.slug}
        onChange={(e) => setSlug(e.target.value)}
        className="h-10 w-full rounded-lg border border-neutral-200 bg-transparent px-3 uppercase text-neutral-900 outline-none dark:border-neutral-800 dark:text-white lg:hidden"
      >
        {groups.map((g) => (
          <optgroup key={g.category} label={g.category}>
            {g.items.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <Sidebar groups={groups} active={entry.slug} onSelect={setSlug} className="hidden lg:block" />

      <div className="min-w-0 self-start lg:sticky lg:top-24">
        <PreviewFrame key={entry.slug} slug={entry.slug} height={480} />
        <div className="mt-3 flex items-start justify-between gap-6">
          <div>
            <p className="text-neutral-900 dark:text-white">{entry.name}</p>
            <p className="max-w-md font-normal text-neutral-500">{entry.description}</p>
          </div>
          <Link href={`/components/${entry.slug}`} className="shrink-0 text-neutral-900 underline-offset-4 hover:underline dark:text-white">
            Get the code ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
