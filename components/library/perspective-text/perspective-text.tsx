"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "../_lib/cn";

export interface PerspectiveTextProps {
  lines: string[];
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Lines of oversized text wrapped around an invisible cylinder. As you scroll,
 * each line rolls up into view, flattens in the centre and tips away again.
 */
export function PerspectiveText({ lines, container, className }: PerspectiveTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start end", "end start"] });

  return (
    <div ref={ref} className={cn("py-[20vh]", className)} style={{ perspective: 600 }}>
      {lines.map((line, i) => (
        <Line key={i} progress={scrollYProgress} index={i} total={lines.length}>
          {line}
        </Line>
      ))}
    </div>
  );
}

function Line({ children, progress, index, total }: { children: string; progress: MotionValue<number>; index: number; total: number }) {
  const centre = (index + 0.5) / total;
  const rotateX = useTransform(progress, [centre - 0.3, centre, centre + 0.3], [65, 0, -65]);
  const opacity = useTransform(progress, [centre - 0.35, centre - 0.15, centre + 0.15, centre + 0.35], [0.15, 1, 1, 0.15]);
  const scale = useTransform(progress, [centre - 0.3, centre, centre + 0.3], [0.88, 1, 0.88]);
  return (
    <motion.p
      style={{ rotateX, opacity, scale, transformOrigin: "50% 50%" }}
      className="whitespace-nowrap text-center text-[clamp(2rem,7vw,5rem)] font-bold italic leading-[1.05] tracking-[-0.04em]"
    >
      {children}
    </motion.p>
  );
}
