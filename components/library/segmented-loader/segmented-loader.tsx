"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface SegmentedLoaderProps {
  /** 0–100. Leave undefined to run an automatic demo loop. */
  value?: number;
  segments?: number;
  label?: string;
  className?: string;
}

/**
 * A little system-window style loader: chunky blocks fill one by one with a
 * pop, alongside a live percentage.
 */
export function SegmentedLoader({ value, segments = 10, label = "Loader", className }: SegmentedLoaderProps) {
  const [auto, setAuto] = useState(0);
  const pct = value ?? auto;
  const filled = Math.round((pct / 100) * segments);

  useEffect(() => {
    if (value !== undefined) return;
    const t = setInterval(() => setAuto((a) => (a >= 100 ? 0 : Math.min(100, a + 3 + Math.random() * 9))), 260);
    return () => clearInterval(t);
  }, [value]);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("w-72 rounded-xl border border-neutral-200 bg-white p-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.2)] dark:border-neutral-800 dark:bg-neutral-900", className)}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500">{label}</span>
        <span className="flex gap-1">
          <span className="size-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <span className="size-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.span
            key={i}
            className="h-5 flex-1 rounded-[4px]"
            initial={false}
            animate={
              i < filled
                ? { backgroundColor: "rgb(64 64 64)", scale: [0.7, 1.12, 1] }
                : { backgroundColor: "rgb(229 229 229)", scale: 1 }
            }
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <p className="mt-2 text-right font-mono text-xs tabular-nums text-neutral-600 dark:text-neutral-400">{Math.round(pct)}%</p>
    </div>
  );
}
