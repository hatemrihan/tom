"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../_lib/cn";

export interface DrawingCursorProps {
  children?: ReactNode;
  /** Ink colour (CSS colour). Defaults to the current text colour. */
  color?: string;
  /** Line width in px. */
  width?: number;
  /** How long (ms) a stroke stays before fading out. */
  fade?: number;
  className?: string;
}

interface Point {
  x: number;
  y: number;
  t: number;
}

/**
 * Moving the pointer over the area leaves a smooth ink trail that tapers and
 * fades away — like drawing with a marker that evaporates.
 */
export function DrawingCursor({ children, color, width = 6, fade = 900, className }: DrawingCursorProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const points = useRef<Point[]>([]);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    let raf = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = el.clientWidth * dpr;
      el.height = el.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const now = performance.now();
      points.current = points.current.filter((p) => now - p.t < fade);
      ctx.clearRect(0, 0, el.clientWidth, el.clientHeight);
      const pts = points.current;
      if (pts.length < 2) return;
      ctx.strokeStyle = color ?? getComputedStyle(el).color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (b.t - a.t > 80) continue; // gap = new stroke
        const life = 1 - (now - b.t) / fade;
        ctx.globalAlpha = Math.max(0, life);
        ctx.lineWidth = width * (0.3 + 0.7 * life);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        ctx.quadraticCurveTo(a.x, a.y, mx, my);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color, width, fade]);

  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        points.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
      }}
      className={cn("relative overflow-hidden", className)}
    >
      <div className="relative z-0 h-full">{children}</div>
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full" />
    </div>
  );
}
