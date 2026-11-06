"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ExpandableTab {
  label: string;
  icon: ReactNode;
}

export interface ExpandableTabsProps {
  tabs: (ExpandableTab | "separator")[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

/**
 * An icon-only tab bar where the selected tab grows to reveal its label.
 * Siblings slide over to make room — no layout jump.
 */
export function ExpandableTabs({ tabs, defaultIndex = 0, onChange, className }: ExpandableTabsProps) {
  const [selected, setSelected] = useState(defaultIndex);

  return (
    <div role="tablist" className={cn("inline-flex items-center gap-1 rounded-2xl border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900", className)}>
      {tabs.map((tab, i) =>
        tab === "separator" ? (
          <span key={`sep-${i}`} aria-hidden className="mx-1 h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
        ) : (
          <motion.button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={selected === i}
            aria-label={tab.label}
            layout
            onClick={() => {
              setSelected(i);
              onChange?.(i);
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={cn(
              "relative flex h-9 items-center rounded-xl px-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neutral-300",
              selected === i ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:hover:bg-neutral-800/60 dark:hover:text-white"
            )}
          >
            <motion.span layout className="size-[18px] shrink-0 [&>svg]:size-full">{tab.icon}</motion.span>
            <AnimatePresence initial={false}>
              {selected === i && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="pl-2">{tab.label}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      )}
    </div>
  );
}
