"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "../_lib/cn";

export interface ScrollStrokeProps {
  children?: ReactNode;
  /** SVG path to draw. Defaults to a looping squiggle. */
  path?: string;
  viewBox?: string;
  color?: string;
  strokeWidth?: number;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

const SQUIGGLE =
  "M20 260 C 120 80, 260 60, 300 160 S 220 320, 180 240 S 300 60, 420 120 S 520 300, 460 320 S 360 200, 470 140 S 640 80, 680 220 S 560 380, 600 300 S 760 160, 860 240";

/**
 * A bold stroke that draws itself in step with scroll progress, layered
 * behind (or over) your headline.
 */
export function ScrollStroke({
  children,
  path = SQUIGGLE,
  viewBox = "0 0 880 400",
  color = "#c6f432",
  strokeWidth = 34,
  container,
  className,
}: ScrollStrokeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start end", "end start"] });
  const length = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className={cn("relative flex items-center justify-center", className)}>
      <svg aria-hidden viewBox={viewBox} className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid meet">
        <motion.path d={path} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: length }} />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
