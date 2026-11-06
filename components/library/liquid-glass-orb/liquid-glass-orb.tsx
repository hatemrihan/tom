"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

export interface LiquidGlassOrbProps {
  state?: OrbState;
  size?: number;
  /** Three colours for the liquid inside the orb. */
  colors?: [string, string, string];
  className?: string;
}

const MOTION: Record<OrbState, { speed: number; amp: number; scale: number[] }> = {
  idle: { speed: 9, amp: 10, scale: [1, 1.02, 1] },
  listening: { speed: 5, amp: 16, scale: [1, 1.06, 0.98, 1.04, 1] },
  thinking: { speed: 2.4, amp: 22, scale: [1, 0.97, 1] },
  speaking: { speed: 3.2, amp: 18, scale: [1, 1.08, 0.97, 1.06, 1] },
};

/**
 * An AI-assistant orb: coloured liquid blobs merge inside a glass sphere
 * (an SVG "goo" filter), with motion that changes per state.
 */
export function LiquidGlassOrb({
  state = "idle",
  size = 160,
  colors = ["#7c5cff", "#21d4fd", "#ff5fa2"],
  className,
}: LiquidGlassOrbProps) {
  const id = useId().replace(/:/g, "");
  const m = MOTION[state];

  return (
    <motion.div
      role="img"
      aria-label={`Assistant is ${state}`}
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      animate={{ scale: m.scale }}
      transition={{ duration: m.speed / 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg aria-hidden className="absolute size-0">
        <filter id={`goo-${id}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={size / 14} result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </svg>

      {/* Liquid */}
      <div className="absolute inset-0 overflow-hidden rounded-full bg-neutral-950">
        <div className="absolute inset-0 opacity-90" style={{ filter: `url(#goo-${id}) blur(${size / 40}px)` }}>
          {colors.map((c, i) => {
            const a = (i / colors.length) * Math.PI * 2;
            const r = m.amp * (size / 160);
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{ width: size * 0.55, height: size * 0.55, marginLeft: -size * 0.275, marginTop: -size * 0.275, background: c }}
                animate={{
                  x: [Math.cos(a) * r, Math.cos(a + 2) * r * 1.4, Math.cos(a + 4) * r, Math.cos(a) * r],
                  y: [Math.sin(a) * r, Math.sin(a + 2) * r * 1.4, Math.sin(a + 4) * r, Math.sin(a) * r],
                  scale: [1, 1.15, 0.9, 1],
                }}
                transition={{ duration: m.speed + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
              />
            );
          })}
        </div>
      </div>

      {/* Glass shell */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.75) 0 6%, rgba(255,255,255,0.15) 16%, transparent 32%), radial-gradient(circle at 70% 85%, rgba(255,255,255,0.18), transparent 40%)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 -12px 30px rgba(0,0,0,0.45), inset 0 10px 24px rgba(255,255,255,0.15), 0 20px 50px -15px rgba(80,60,200,0.55)",
        }}
      />
      {state === "thinking" && (
        <motion.span
          aria-hidden
          className="absolute -inset-1 rounded-full"
          style={{ background: `conic-gradient(from 0deg, transparent, ${colors[1]}, transparent 40%)`, mask: "radial-gradient(circle, transparent 66%, #000 67%)", WebkitMask: "radial-gradient(circle, transparent 66%, #000 67%)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}
