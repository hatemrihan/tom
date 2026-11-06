"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, animate, useMotionValue, useTransform } from "motion/react";
import { cn } from "../_lib/cn";

export interface StairsPreloaderProps {
  /** Content revealed after loading. */
  children: ReactNode;
  /** Number of stair columns. */
  columns?: number;
  /** Time spent counting to 100 (ms). */
  duration?: number;
  label?: string;
  onComplete?: () => void;
  className?: string;
}

/**
 * A loading screen that counts to 100, then lifts away as a staircase of
 * columns, revealing the content underneath.
 */
export function StairsPreloader({ children, columns = 6, duration = 1800, label = "Loading", onComplete, className }: StairsPreloaderProps) {
  const [done, setDone] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: duration / 1000,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [count, duration]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        initial={{ scale: 1.08, filter: "blur(6px)" }}
        animate={done ? { scale: 1, filter: "blur(0px)" } : undefined}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="h-full"
      >
        {children}
      </motion.div>

      <AnimatePresence onExitComplete={onComplete}>
        {!done && (
          <motion.div key="loader" className="absolute inset-0 z-10 flex" role="status" aria-label={label} exit={{ opacity: 1 }} transition={{ duration: 0.9 }}>
            {Array.from({ length: columns }).map((_, i) => (
              <motion.span
                key={i}
                className="h-full flex-1 bg-neutral-950 dark:bg-white"
                style={{ marginLeft: -1 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: i * 0.06 }}
              />
            ))}
            <motion.div
              className="absolute bottom-4 right-5 font-mono text-5xl font-light tabular-nums text-white dark:text-neutral-900"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            >
              {rounded}
            </motion.div>
            <motion.p
              className="absolute bottom-6 left-5 text-[11px] uppercase tracking-[0.3em] text-white/50 dark:text-neutral-900/50"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {label}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
