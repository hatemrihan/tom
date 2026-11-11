"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface StairsPreloaderProps {
  children: ReactNode;
  /** Number of panels. */
  columns?: number;
  /** How long the count from 0 to 100 takes, in ms. */
  duration?: number;
  label?: string;
  /** Classes for the panels and the counter on them. */
  panelClassName?: string;
  /** `single`: every panel lifts up. `double`: alternate panels go up and down. */
  variant?: "single" | "double";
  /** Wait until the block is on screen before starting, so nobody misses it. */
  startInView?: boolean;
  onComplete?: () => void;
  className?: string;
}

type Phase = "waiting" | "counting" | "leaving" | "done";

/**
 * A preloader that counts to 100, then lifts away as a staircase of panels to
 * reveal the page underneath, which settles from a slight zoom and blur.
 */
export function StairsPreloader({
  children,
  columns = 6,
  duration = 1800,
  label = "Loading",
  panelClassName = "bg-neutral-200 text-neutral-900",
  variant = "single",
  startInView = true,
  onComplete,
  className,
}: StairsPreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>(startInView ? "waiting" : "counting");
  const [count, setCount] = useState(0);
  const done = useRef(onComplete);
  useEffect(() => {
    done.current = onComplete;
  });

  // Start when visible.
  useEffect(() => {
    if (phase !== "waiting" || !root.current) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setPhase("counting"), { threshold: 0.3 });
    io.observe(root.current);
    return () => io.disconnect();
  }, [phase]);

  // Count 0 → 100 with an ease, then lift the panels.
  useEffect(() => {
    if (phase !== "counting") return;
    const begin = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - begin) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setCount(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPhase("leaving");
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, duration]);

  // Remove the panels once the last one has left.
  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = setTimeout(() => {
      setPhase("done");
      done.current?.();
    }, 550 + columns * 60 + 100);
    return () => clearTimeout(timer);
  }, [phase, columns]);

  const leaving = phase === "leaving";
  const revealed = leaving || phase === "done";

  return (
    <div ref={root} className={cn("relative overflow-hidden", className)}>
      <motion.div
        initial={false}
        animate={revealed ? { scale: 1, filter: "blur(0px)" } : { scale: 1.06, filter: "blur(6px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: revealed ? 0.15 : 0 }}
        className="h-full"
      >
        {children}
      </motion.div>

      {phase !== "done" && (
        <div className="absolute inset-0 z-10 flex" role="status" aria-label={label}>
          {Array.from({ length: columns }).map((_, i) => (
            <motion.span
              key={i}
              className={cn("-ml-px h-full flex-1", panelClassName)}
              initial={false}
              animate={{ y: leaving ? (variant === "double" && i % 2 ? "101%" : "-101%") : "0%" }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: leaving ? i * 0.06 : 0 }}
            />
          ))}
          <motion.div
            initial={false}
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={cn("absolute inset-x-5 bottom-4 flex items-end justify-between text-[11px] font-medium uppercase leading-none tracking-[0.01em]", panelClassName, "bg-transparent")}
          >
            <span className="opacity-50">{label}</span>
            <span className="font-mono text-7xl font-light tabular-nums">{String(count).padStart(3, "0")}</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
