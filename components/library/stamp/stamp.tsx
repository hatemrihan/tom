"use client";

import { useId, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface StampProps {
  children: ReactNode;
  /** Value printed in the corner, e.g. "1.20". */
  denomination?: string;
  /** Caption printed under the artwork. */
  caption?: string;
  /** Size of the perforation holes (px). */
  hole?: number;
  /** Draws a wavy cancellation postmark over the stamp. */
  postmark?: string;
  /** Slight resting rotation (deg). */
  rotate?: number;
  className?: string;
}

/**
 * A postage-stamp frame for any image, text or React content.
 * Perforations are a CSS mask, so the frame works on any background.
 */
export function Stamp({ children, denomination, caption, hole = 5, postmark, rotate = -3, className }: StampProps) {
  const arcId = useId();
  const gap = hole * 2.6;
  // Repeating circular holes along every edge.
  const edge = `radial-gradient(circle at center, transparent ${hole}px, #000 ${hole + 0.5}px)`;
  const mask = [
    `${edge} 0 0 / ${gap}px ${gap}px round`,
    `linear-gradient(#000,#000) center / calc(100% - ${hole * 2}px) calc(100% - ${hole * 2}px) no-repeat`,
  ].join(", ");

  return (
    <motion.figure
      initial={{ rotate: rotate - 6, y: 12, opacity: 0 }}
      animate={{ rotate, y: 0, opacity: 1 }}
      whileHover={{ rotate: 0, scale: 1.04, y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cn("relative inline-block w-44 drop-shadow-[0_10px_14px_rgba(0,0,0,0.18)]", className)}
    >
      <div className="bg-[#fbf8f2] dark:bg-neutral-100" style={{ padding: hole * 2.2, WebkitMask: mask, mask }}>
        <div className="relative overflow-hidden bg-neutral-200 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
          <div className="aspect-[4/5]">{children}</div>
          {denomination && (
            <span className="absolute right-1.5 top-1 font-serif text-lg font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              {denomination}
            </span>
          )}
        </div>
        {caption && (
          <figcaption className="pt-2 text-center font-serif text-[10px] uppercase tracking-[0.25em] text-neutral-700">
            {caption}
          </figcaption>
        )}
      </div>

      {postmark && (
        <svg
          aria-hidden
          viewBox="0 0 200 120"
          className="pointer-events-none absolute -right-12 top-6 w-40 -rotate-12 text-neutral-800/55 mix-blend-multiply"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="60" cy="60" r="42" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="34" strokeWidth="1" />
          <path id={arcId} d="M 28 60 A 32 32 0 0 1 92 60" />
          <text fontSize="9" fill="currentColor" stroke="none" letterSpacing="2">
            <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
              {postmark.toUpperCase()}
            </textPath>
          </text>
          <text x="60" y="66" fontSize="11" textAnchor="middle" fill="currentColor" stroke="none">
            {new Date().getFullYear()}
          </text>
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M100 ${36 + i * 14} q 12 -8 24 0 t 24 0 t 24 0 t 24 0`} strokeWidth="2.5" />
          ))}
        </svg>
      )}
    </motion.figure>
  );
}
