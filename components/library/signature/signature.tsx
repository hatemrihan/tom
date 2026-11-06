"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../_lib/cn";

export interface SignatureProps {
  /**
   * One or more SVG path `d` strings, drawn in order.
   * Defaults to a hand-drawn "Hatem".
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
  // H
  "M14 22 C 16 40, 15 58, 13 74 M 13 48 C 24 46, 34 45, 44 46 M 42 18 C 43 38, 44 58, 46 76",
  // a
  "M76 54 C 66 46, 56 54, 58 64 C 60 74, 74 70, 78 58 C 78 64, 80 72, 88 72",
  // t
  "M100 30 C 100 46, 98 62, 104 72 C 108 76, 114 72, 116 68 M 90 46 C 98 45, 108 44, 118 44",
  // e
  "M126 62 C 136 62, 146 58, 144 52 C 140 44, 126 50, 126 62 C 126 74, 140 76, 150 68",
  // m + flourish
  "M158 72 C 160 62, 160 54, 162 50 C 166 46, 172 50, 172 60 L 172 72 M 172 58 C 176 48, 186 46, 188 56 L 190 72 C 196 78, 230 74, 260 60",
];

/**
 * An SVG signature that draws itself on mount, stroke by stroke, with each
 * stroke's duration proportional to its length (so the pen speed is constant).
 */
export function Signature({
  paths = DEFAULT_PATHS,
  viewBox = "0 0 270 90",
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
