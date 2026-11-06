"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { createNoise3D, runCanvas } from "../_lib/noise";
import { cn } from "../_lib/cn";

export interface TopographicFlowProps {
  /** Number of contour levels. */
  levels?: number;
  /** Grid cell size in px (smaller = smoother, heavier). */
  resolution?: number;
  /** Noise zoom — larger values give bigger landforms. */
  scale?: number;
  /** Animation speed. */
  speed?: number;
  seed?: number;
  className?: string;
}

/**
 * Animated contour lines, like a living topographic map. Lines are traced with
 * marching squares over drifting 3D noise. Colour follows CSS `color`, so it
 * adapts to dark mode automatically.
 */
export function TopographicFlow({
  levels = 12,
  resolution = 9,
  scale = 260,
  speed = 0.06,
  seed = 7,
  className,
}: TopographicFlowProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const noise = createNoise3D(seed);

    return runCanvas(
      canvas,
      (ctx, w, h, t) => {
        const cols = Math.ceil(w / resolution) + 1;
        const rows = Math.ceil(h / resolution) + 1;
        const field = new Float32Array(cols * rows);
        const z = t * speed;
        for (let y = 0; y < rows; y++)
          for (let x = 0; x < cols; x++)
            field[y * cols + x] = noise((x * resolution) / scale, (y * resolution) / scale, z, 3);

        ctx.clearRect(0, 0, w, h);
        const color = getComputedStyle(canvas).color;
        ctx.strokeStyle = color;
        ctx.lineJoin = "round";

        for (let l = 1; l <= levels; l++) {
          const iso = 0.2 + (l / (levels + 1)) * 0.6;
          ctx.globalAlpha = l % 4 === 0 ? 0.9 : 0.4;
          ctx.lineWidth = l % 4 === 0 ? 1.3 : 0.8;
          ctx.beginPath();
          for (let y = 0; y < rows - 1; y++) {
            for (let x = 0; x < cols - 1; x++) {
              const a = field[y * cols + x];
              const b = field[y * cols + x + 1];
              const c = field[(y + 1) * cols + x + 1];
              const d = field[(y + 1) * cols + x];
              const idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
              if (idx === 0 || idx === 15) continue;
              const px = x * resolution;
              const py = y * resolution;
              const r = resolution;
              const interp = (v1: number, v2: number) => (iso - v1) / (v2 - v1);
              const top: [number, number] = [px + r * interp(a, b), py];
              const right: [number, number] = [px + r, py + r * interp(b, c)];
              const bottom: [number, number] = [px + r * interp(d, c), py + r];
              const left: [number, number] = [px, py + r * interp(a, d)];
              const seg = (p: [number, number], q: [number, number]) => {
                ctx.moveTo(p[0], p[1]);
                ctx.lineTo(q[0], q[1]);
              };
              switch (idx) {
                case 1: case 14: seg(left, bottom); break;
                case 2: case 13: seg(bottom, right); break;
                case 3: case 12: seg(left, right); break;
                case 4: case 11: seg(top, right); break;
                case 5: seg(left, top); seg(bottom, right); break;
                case 6: case 9: seg(top, bottom); break;
                case 7: case 8: seg(left, top); break;
                case 10: seg(left, bottom); seg(top, right); break;
              }
            }
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      },
      { animate: !reduce }
    );
  }, [levels, resolution, scale, speed, seed, reduce]);

  return <canvas ref={ref} aria-hidden className={cn("block h-full w-full text-neutral-900 dark:text-neutral-100", className)} />;
}
