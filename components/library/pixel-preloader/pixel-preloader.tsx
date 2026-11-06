"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface PixelPreloaderProps {
  children: ReactNode;
  /** Number of columns in the pixel grid (rows follow the aspect ratio). */
  columns?: number;
  rows?: number;
  /** ms before the pixels start dissolving. */
  delay?: number;
  className?: string;
}

/**
 * A cover of square pixels that dissolve in a random order to reveal the
 * content beneath — a retro, game-like transition.
 */
export function PixelPreloader({ children, columns = 14, rows = 9, delay = 600, className }: PixelPreloaderProps) {
  const [go, setGo] = useState(false);
  const total = columns * rows;

  // Stable pseudo-random order (deterministic so SSR and client agree).
  const order = useMemo(() => {
    const arr = Array.from({ length: total }, (_, i) => i);
    let s = 1234567;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const j = s % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const rank = new Array<number>(total);
    arr.forEach((cell, r) => (rank[cell] = r));
    return rank;
  }, [total]);

  useEffect(() => {
    const t = setTimeout(() => setGo(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <motion.span
            key={i}
            className="-m-px bg-neutral-950 dark:bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: go ? 0 : 1 }}
            transition={{ duration: 0.01, delay: go ? (order[i] / total) * 0.9 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}
