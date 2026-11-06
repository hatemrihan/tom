"use client";

import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface RollingTextProps {
  text: string;
  /** Delay between letters (s). */
  stagger?: number;
  /** Roll direction. */
  direction?: "up" | "down";
  /** Element to render — e.g. wrap in an <a> yourself for links. */
  className?: string;
}

/**
 * Each letter rolls to reveal an identical copy on hover, with a stagger —
 * great for nav links and buttons. Hover the parent or the text itself.
 */
export function RollingText({ text, stagger = 0.025, direction = "up", className }: RollingTextProps) {
  const dir = direction === "up" ? -1 : 1;
  const letters = Array.from(text);

  return (
    <motion.span initial="rest" whileHover="hover" whileFocus="hover" animate="rest" className={cn("relative inline-flex overflow-hidden leading-[1.15]", className)}>
      <span className="sr-only">{text}</span>
      {letters.map((ch, i) => (
        <span key={i} aria-hidden className="relative inline-block">
          <motion.span
            className="inline-block"
            variants={{ rest: { y: "0%" }, hover: { y: `${dir * 100}%` } }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: i * stagger }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
          <motion.span
            className="absolute left-0 inline-block"
            style={{ top: `${-dir * 100}%` }}
            variants={{ rest: { y: "0%" }, hover: { y: `${dir * 100}%` } }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: i * stagger }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
