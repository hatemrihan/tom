"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "../_lib/cn";

export interface AnimatedTooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

/**
 * A tooltip that springs in and sways with the pointer, as if hanging from
 * the trigger. Opens on hover and keyboard focus.
 */
export function AnimatedTooltip({ content, children, side = "top", className }: AnimatedTooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const x = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 12 });
  const rotate = useTransform(sx, [-60, 60], [-12, 12]);
  const shift = useTransform(sx, [-60, 60], [-14, 14]);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        x.set(0);
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (r.left + r.width / 2));
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "top" ? 10 : -10, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "top" ? 6 : -6, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            style={{ rotate, x: shift, translateX: "-50%", originY: side === "top" ? 1 : 0 }}
            className={cn(
              "pointer-events-none absolute left-1/2 z-50 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-neutral-900",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            {content}
            <span
              aria-hidden
              className={cn(
                "absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-inherit",
                side === "top" ? "-bottom-1" : "-top-1"
              )}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
