"use client";

import type { RefObject } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useState } from "react";
import { cn } from "../_lib/cn";

export interface ScrollProgressProps {
  /** Scroll container (defaults to the window). */
  container?: RefObject<HTMLElement | null>;
  variant?: "ring" | "bar";
  /** Ring diameter in px. */
  size?: number;
  className?: string;
}

/**
 * Reading progress as a springy ring (with a live percentage that turns into
 * a "back to top" arrow at the end) or as a thin bar.
 */
export function ScrollProgress({ container, variant = "ring", size = 48, className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll({ container });
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(Math.round(v * 100)));

  const stroke = 3;
  const r = (size - stroke) / 2;
  const dash = useTransform(p, (v) => `${v * 2 * Math.PI * r} ${2 * Math.PI * r}`);
  const done = pct >= 98;

  const toTop = () => (container?.current ?? window).scrollTo({ top: 0, behavior: "smooth" });

  if (variant === "bar") {
    return <motion.div aria-hidden className={cn("h-1 origin-left rounded-full bg-neutral-900 dark:bg-white", className)} style={{ scaleX: p }} />;
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={done ? "Back to top" : `${pct}% read`}
      className={cn("relative flex items-center justify-center rounded-full bg-white shadow-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-neutral-900", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-neutral-200 dark:stroke-neutral-800" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" className="stroke-neutral-900 dark:stroke-white" style={{ strokeDasharray: dash }} />
      </svg>
      <motion.span key={done ? "up" : "pct"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="relative text-[11px] font-medium tabular-nums text-neutral-900 dark:text-white">
        {done ? "↑" : `${pct}`}
      </motion.span>
    </button>
  );
}
