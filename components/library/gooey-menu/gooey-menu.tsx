"use client";

import { useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface GooeyMenuItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export interface GooeyMenuProps {
  items: GooeyMenuItem[];
  /** Fan direction. */
  direction?: "up" | "right";
  /** Gap between items in px. */
  distance?: number;
  className?: string;
}

/**
 * A floating action button whose items squeeze out of it like liquid.
 * The goo is an SVG blur + alpha-contrast filter applied to the blobs only,
 * so icons stay crisp.
 */
export function GooeyMenu({ items, direction = "up", distance = 64, className }: GooeyMenuProps) {
  const [open, setOpen] = useState(false);
  const id = useId().replace(/:/g, "");
  const offset = (i: number) => (direction === "up" ? { x: 0, y: -(i + 1) * distance } : { x: (i + 1) * distance, y: 0 });

  return (
    <div className={cn("relative size-14", className)}>
      <svg aria-hidden className="absolute size-0">
        <filter id={`goo-${id}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </svg>

      <div aria-hidden className="absolute inset-0" style={{ filter: `url(#goo-${id})` }}>
        {items.map((_, i) => (
          <motion.span
            key={i}
            className="absolute inset-1 rounded-full bg-neutral-900 dark:bg-white"
            initial={false}
            animate={open ? offset(i) : { x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: open ? i * 0.04 : (items.length - i) * 0.03 }}
          />
        ))}
        <span className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white" />
      </div>

      {items.map((item, i) => (
        <motion.button
          key={item.label}
          type="button"
          aria-label={item.label}
          title={item.label}
          tabIndex={open ? 0 : -1}
          onClick={() => {
            item.onClick?.();
            setOpen(false);
          }}
          className="absolute inset-1 flex items-center justify-center rounded-full text-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-900"
          initial={false}
          animate={open ? { ...offset(i), opacity: 1, scale: 1 } : { x: 0, y: 0, opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: open ? i * 0.04 : 0 }}
          style={{ pointerEvents: open ? "auto" : "none" }}
        >
          {item.icon}
        </motion.button>
      ))}

      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="absolute inset-0 flex items-center justify-center rounded-full text-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:text-neutral-900"
      >
        <motion.svg viewBox="0 0 24 24" className="size-6" animate={{ rotate: open ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </motion.svg>
      </button>
    </div>
  );
}
