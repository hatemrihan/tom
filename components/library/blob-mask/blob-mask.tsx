"use client";

import { useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface BlobMaskProps {
  src: string;
  alt?: string;
  /** Label shown in the centre. */
  label?: ReactNode;
  className?: string;
}

// Two organic outlines in a 0–1 objectBoundingBox space with matching command counts,
// so the path can morph smoothly between them.
const REST =
  "M0.04,0.08 C0.2,0.02 0.5,0.05 0.8,0.03 C0.93,0.02 0.98,0.1 0.97,0.25 C0.96,0.5 0.99,0.7 0.97,0.9 C0.96,0.98 0.85,0.98 0.7,0.97 C0.45,0.95 0.25,0.99 0.08,0.96 C0.02,0.95 0.02,0.85 0.03,0.7 C0.04,0.45 0.01,0.25 0.04,0.08 Z";
const HOVER =
  "M0.08,0.12 C0.25,0.1 0.5,0.14 0.75,0.09 C0.9,0.06 0.92,0.2 0.9,0.33 C0.87,0.5 0.93,0.68 0.89,0.84 C0.86,0.93 0.78,0.92 0.65,0.9 C0.45,0.86 0.28,0.92 0.14,0.88 C0.07,0.86 0.08,0.76 0.1,0.64 C0.12,0.48 0.06,0.3 0.08,0.12 Z";

/**
 * An image held in a hand-torn, organic frame. On hover the outline breathes
 * into a new shape and the image eases in — an SVG clip-path morph.
 */
export function BlobMask({ src, alt = "", label, className }: BlobMaskProps) {
  const id = useId().replace(/:/g, "");
  const [hover, setHover] = useState(false);

  return (
    <div
      className={cn("relative aspect-[16/10] w-full", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      role="img"
      aria-label={alt}
    >
      <svg aria-hidden className="absolute size-0">
        <clipPath id={`blob-${id}`} clipPathUnits="objectBoundingBox">
          <motion.path initial={false} animate={{ d: hover ? HOVER : REST }} transition={{ type: "spring", stiffness: 120, damping: 14 }} />
        </clipPath>
      </svg>
      <div className="absolute inset-0" style={{ clipPath: `url(#blob-${id})` }}>
        <motion.img
          src={src}
          alt=""
          draggable={false}
          className="h-full w-full object-cover grayscale"
          animate={{ scale: hover ? 1.08 : 1, filter: hover ? "grayscale(0)" : "grayscale(1)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {label && (
        <motion.span
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-semibold text-red-500"
          animate={{ opacity: hover ? 0 : 1, scale: hover ? 0.9 : 1 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}
