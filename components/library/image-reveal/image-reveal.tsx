"use client";

import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { cn } from "../_lib/cn";

export interface ImageRevealProps {
  /** Image shown on top (e.g. black & white or a sketch). */
  base: string;
  /** Image revealed under the pointer. */
  reveal: string;
  alt?: string;
  /** Lens radius in px. */
  radius?: number;
  className?: string;
}

/**
 * Two images stacked — a soft circular lens follows the pointer and shows the
 * hidden one underneath. Touch: press and drag.
 */
export function ImageReveal({ base, reveal, alt = "", radius = 110, className }: ImageRevealProps) {
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });
  const [active, setActive] = useState(false);
  const r = useSpring(0, { stiffness: 260, damping: 22 });
  const mask = useMotionTemplate`radial-gradient(circle ${r}px at ${sx}px ${sy}px, #000 60%, transparent 100%)`;

  return (
    <div
      role="img"
      aria-label={alt}
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - b.left);
        y.set(e.clientY - b.top);
      }}
      onPointerEnter={() => {
        setActive(true);
        r.set(radius);
      }}
      onPointerLeave={() => {
        setActive(false);
        r.set(0);
      }}
      className={cn("relative aspect-[4/3] w-full touch-none overflow-hidden rounded-2xl", active && "cursor-none", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={base} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      <motion.img
        src={reveal}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      />
    </div>
  );
}
