"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SidebarGroup {
  category: string;
  items: { slug: string; name: string }[];
}

/**
 * The component index: categories with their components beneath.
 * With `onSelect` it works as a picker; without, each item links to its page.
 */
export function Sidebar({
  groups,
  active,
  onSelect,
  className,
}: {
  groups: SidebarGroup[];
  active?: string;
  onSelect?: (slug: string) => void;
  className?: string;
}) {
  const pathname = usePathname();
  const id = useId();
  const current = active ?? pathname.split("/components/")[1];

  return (
    <nav aria-label="Components" className={className}>
      {groups.map((group) => (
        <div key={group.category} className="mb-5 last:mb-0">
          <p className="mb-1 text-neutral-900 dark:text-white">{group.category}</p>
          <ul>
            {group.items.map((item) => {
              const on = item.slug === current;
              const row = cn(
                "relative flex h-[22px] w-full items-center text-left uppercase outline-none transition-[color,padding] duration-200 focus-visible:underline",
                on ? "pl-3 text-neutral-900 dark:text-white" : "text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white"
              );
              const inner = (
                <>
                  {on && (
                    <motion.span
                      layoutId={`side-${id}`}
                      className="absolute left-0 size-1 rounded-full bg-current"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="truncate">{item.name}</span>
                </>
              );
              return (
                <li key={item.slug}>
                  {onSelect ? (
                    <button type="button" aria-pressed={on} onClick={() => onSelect(item.slug)} className={row}>
                      {inner}
                    </button>
                  ) : (
                    <Link href={`/components/${item.slug}`} scroll={false} aria-current={on ? "page" : undefined} className={row}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
