"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "../_lib/cn";

export interface HorizontalTextScrollProps {
  text: string;
  /** Scroll container (defaults to the window). Give it position: relative. */
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Vertical scroll drives a giant line of text sideways across a pinned
 * stage; letters light up as they pass the centre.
 */
export function HorizontalTextScroll({ text, container, className }: HorizontalTextScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-85%"]);
  const clip = useTransform(scrollYProgress, (f) => `inset(0 ${100 - Math.min(1, Math.max(0, f)) * 100}% 0 0)`);

  return (
    <div ref={ref} className={cn("relative h-[300%]", className)}>
      <div className="sticky top-0 flex h-[33.34%] min-h-[240px] items-center overflow-hidden">
        <motion.p style={{ x }} className="relative whitespace-nowrap text-[clamp(4rem,16vw,12rem)] font-black uppercase leading-none tracking-[-0.05em]">
          <span className="text-neutral-200 dark:text-neutral-800">{text}</span>
          <motion.span
            aria-hidden
            className="absolute inset-0 overflow-hidden text-neutral-900 dark:text-white"
            style={{ clipPath: clip }}
          >
            {text}
          </motion.span>
        </motion.p>
      </div>
    </div>
  );
}
