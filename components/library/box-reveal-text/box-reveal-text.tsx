"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "../_lib/cn";

export interface BoxRevealTextProps {
  lines: string[];
  /** Colour of the sliding boxes. */
  boxClassName?: string;
  /** Line alignment inside the full-width block. */
  align?: "left" | "center";
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Each line hides behind a solid box that slides off as the block scrolls
 * into view — staggered line by line, like a reveal in an editorial site.
 */
export function BoxRevealText({ lines, boxClassName = "bg-neutral-900 dark:bg-white", align = "left", container, className }: BoxRevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start 0.9", "center 0.5"] });

  return (
    <div ref={ref} className={cn("w-full space-y-1", className)}>
      {lines.map((line, i) => (
        <RevealLine key={i} progress={scrollYProgress} index={i} total={lines.length} boxClassName={boxClassName} centered={align === "center"}>
          {line}
        </RevealLine>
      ))}
    </div>
  );
}

function RevealLine({ children, progress, index, total, boxClassName, centered }: { children: string; progress: MotionValue<number>; index: number; total: number; boxClassName: string; centered: boolean }) {
  // Lines take turns: each gets an equal share of the scroll, overlapping the next a little.
  const start = (index / total) * 0.8;
  const end = Math.min(1, start + 1.2 / total);
  const boxX = useTransform(progress, [start, end], ["0%", "101%"]);
  const textOpacity = useTransform(progress, [start, start + 0.05], [0, 1]);
  return (
    <div className={cn("relative w-fit overflow-hidden", centered && "mx-auto")}>
      <motion.span style={{ opacity: textOpacity }} className="block text-[clamp(1.8rem,5vw,3.5rem)] font-semibold leading-tight tracking-[-0.04em]">
        {children}
      </motion.span>
      <motion.span aria-hidden style={{ x: boxX }} className={cn("absolute inset-0", boxClassName)} />
    </div>
  );
}
