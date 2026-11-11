"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "../_lib/cn";

export interface TickScrollbarProps {
  /** Scroll container to follow (defaults to the window). */
  container?: RefObject<HTMLElement | null>;
  ticks?: number;
  /** Optional named parts of the page; the current one is shown beside the ruler. */
  sections?: { id: string; label: string }[];
  className?: string;
}

/**
 * A ruler for reading progress: a needle glides over ticks that swell as it
 * passes. Click or use the arrow keys to jump. It takes the current text
 * colour, so it sits on any surface.
 */
export function TickScrollbar({ container, ticks = 40, sections, className }: TickScrollbarProps) {
  const { scrollYProgress } = useScroll({ container });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(Math.min(1, Math.max(0, v))));

  const jump = (fraction: number) => {
    const el = container?.current ?? document.scrollingElement;
    if (!el) return;
    el.scrollTo({ top: fraction * (el.scrollHeight - el.clientHeight), behavior: "smooth" });
  };

  const current = sections?.[Math.min(sections.length - 1, Math.floor(p * sections.length))];

  return (
    <div className={cn("flex items-center gap-4 text-[11px] font-medium uppercase leading-none tracking-[0.01em]", className)}>
      {sections && <span className="w-24 truncate">{current?.label}</span>}
      <div
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
        className="relative flex h-5 min-w-0 flex-1 cursor-pointer items-center justify-between outline-none focus-visible:opacity-70"
      >
        {Array.from({ length: ticks }).map((_, i) => {
          const near = Math.max(0, 1 - Math.abs(i / (ticks - 1) - p) * ticks * 0.3);
          return <span key={i} className="w-px bg-current" style={{ height: 5 + near * 9 + (i % 5 === 0 ? 3 : 0), opacity: 0.25 + near * 0.75 }} />;
        })}
        <span className="absolute top-0 h-full w-[2px] -translate-x-1/2 bg-current" style={{ left: `${p * 100}%` }} />
      </div>
      <span className="w-8 text-right font-normal tabular-nums opacity-60">{Math.round(p * 100)}%</span>
    </div>
  );
}

/**
 * A scroll area with the ruler in its own footer row, so it never sits on
 * top of the text.
 */
export function TickScrollArea({ children, ticks, className }: { children: ReactNode; ticks?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("flex flex-col", className)}>
      <div ref={ref} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
      <div className="border-t border-current/10 px-6 py-3">
        <TickScrollbar container={ref} ticks={ticks} />
      </div>
    </div>
  );
}
