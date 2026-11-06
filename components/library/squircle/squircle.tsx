"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../_lib/cn";

export interface SquircleProps {
  children?: ReactNode;
  /** Corner size in px. */
  radius?: number;
  /** 0 = regular rounded corners, 1 = full continuous (iOS-like) smoothing. */
  smoothing?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Continuous-curvature corners ("squircles") — the smooth corner shape used
 * on modern app icons. Generates an SVG path for the element's real size.
 */
export function Squircle({ children, radius = 32, smoothing = 0.6, className, style }: SquircleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setPath(squirclePath(el.offsetWidth, el.offsetHeight, radius, smoothing));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [radius, smoothing]);

  return (
    <div ref={ref} className={cn("relative", className)} style={{ ...style, clipPath: path ? `path("${path}")` : undefined, borderRadius: path ? undefined : radius }}>
      {children}
    </div>
  );
}

/** Builds a smoothed rounded-rect path (based on the "figma squircle" idea). */
export function squirclePath(w: number, h: number, radius: number, smoothing: number) {
  const r = Math.min(radius, w / 2, h / 2);
  // The curve starts further along each edge as smoothing grows…
  const p = Math.min(r * (1 + smoothing * 0.6), w / 2, h / 2);
  // …while its handles pull in toward the corner (0.4477 ≈ a circular arc).
  const c = p * 0.4477 * (1 - smoothing * 0.55);
  const f = (n: number) => n.toFixed(2);
  return [
    `M ${f(p)} 0`,
    `L ${f(w - p)} 0`,
    `C ${f(w - c)} 0 ${f(w)} ${f(c)} ${f(w)} ${f(p)}`,
    `L ${f(w)} ${f(h - p)}`,
    `C ${f(w)} ${f(h - c)} ${f(w - c)} ${f(h)} ${f(w - p)} ${f(h)}`,
    `L ${f(p)} ${f(h)}`,
    `C ${f(c)} ${f(h)} 0 ${f(h - c)} 0 ${f(h - p)}`,
    `L 0 ${f(p)}`,
    `C 0 ${f(c)} ${f(c)} 0 ${f(p)} 0`,
    "Z",
  ].join(" ");
}
