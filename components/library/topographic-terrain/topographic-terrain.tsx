"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { createNoise3D, runCanvas } from "../_lib/noise";
import { cn } from "../_lib/cn";

export interface TopographicTerrainProps {
  /** Number of ridge lines. */
  lines?: number;
  /** Peak height in px. */
  height?: number;
  /** Raise the terrain around the pointer. */
  interactive?: boolean;
  speed?: number;
  seed?: number;
  className?: string;
}

/**
 * Stacked ridge lines that read as a 3D landscape. Each line hides the ones
 * behind it, and the land swells under the pointer.
 */
export function TopographicTerrain({
  lines = 34,
  height = 70,
  interactive = true,
  speed = 0.08,
  seed = 11,
  className,
}: TopographicTerrainProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, active: false, strength: 0 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const noise = createNoise3D(seed);

    return runCanvas(
      canvas,
      (ctx, w, h, t) => {
        const style = getComputedStyle(canvas);
        const ink = style.color;
        const paper = style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)" ? style.backgroundColor : "#fafafa";
        const p = pointer.current;
        p.strength += ((p.active ? 1 : 0) - p.strength) * 0.06;

        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1;

        const top = h * 0.22;
        const gap = (h - top - 10) / lines;
        const step = 6;

        for (let i = 0; i < lines; i++) {
          const baseY = top + i * gap;
          const depth = i / lines; // 0 = far, 1 = near
          ctx.beginPath();
          ctx.moveTo(0, h);
          for (let x = 0; x <= w + step; x += step) {
            const nx = x / w;
            // Mountains rise toward the centre of the canvas.
            const envelope = Math.pow(Math.sin(Math.PI * Math.min(Math.max(nx, 0), 1)), 2.2);
            let e = noise(nx * 4, i * 0.12, t * speed, 4) - 0.35;
            e = Math.max(0, e) * envelope;
            if (interactive && p.strength > 0.01) {
              const dx = (x - p.x) / 90;
              const dy = (baseY - p.y) / 60;
              e += Math.exp(-(dx * dx + dy * dy)) * 0.35 * p.strength;
            }
            const y = baseY - e * height * (0.6 + depth * 0.8);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          ctx.closePath();
          ctx.fill(); // occlude lines behind
          ctx.globalAlpha = 0.25 + depth * 0.75;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      },
      { animate: !reduce }
    );
  }, [lines, height, interactive, speed, seed, reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current.x = e.clientX - r.left;
        pointer.current.y = e.clientY - r.top;
        pointer.current.active = true;
      }}
      onPointerLeave={() => {
        pointer.current.active = false;
      }}
      className={cn("block h-full w-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100", className)}
    />
  );
}
