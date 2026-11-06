"use client";

import { motion, type Transition } from "motion/react";
import { cn } from "../_lib/cn";

const spring: Transition = { type: "spring", stiffness: 400, damping: 28 };

interface IconProps {
  /** The alternate state (e.g. open, playing, copied). */
  active: boolean;
  size?: number;
  className?: string;
}

const svgProps = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: cn("shrink-0", className),
  "aria-hidden": true,
});

/** Hamburger ⇄ close. */
export function MenuIcon({ active, size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <motion.line x1="4" x2="20" initial={false} animate={active ? { y1: 12, y2: 12, rotate: 45 } : { y1: 7, y2: 7, rotate: 0 }} transition={spring} style={{ originX: "12px", originY: "12px" }} />
      <motion.line x1="4" x2="20" y1="12" y2="12" initial={false} animate={{ opacity: active ? 0 : 1, scaleX: active ? 0 : 1 }} transition={spring} />
      <motion.line x1="4" x2="20" initial={false} animate={active ? { y1: 12, y2: 12, rotate: -45 } : { y1: 17, y2: 17, rotate: 0 }} transition={spring} style={{ originX: "12px", originY: "12px" }} />
    </svg>
  );
}

/** Play ⇄ pause — the triangle splits into two bars. */
export function PlayPauseIcon({ active, size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)} fill="currentColor" stroke="none">
      <motion.path initial={false} animate={{ d: active ? "M6 5h4v14H6z" : "M7 4l6 4v8l-6 4z" }} transition={spring} />
      <motion.path initial={false} animate={{ d: active ? "M14 5h4v14h-4z" : "M13 8l6 4-6 4z" }} transition={spring} />
    </svg>
  );
}

/** Copy ⇄ check. */
export function CopyCheckIcon({ active, size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <motion.g initial={false} animate={{ opacity: active ? 0 : 1, scale: active ? 0.5 : 1 }} transition={spring} style={{ originX: "12px", originY: "12px" }}>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V6a2 2 0 012-2h9" />
      </motion.g>
      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={false} animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }} transition={{ duration: 0.3 }} />
    </svg>
  );
}

/** Plus ⇄ minus (great for accordions). */
export function PlusMinusIcon({ active, size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <line x1="5" x2="19" y1="12" y2="12" />
      <motion.line x1="12" x2="12" y1="5" y2="19" initial={false} animate={{ rotate: active ? 90 : 0, opacity: active ? 0 : 1 }} transition={spring} style={{ originX: "12px", originY: "12px" }} />
    </svg>
  );
}

/** Bell that rings when `active` flips to true. */
export function BellIcon({ active, size = 24, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <motion.g animate={active ? { rotate: [0, 18, -14, 10, -6, 0] } : { rotate: 0 }} transition={{ duration: 0.7 }} style={{ originX: "12px", originY: "4px" }}>
        <path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9" />
      </motion.g>
      <motion.path d="M10.3 21a1.94 1.94 0 003.4 0" animate={active ? { x: [0, -2, 2, -1, 0] } : { x: 0 }} transition={{ duration: 0.7 }} />
    </svg>
  );
}
