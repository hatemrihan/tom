"use client";

import type { ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from "motion/react";
import { cn } from "../_lib/cn";

export interface ChromaticButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  /** Max channel separation in px. */
  spread?: number;
}

/**
 * A dark button whose label separates into red, green and blue channels that
 * drift toward the pointer — a chromatic-aberration hover.
 */
export function ChromaticButton({ children, spread = 3, className, ...props }: ChromaticButtonProps) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 300, damping: 20 });
  const sy = useSpring(py, { stiffness: 300, damping: 20 });
  const h = useSpring(hover, { stiffness: 260, damping: 22 });

  const rx = useTransform(() => -sx.get() * spread * h.get());
  const ry = useTransform(() => -sy.get() * spread * h.get());
  const bx = useTransform(() => sx.get() * spread * h.get());
  const by = useTransform(() => sy.get() * spread * h.get());
  const glow = useTransform(() => `radial-gradient(120px circle at ${50 + sx.get() * 50}% ${50 + sy.get() * 50}%, rgba(255,255,255,${0.12 * h.get()}), transparent)`);

  const layer = "absolute inset-0 flex items-center justify-center mix-blend-screen";

  return (
    <motion.button
      type="button"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerEnter={() => hover.set(1)}
      onPointerLeave={() => {
        hover.set(0);
        px.set(0);
        py.set(0);
      }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative isolate inline-flex h-11 min-w-36 items-center justify-center overflow-hidden rounded-xl bg-neutral-950 px-6 text-sm font-semibold tracking-tight text-white outline-none",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_-8px_rgba(0,0,0,0.6)] focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      <motion.span aria-hidden className="absolute inset-0" style={{ background: glow }} />
      {/* Invisible copy sizes the button and provides the accessible label */}
      <span className="invisible">{children}</span>
      <motion.span aria-hidden className={cn(layer, "text-[#ff2a2a]")} style={{ x: rx, y: ry }}>
        {children}
      </motion.span>
      <span aria-hidden className={cn(layer, "text-[#2aff5a]")}>
        {children}
      </span>
      <motion.span aria-hidden className={cn(layer, "text-[#2a6bff]")} style={{ x: bx, y: by }}>
        {children}
      </motion.span>
    </motion.button>
  );
}
