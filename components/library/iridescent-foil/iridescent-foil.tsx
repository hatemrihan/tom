"use client";

import type { ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "../_lib/cn";

export interface IridescentFoilProps {
  children?: ReactNode;
  /** Max tilt in degrees. */
  tilt?: number;
  /** Strength of the foil layer, 0–1. */
  intensity?: number;
  className?: string;
}

/**
 * A holographic foil card. A rainbow sheen and a fine diffraction pattern
 * slide across the surface as the pointer moves, while the card tilts in 3D.
 */
export function IridescentFoil({ children, tilt = 14, intensity = 0.75, className }: IridescentFoilProps) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const x = useSpring(mx, { stiffness: 180, damping: 22 });
  const y = useSpring(my, { stiffness: 180, damping: 22 });

  const rotateY = useTransform(x, [0, 1], [-tilt, tilt]);
  const rotateX = useTransform(y, [0, 1], [tilt, -tilt]);
  const bgX = useTransform(x, [0, 1], [0, 100]);
  const bgY = useTransform(y, [0, 1], [0, 100]);
  const hue = useTransform(() => (x.get() + y.get()) * 180);

  const foil = useMotionTemplate`linear-gradient(115deg, transparent 20%, hsl(${hue} 90% 70%) 35%, hsl(calc(${hue} + 60) 90% 72%) 45%, hsl(calc(${hue} + 140) 90% 70%) 55%, transparent 75%) ${bgX}% ${bgY}% / 250% 250%`;
  const glare = useMotionTemplate`radial-gradient(circle at ${bgX}% ${bgY}%, rgba(255,255,255,0.55), transparent 45%)`;

  return (
    <div style={{ perspective: 1000 }} className={cn("inline-block", className)}>
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX, rotateY }}
        className="relative aspect-[5/7] w-60 overflow-hidden rounded-2xl bg-neutral-900 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0">{children}</div>

        {/* Rainbow foil */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-color-dodge"
          style={{ background: foil, opacity: intensity }}
        />
        {/* Diffraction grain */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            opacity: intensity * 0.6,
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 5px)",
            backgroundPositionX: bgX,
          }}
        />
        {/* Glare */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: glare }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />
      </motion.div>
    </div>
  );
}
