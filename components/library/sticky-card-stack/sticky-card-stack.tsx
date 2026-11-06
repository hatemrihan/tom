"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "../_lib/cn";

export interface StickyCardStackProps {
  cards: ReactNode[];
  /** Scroll container to track (defaults to the window). */
  container?: RefObject<HTMLElement | null>;
  /** Distance (px) from the top where cards stick. */
  top?: number;
  className?: string;
}

/**
 * Cards that pin as you scroll and pile up — each earlier card shrinks and
 * darkens slightly as the next one slides over it.
 */
export function StickyCardStack({ cards, container, top = 24, className }: StickyCardStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className={cn("relative", className)}>
      {cards.map((card, i) => (
        <StackItem key={i} index={i} total={cards.length} progress={scrollYProgress} top={top}>
          {card}
        </StackItem>
      ))}
    </div>
  );
}

function StackItem({ children, index, total, progress, top }: { children: ReactNode; index: number; total: number; progress: MotionValue<number>; top: number }) {
  const start = index / total;
  const targetScale = 1 - (total - index - 1) * 0.05;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const dim = useTransform(progress, [start, 1], [0, (total - index - 1) * 0.12]);

  return (
    <div className="sticky flex h-[85%] min-h-[300px] items-start justify-center" style={{ top }}>
      <motion.div
        style={{ scale, top: index * 14, transformOrigin: "top center" }}
        className="relative w-full overflow-hidden rounded-3xl shadow-[0_-10px_30px_-12px_rgba(0,0,0,0.35)]"
      >
        {children}
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.div>
    </div>
  );
}
