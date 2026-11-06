"use client";

import type { ReactNode, RefObject } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ScrollRevealGridProps {
  items: ReactNode[];
  columns?: 2 | 3 | 4;
  /** Scroll container used as the viewport (defaults to the window). */
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * A grid whose cards rise, un-blur and settle as they scroll into view —
 * staggered by column so each row ripples in left to right.
 */
export function ScrollRevealGrid({ items, columns = 3, container, className }: ScrollRevealGridProps) {
  const cols = { 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[columns];
  return (
    <div className={cn("grid gap-3", cols, className)}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 48, scale: 0.94, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3, root: container }}
          transition={{ type: "spring", stiffness: 140, damping: 20, delay: (i % columns) * 0.08 }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}
