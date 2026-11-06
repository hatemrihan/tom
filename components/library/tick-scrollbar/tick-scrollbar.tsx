"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { cn } from "../_lib/cn";

export interface TickScrollbarProps {
  /** Scroll container to track (defaults to the window). */
  container?: RefObject<HTMLElement | null>;
  /** Number of ticks on the ruler. */
  ticks?: number;
  /** Optional labelled sections: element ids to jump to. */
  sections?: { id: string; label: string }[];
  className?: string;
}

/**
 * A ruler-style reading indicator. A red needle glides across a row of ticks
 * as you scroll; ticks near the needle grow. Click anywhere on the ruler to
 * jump there.
 */
export function TickScrollbar({ container, ticks = 32, sections, className }: TickScrollbarProps) {
  const { scrollYProgress } = useScroll({ container });
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 30 });
  const [p, setP] = useState(0);
  const ruler = useRef<HTMLDivElement>(null);
  useMotionValueEvent(smooth, "change", setP);

  const jump = (fraction: number) => {
    const el = container?.current ?? document.scrollingElement;
    if (!el) return;
    el.scrollTo({ top: fraction * (el.scrollHeight - el.clientHeight), behavior: "smooth" });
  };

  const currentSection = sections?.[Math.min(sections.length - 1, Math.floor(p * sections.length))];

  return (
    <div className={cn("flex items-center gap-3 rounded-xl bg-neutral-900/95 px-3 py-2.5 text-white shadow-lg backdrop-blur", className)}>
      {sections && <span className="w-24 truncate text-[11px] text-white/60">{currentSection?.label}</span>}
      <div
        ref={ruler}
        role="slider"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(p * 100)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") jump(Math.min(1, p + 0.1));
          if (e.key === "ArrowLeft") jump(Math.max(0, p - 0.1));
        }}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          jump((e.clientX - r.left) / r.width);
        }}
        className="relative flex h-5 cursor-pointer items-center justify-between outline-none"
        style={{ width: ticks * 6 }}
      >
        {Array.from({ length: ticks }).map((_, i) => {
          const t = i / (ticks - 1);
          const near = Math.max(0, 1 - Math.abs(t - p) * ticks * 0.35);
          return (
            <span
              key={i}
              className="w-px rounded-full bg-white"
              style={{ height: 6 + near * 10 + (i % 4 === 0 ? 3 : 0), opacity: 0.35 + near * 0.65 }}
            />
          );
        })}
        <motion.span className="absolute top-0 h-full w-[2px] rounded-full bg-red-500" style={{ left: `${p * 100}%` }} />
      </div>
      <span className="w-8 text-right font-mono text-[11px] tabular-nums text-white/60">{Math.round(p * 100)}%</span>
    </div>
  );
}

/** Convenience wrapper: a scroll area with the ruler pinned to its corner. */
export function TickScrollArea({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className={cn("relative", className)}>
      <div ref={ref} className="h-full overflow-y-auto">
        {children}
      </div>
      <TickScrollbar container={ref} className="absolute bottom-3 right-3" />
    </div>
  );
}
