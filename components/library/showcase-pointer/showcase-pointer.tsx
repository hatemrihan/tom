"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "../_lib/cn";

export interface ShowcasePointerProps {
  children: ReactNode;
  /** Label used when hovering an element without its own `data-cursor`. */
  defaultLabel?: string;
  className?: string;
}

/**
 * Replaces the cursor inside an area with a soft follower. Any descendant with
 * `data-cursor="View project"` morphs the follower into a labelled pill.
 * Only activates for mouse pointers, so touch devices are unaffected.
 */
export function ShowcasePointer({ children, defaultLabel, className }: ShowcasePointerProps) {
  const area = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });
  const [inside, setInside] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  return (
    <div
      ref={area}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !area.current) return;
        const r = area.current.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
        const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
        setLabel(target?.dataset.cursor || defaultLabel || null);
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setInside(true)}
      onPointerLeave={() => {
        setInside(false);
        setLabel(null);
      }}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      className={cn("relative overflow-hidden", inside && "cursor-none [&_*]:cursor-none", className)}
    >
      {children}
      <AnimatePresence>
        {inside && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-50"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: down ? 0.85 : 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn(
                "-translate-x-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap bg-neutral-900 text-white shadow-lg dark:bg-white dark:text-neutral-900",
                label ? "rounded-full px-3.5 py-2 text-xs font-medium" : "size-3 rounded-full"
              )}
            >
              <AnimatePresence mode="popLayout">
                {label && (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    className="flex items-center gap-1.5"
                  >
                    {label}
                    <span className="text-[10px]">↗</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
