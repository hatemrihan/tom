"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "../_lib/cn";

export interface TextRevealScrollProps {
  text: string;
  /**
   * Scroll container to track. Defaults to the window.
   * Pass a ref when the text lives inside its own scroll area.
   */
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * A paragraph whose words light up one by one as you scroll past it —
 * reading progress made visible. Pure scroll-linked motion values.
 */
export function TextRevealScroll({ text, container, className }: TextRevealScrollProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start 0.85", "end 0.4"] });
  const words = text.split(/\s+/);

  return (
    <p
      ref={ref}
      className={cn("flex flex-wrap text-3xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white", className)}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blur = useTransform(progress, range, ["blur(3px)", "blur(0px)"]);
  return (
    <motion.span aria-hidden style={{ opacity, filter: blur }} className="mr-[0.25em] mt-[0.1em]">
      {children}
    </motion.span>
  );
}
