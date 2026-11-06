"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ToolbarItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export interface VerticalToolbarProps {
  items: ToolbarItem[];
  /** Side the tooltip appears on. */
  side?: "right" | "left";
  className?: string;
}

/**
 * A slim vertical pill of icon buttons. A single tooltip slides between items
 * instead of popping in and out — it feels like one object following you.
 */
export function VerticalToolbar({ items, side = "right", className }: VerticalToolbarProps) {
  const [hover, setHover] = useState<number | null>(null);
  const SIZE = 36;

  return (
    <div className={cn("relative inline-flex", className)} onMouseLeave={() => setHover(null)}>
      <div className="flex flex-col gap-1 rounded-full bg-neutral-950 p-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] dark:bg-neutral-100">
        {items.map((item, i) => (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            onClick={item.onClick}
            className="flex items-center justify-center rounded-full text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 dark:text-neutral-600 dark:hover:bg-black/5 dark:hover:text-neutral-900"
            style={{ width: SIZE, height: SIZE }}
          >
            <span className="size-[18px] [&>svg]:size-full">{item.icon}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {hover !== null && (
          <motion.span
            role="tooltip"
            className={cn(
              "pointer-events-none absolute whitespace-nowrap rounded-lg bg-neutral-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900",
              side === "right" ? "left-full ml-2" : "right-full mr-2"
            )}
            initial={{ opacity: 0, x: side === "right" ? -6 : 6, y: 4 + hover * (SIZE + 4) }}
            animate={{ opacity: 1, x: 0, y: 4 + hover * (SIZE + 4) }}
            exit={{ opacity: 0, x: side === "right" ? -6 : 6 }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            style={{ top: 0 }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={hover} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="block">
                {items[hover]?.label}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
