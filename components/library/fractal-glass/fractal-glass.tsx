"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn } from "../_lib/cn";

export interface FractalGlassProps {
  src: string;
  alt?: string;
  /** Number of fluted glass ribs. */
  ribs?: number;
  /** How much each rib magnifies the image behind it. */
  zoom?: number;
  className?: string;
}

/**
 * An image seen through fluted (reeded) glass. Every rib shows a slightly
 * magnified, offset slice of the picture; moving the pointer slides the image
 * behind the glass.
 */
export function FractalGlass({ src, alt = "", ribs = 14, zoom = 1.18, className }: FractalGlassProps) {
  const mx = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const shift = useTransform(sx, [0, 1], [-6, 6]);

  return (
    <div
      role="img"
      aria-label={alt}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
      }}
      onPointerLeave={() => mx.set(0.5)}
      className={cn("relative flex aspect-[4/5] w-64 overflow-hidden rounded-2xl bg-neutral-900", className)}
    >
      {Array.from({ length: ribs }).map((_, i) => (
        <Rib key={i} index={i} count={ribs} src={src} zoom={zoom} shift={shift} />
      ))}
    </div>
  );
}

function Rib({
  index,
  count,
  src,
  zoom,
  shift,
}: {
  index: number;
  count: number;
  src: string;
  zoom: number;
  shift: MotionValue<number>;
}) {
  // Each rib samples the slice of the image that sits behind it, then
  // stretches it slightly so neighbouring ribs overlap like real glass.
  const center = ((index + 0.5) / count) * 100;
  const posX = useTransform(shift, (s) => `calc(${center}% + ${s * (index % 2 ? 1 : -1)}px) 50%`);

  return (
    <motion.div
      className="relative h-full flex-1"
      style={{
        backgroundImage: `url("${src}")`,
        backgroundSize: `${count * 100 * zoom}% ${zoom * 100}%`,
        backgroundPosition: posX,
      }}
    >
      {/* Rib shading: highlight on the left edge, shadow on the right */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 18%, transparent 45%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </motion.div>
  );
}
