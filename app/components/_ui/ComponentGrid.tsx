"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Search } from "lucide-react";
import { PreviewFrame } from "./PreviewFrame";
import { cn } from "@/lib/utils";

export interface GridEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
  added: string;
}

/** The framed card used across the docs (outer frame + inner cards). */
export function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[22px] border border-neutral-200/80 bg-neutral-100/40 p-2 dark:border-neutral-800/80 dark:bg-neutral-900/30", className)}>
      {children}
    </div>
  );
}

export function ComponentCard({ entry }: { entry: GridEntry }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)] dark:border-neutral-800 dark:bg-neutral-950">
      <PreviewFrame slug={entry.slug} height={210} replay={false} compact />
      <Link href={`/components/${entry.slug}`} className="flex flex-1 flex-col gap-1 rounded-xl px-3 pb-3 pt-4 outline-none focus-visible:ring-2 focus-visible:ring-neutral-300">
        <span className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-medium tracking-tight">{entry.name}</span>
          <ArrowUpRight className="size-4 shrink-0 text-neutral-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:text-neutral-600 dark:group-hover:text-white" />
        </span>
        <span className="text-sm leading-relaxed text-neutral-500">{entry.description}</span>
      </Link>
    </article>
  );
}

export function ComponentGrid({ entries, categories }: { entries: GridEntry[]; categories: string[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (category === "All" || e.category === category) &&
        (!q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
    );
  }, [entries, category, query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: entries.length };
    for (const e of entries) map[e.category] = (map[e.category] ?? 0) + 1;
    return map;
  }, [entries]);

  const tabs = ["All", ...categories.filter((c) => counts[c])];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setCategory(t)}
              className={cn(
                "relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs transition-colors",
                category === t ? "text-white dark:text-neutral-900" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              {category === t && (
                <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white" transition={{ type: "spring", bounce: 0.15, duration: 0.4 }} />
              )}
              <span className="relative">{t}</span>
              <span className={cn("relative tabular-nums", category === t ? "opacity-60" : "text-neutral-400")}>{counts[t]}</span>
            </button>
          ))}
        </div>
        <label className="relative block md:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components"
            aria-label="Search components"
            className="h-9 w-full rounded-full border border-neutral-200 bg-white pl-8 pr-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-neutral-700"
          />
        </label>
      </div>

      <Frame>
        <motion.div layout className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((e) => (
              <motion.div
                key={e.slug}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <ComponentCard entry={e} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {visible.length === 0 && <p className="py-16 text-center text-sm text-neutral-500">No components match “{query}”.</p>}
      </Frame>
    </div>
  );
}
