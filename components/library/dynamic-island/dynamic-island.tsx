"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface IslandView {
  /** Unique key — changing it morphs the island. */
  key: string;
  content: ReactNode;
  /** Target size of this view. */
  width: number;
  height: number;
  radius?: number;
}

export interface DynamicIslandProps {
  view: IslandView;
  className?: string;
}

/**
 * A small pill that springs between sizes as its content changes, with the
 * old content blurring out and the new content blurring in. Use it for the
 * small things an app says: saved, copied, publishing, live.
 */
export function DynamicIsland({ view, className }: DynamicIslandProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: view.width, height: view.height, borderRadius: view.radius ?? Math.min(view.height / 2, 32) }}
      transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
      className={cn(
        "relative mx-auto overflow-hidden border border-neutral-200 bg-white text-neutral-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={view.key}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { delay: 0.08, duration: 0.35 } }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)", transition: { duration: 0.2 } }}
          className="absolute inset-0"
          style={{ width: view.width, height: view.height }}
        >
          {view.content}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- Ready-made views you can use as-is or as examples ---------- */

const label = "text-[11px] font-medium uppercase leading-[1.3] tracking-[0.01em]";

export const islandViews = {
  /** Resting: a short pill with a faint rule. */
  idle: (): IslandView => ({
    key: "idle",
    width: 96,
    height: 30,
    content: (
      <div className="flex h-full items-center justify-center">
        <span className="h-px w-5 bg-current opacity-30" />
      </div>
    ),
  }),
  /** One line: "Saved", "Copied to clipboard". */
  status: (text: string): IslandView => ({
    key: `status-${text}`,
    width: Math.max(140, text.length * 7.4 + 40),
    height: 34,
    content: (
      <div className={cn(label, "flex h-full items-center justify-center whitespace-nowrap")}>
        {text}
      </div>
    ),
  }),
  /** A label, a percentage and a thin bar. `value` runs from 0 to 1. */
  progress: (text: string, value: number): IslandView => ({
    key: `progress-${text}`,
    width: 240,
    height: 46,
    content: (
      <div className={cn(label, "flex h-full flex-col justify-center gap-2 px-5")}>
        <div className="flex justify-between">
          <span>{text}</span>
          <span className="font-normal tabular-nums opacity-50">{Math.round(value * 100)}%</span>
        </div>
        <div className="h-px bg-current/15">
          <motion.div className="h-full origin-left bg-current" initial={{ scaleX: 0 }} animate={{ scaleX: value }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </div>
    ),
  }),
  /** Two lines: a headline and a quieter detail. */
  notice: (title: string, detail: string): IslandView => ({
    key: `notice-${title}`,
    width: 280,
    height: 60,
    radius: 22,
    content: (
      <div className={cn(label, "flex h-full flex-col justify-center px-5")}>
        <span>{title}</span>
        <span className="font-normal opacity-50">{detail}</span>
      </div>
    ),
  }),
};
