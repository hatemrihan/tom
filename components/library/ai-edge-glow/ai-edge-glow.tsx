"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface AiEdgeGlowProps {
  /** Show the glow. */
  active: boolean;
  children?: ReactNode;
  /** Glow thickness in px. */
  thickness?: number;
  colors?: string[];
  /** Corner radius of the glow (match your container). */
  radius?: number;
  className?: string;
}

/**
 * A soft, living rainbow that hugs the edges of its container — the classic
 * "assistant is listening" signal. Wrap any surface (or the whole page).
 */
export function AiEdgeGlow({
  active,
  children,
  thickness = 14,
  colors = ["#ff6ac1", "#ffb86c", "#f1fa8c", "#50fa7b", "#8be9fd", "#bd93f9", "#ff6ac1"],
  radius = 24,
  className,
}: AiEdgeGlowProps) {
  const gradient = `conic-gradient(from var(--angle, 0deg), ${colors.join(", ")})`;
  const ring = (blur: number, opacity: number, key: string) => (
    <motion.div
      key={key}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        borderRadius: radius,
        padding: thickness,
        background: gradient,
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        filter: `blur(${blur}px)`,
      }}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity, scale: 1, "--angle": ["0deg", "360deg"] }}
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.5 } }}
      transition={{ opacity: { duration: 0.6 }, scale: { duration: 0.6 }, "--angle": { duration: 5, repeat: Infinity, ease: "linear" } }}
    />
  );

  return (
    <div className={cn("relative", className)} style={{ borderRadius: radius }}>
      {children}
      <AnimatePresence>{active && [ring(thickness * 1.6, 0.9, "outer"), ring(thickness * 0.35, 0.8, "inner")]}</AnimatePresence>
    </div>
  );
}
