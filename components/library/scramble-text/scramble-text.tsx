"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../_lib/cn";

const DEFAULT_GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789#%&*+=?";

export interface ScrambleTextProps {
  text: string;
  /** Total time (ms) for the reveal. */
  duration?: number;
  /** Characters used while scrambling. */
  glyphs?: string;
  /** Only scramble characters that actually changed from the previous text. */
  onlyChanged?: boolean;
  className?: string;
}

/**
 * Reveals text left-to-right through a randomised "decrypt" effect.
 * Whenever `text` changes, only the differing characters scramble.
 */
export function ScrambleText({
  text,
  duration = 700,
  glyphs = DEFAULT_GLYPHS,
  onlyChanged = true,
  className,
}: ScrambleTextProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const previous = useRef(text);
  const frame = useRef(0);

  useEffect(() => {
    const from = previous.current;
    previous.current = text;
    if (reduce || from === text) return;

    const start = performance.now();
    const length = Math.max(from.length, text.length);
    // Each character settles at a staggered time.
    const settleAt = Array.from({ length }, (_, i) => (i / length) * duration * 0.7 + Math.random() * duration * 0.3);

    const tick = (now: number) => {
      const t = now - start;
      let out = "";
      for (let i = 0; i < length; i++) {
        const target = text[i] ?? "";
        const unchanged = onlyChanged && from[i] === target;
        if (unchanged || t >= settleAt[i] || target === " ") out += target;
        else out += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setDisplay(out);
      if (t < duration) frame.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [text, duration, glyphs, onlyChanged, reduce]);

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{reduce ? text : display}</span>
    </span>
  );
}
