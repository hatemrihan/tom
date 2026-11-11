"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "../_lib/cn";

export interface HorizontalTextScrollProps {
  text: string;
  /**
   * How fast the line travels. `1` crosses in about two screens of scrolling;
   * `0.5` (the default) takes twice as long; `2` is twice as fast.
   */
  speed?: number;
  /** Scroll container (defaults to the window). Give it position: relative. */
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Vertical scroll drives a giant line of text sideways across a pinned
 * stage; letters fill with ink as they pass.
 */
export function HorizontalTextScroll({ text, speed = 0.5, container, className }: HorizontalTextScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-85%"]);
  const clip = useTransform(scrollYProgress, (f) => `inset(0 ${100 - Math.min(1, Math.max(0, f)) * 100}% 0 0)`);

  // The track is (1 + screens) tall; the pinned stage is one screen of it.
  const screens = 2 / Math.min(8, Math.max(0.1, speed));

  return (
    <div ref={ref} className={cn("relative", className)} style={{ height: `${(1 + screens) * 100}%` }}>
      <div className="sticky top-0 flex min-h-[240px] items-center overflow-hidden" style={{ height: `${100 / (1 + screens)}%` }}>
        <motion.p style={{ x }} className="relative whitespace-nowrap text-[clamp(4rem,16vw,12rem)] font-black uppercase leading-none tracking-[-0.05em]">
          <span className="text-neutral-200 dark:text-neutral-800">{text}</span>
          <motion.span aria-hidden className="absolute inset-0 overflow-hidden text-neutral-900 dark:text-white" style={{ clipPath: clip }}>
            {text}
          </motion.span>
        </motion.p>
      </div>
    </div>
  );
}
