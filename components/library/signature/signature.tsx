"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../_lib/cn";

export interface SignatureProps {
  /**
   * One or more SVG path `d` strings, drawn in order.
   * Defaults to a hand-drawn "Tom".
   */
  paths?: string[];
  viewBox?: string;
  /** Total draw time in ms. */
  duration?: number;
  strokeWidth?: number;
  className?: string;
  /** Accessible name for the signature. */
  label?: string;
}

const DEFAULT_PATHS = [
  // T
  "M12 24 C 28 20, 44 20, 60 22 M 36 22 C 35 40, 36 58, 34 76",
  // o
  "M84 52 C 72 50, 66 62, 72 70 C 80 78, 94 70, 90 58 C 88 52, 84 50, 80 54",
  // m + flourish
  "M104 72 C 106 62, 106 54, 108 50 C 112 46, 118 50, 118 60 L 118 72 M 118 58 C 122 48, 132 46, 134 56 L 136 72 C 142 78, 176 74, 206 60",
];

/**
 * An SVG signature that draws itself on mount, stroke by stroke, with each
 * stroke's duration proportional to its length (so the pen speed is constant).
 */
export function Signature({
  paths = DEFAULT_PATHS,
  viewBox = "0 0 216 90",
  duration = 2200,
  strokeWidth = 2.6,
  className,
  label = "Signature",
}: SignatureProps) {
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const [lengths, setLengths] = useState<number[]>([]);
  const [go, setGo] = useState(false);

  useLayoutEffect(() => {
    setLengths(refs.current.map((p) => (p ? p.getTotalLength() : 0)));
  }, [paths]);

  useEffect(() => {
    if (lengths.length === 0) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setGo(true)));
    return () => cancelAnimationFrame(id);
  }, [lengths]);

  const total = lengths.reduce((s, l) => s + l, 0) || 1;
  const durations = paths.map((_, i) => ((lengths[i] ?? 0) / total) * duration);
  const delays = durations.map((_, i) => durations.slice(0, i).reduce((s, d) => s + d, 0));

  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={cn("h-24 w-auto text-neutral-900 dark:text-white", className)} fill="none">
      {paths.map((d, i) => {
        const len = lengths[i] ?? 0;
        const dur = durations[i];
        const delay = delays[i];
        return (
          <path
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            d={d}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              len
                ? {
                    strokeDasharray: len,
                    strokeDashoffset: go ? 0 : len,
                    transition: go ? `stroke-dashoffset ${dur}ms cubic-bezier(0.45,0.05,0.4,1) ${delay}ms` : "none",
                  }
                : { opacity: 0 }
            }
          />
        );
      })}
    </svg>
  );
}
