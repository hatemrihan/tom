"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface LogoTraceLoaderProps {
  /** SVG path of the logo outline. Defaults to a "T" monogram. */
  path?: string;
  viewBox?: string;
  /** When true, the trace completes and the logo fills in. */
  done?: boolean;
  /** Seconds per lap of the tracing segment. */
  speed?: number;
  label?: string;
  className?: string;
}

const T_MARK =
  "M12 10 H 88 A 4 4 0 0 1 92 14 V 30 A 4 4 0 0 1 88 34 H 62 V 86 A 4 4 0 0 1 58 90 H 42 A 4 4 0 0 1 38 86 V 34 H 12 A 4 4 0 0 1 8 30 V 14 A 4 4 0 0 1 12 10 Z";

/**
 * A loader that traces your logo's outline with a glowing comet, then fills
 * the mark once `done` flips to true. Uses `pathLength` so any path works.
 */
export function LogoTraceLoader({
  path = T_MARK,
  viewBox = "0 0 100 100",
  done = false,
  speed = 1.6,
  label = "Loading",
  className,
}: LogoTraceLoaderProps) {
  const gradId = useId();

  return (
    <div role="status" aria-live="polite" className={cn("relative size-24 text-neutral-900 dark:text-white", className)}>
      <span className="sr-only">{done ? "Loaded" : label}</span>
      <svg viewBox={viewBox} className="size-full overflow-visible" fill="none" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" />
          </linearGradient>
        </defs>

        {/* Faint guide */}
        <path d={path} stroke="currentColor" strokeOpacity={0.12} strokeWidth={2} pathLength={1} />

        <AnimatePresence>
          {!done && (
            <motion.path
              key="comet"
              d={path}
              stroke={`url(#${gradId})`}
              strokeWidth={2.5}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.22 0.78"
              initial={{ strokeDashoffset: 0, opacity: 1 }}
              animate={{ strokeDashoffset: -1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: speed, ease: "linear", repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        {done && (
          <>
            <motion.path
              d={path}
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.path
              d={path}
              fill="currentColor"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: "center", transformBox: "fill-box" }}
              transition={{ delay: 0.45, type: "spring", stiffness: 260, damping: 18 }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
