"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../_lib/cn";

export interface AsciiTorusProps {
  /** Character ramp from dark to bright. */
  ramp?: string;
  cols?: number;
  rows?: number;
  speed?: number;
  /** Tilt the torus toward the pointer. */
  interactive?: boolean;
  className?: string;
}

/**
 * A spinning 3D torus rendered entirely with text characters — classic
 * ray-free "donut" projection with a luminance ramp. Pure DOM, no canvas.
 */
export function AsciiTorus({ ramp = ".,-~:;=!*#$@", cols = 80, rows = 32, speed = 1, interactive = true, className }: AsciiTorusProps) {
  const pre = useRef<HTMLPreElement>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = pre.current;
    if (!el) return;
    let A = 1;
    let B = 0;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const out = new Array(cols * rows).fill(" ");
      const z = new Float32Array(cols * rows);
      const a = A + tilt.current.y;
      const b = B + tilt.current.x;
      const cA = Math.cos(a), sA = Math.sin(a), cB = Math.cos(b), sB = Math.sin(b);
      for (let j = 0; j < 6.28; j += 0.07) {
        const ct = Math.cos(j), st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) {
          const sp = Math.sin(i), cp = Math.cos(i);
          const h = ct + 2; // distance from tube centre
          const D = 1 / (sp * h * sA + st * cA + 5);
          const t = sp * h * cA - st * sA;
          const x = Math.floor(cols / 2 + (cols * 0.375) * D * (cp * h * cB - t * sB));
          const y = Math.floor(rows / 2 + (rows * 0.75) * D * (cp * h * sB + t * cB));
          const o = x + cols * y;
          const N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
          if (y >= 0 && y < rows && x >= 0 && x < cols && D > z[o]) {
            z[o] = D;
            out[o] = ramp[Math.max(0, Math.min(ramp.length - 1, N))];
          }
        }
      }
      let s = "";
      for (let k = 0; k < out.length; k++) s += k % cols === cols - 1 ? out[k] + "\n" : out[k];
      el.textContent = s;
      if (!reduce) {
        A += 0.04 * speed;
        B += 0.02 * speed;
      }
    };
    frame();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [ramp, cols, rows, speed, reduce]);

  return (
    <pre
      ref={pre}
      aria-hidden
      onPointerMove={(e) => {
        if (!interactive) return;
        const r = e.currentTarget.getBoundingClientRect();
        tilt.current = { x: ((e.clientX - r.left) / r.width - 0.5) * 1.2, y: ((e.clientY - r.top) / r.height - 0.5) * 1.2 };
      }}
      className={cn("select-none font-mono text-[10px] leading-[1.1] text-neutral-900 dark:text-neutral-100", className)}
    />
  );
}
