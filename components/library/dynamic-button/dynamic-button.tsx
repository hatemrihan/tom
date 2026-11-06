"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { cn } from "../_lib/cn";

export interface DynamicButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  /** Changing this key swaps the label with a morph. */
  stateKey: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "solid" | "outline";
}

/**
 * A button whose width springs to fit its label, while the old label blurs out
 * and the new one blurs in. Change `stateKey` whenever the content changes.
 */
export function DynamicButton({
  stateKey,
  children,
  icon,
  variant = "solid",
  className,
  ...props
}: DynamicButtonProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stateKey]);

  return (
    <motion.button
      type="button"
      animate={{ width }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full text-sm font-medium outline-none",
        "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        variant === "solid"
          ? "bg-neutral-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] dark:bg-white dark:text-neutral-900"
          : "border border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={stateKey}
          ref={measureRef}
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.35 }}
          className="flex shrink-0 items-center gap-2 whitespace-nowrap px-4"
        >
          {icon}
          {children}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
