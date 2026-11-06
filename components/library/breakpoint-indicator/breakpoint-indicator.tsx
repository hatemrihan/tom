"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface BreakpointIndicatorProps {
  /** Only render in development (default true). */
  devOnly?: boolean;
  /** Tailwind's default breakpoints; override if you customised them. */
  breakpoints?: Record<string, number>;
  /** Position on screen. Use "static" to place it yourself. */
  position?: "bottom-left" | "bottom-right" | "static";
  className?: string;
}

const DEFAULTS = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

/**
 * A tiny dev helper pinned to a corner: shows the active Tailwind breakpoint
 * and the exact viewport width, animating as you resize. Hidden in production.
 */
export function BreakpointIndicator({ devOnly = true, breakpoints = DEFAULTS, position = "bottom-left", className }: BreakpointIndicatorProps) {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (devOnly && process.env.NODE_ENV === "production") return null;
  if (width === null) return null;

  const active = Object.entries(breakpoints)
    .sort((a, b) => a[1] - b[1])
    .reduce((acc, [name, min]) => (width >= min ? name : acc), "base");

  return (
    <div
      className={cn(
        "z-[9999] flex items-center gap-2 rounded-full bg-neutral-950 py-1 pl-1 pr-3 font-mono text-[11px] text-white shadow-lg",
        position === "bottom-left" && "fixed bottom-3 left-3",
        position === "bottom-right" && "fixed bottom-3 right-3",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={active}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          className="rounded-full bg-white px-2 py-0.5 font-semibold text-neutral-950"
        >
          {active}
        </motion.span>
      </AnimatePresence>
      <span className="tabular-nums text-white/70">{width}px</span>
    </div>
  );
}
