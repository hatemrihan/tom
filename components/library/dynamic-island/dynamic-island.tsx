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
 * A black pill that springs between sizes as its content changes, with the
 * old content blurring out and the new content blurring in.
 */
export function DynamicIsland({ view, className }: DynamicIslandProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: view.width, height: view.height, borderRadius: view.radius ?? Math.min(view.height / 2, 32) }}
      transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
      className={cn(
        "relative mx-auto overflow-hidden bg-black text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]",
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

export const islandViews = {
  idle: (): IslandView => ({
    key: "idle",
    width: 120,
    height: 34,
    content: <div className="flex h-full items-center justify-end px-3"><span className="size-2 rounded-full bg-neutral-800" /></div>,
  }),
  ring: (name: string): IslandView => ({
    key: "ring",
    width: 280,
    height: 60,
    content: (
      <div className="flex h-full items-center gap-3 px-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-neutral-700 text-sm">{name[0]}</span>
        <div className="flex-1 leading-tight">
          <p className="text-[11px] text-white/50">Incoming call</p>
          <p className="text-sm font-medium">{name}</p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full bg-red-500">✕</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-green-500">✆</span>
      </div>
    ),
  }),
  timer: (time: string): IslandView => ({
    key: "timer",
    width: 180,
    height: 40,
    content: (
      <div className="flex h-full items-center justify-between px-4">
        <span className="text-orange-400">◷</span>
        <span className="font-mono text-sm tabular-nums text-orange-400">{time}</span>
      </div>
    ),
  }),
  music: (title: string, artist: string): IslandView => ({
    key: "music",
    width: 320,
    height: 84,
    radius: 32,
    content: (
      <div className="flex h-full items-center gap-3 px-4">
        <span className="size-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-orange-400" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="truncate text-xs text-white/50">{artist}</p>
        </div>
        <div className="flex h-6 items-end gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-fuchsia-400"
              animate={{ height: [6, 22, 10, 18, 6] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    ),
  }),
};
