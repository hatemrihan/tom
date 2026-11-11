"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "../_lib/cn";

export interface DrawingCursorProps {
  children?: ReactNode;
  /** Ink colour (CSS colour). Defaults to the current text colour. */
  color?: string;
  /** Line width in px. */
  width?: number;
  /**
   * `trail`: moving the pointer leaves ink that evaporates.
   * `draw`: press and drag to draw; the ink stays and can be saved.
   */
  mode?: "trail" | "draw";
  /** Trail mode: how long (ms) the ink stays before fading out. */
  fade?: number;
  /** Draw mode: show the Clear and Save buttons. */
  controls?: boolean;
  /** File name used when saving. */
  fileName?: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
  t: number;
}

/**
 * An ink layer over any content. As a trail it tapers and evaporates behind
 * the pointer; in draw mode strokes stay and can be downloaded as a PNG.
 */
export function DrawingCursor({
  children,
  color,
  width = 6,
  mode = "trail",
  fade = 900,
  controls = true,
  fileName = "drawing.png",
  className,
}: DrawingCursorProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const trail = useRef<Point[]>([]);
  const strokes = useRef<Point[][]>([]);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

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

    const segment = (a: Point, b: Point) => {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const now = performance.now();
      ctx.clearRect(0, 0, el.clientWidth, el.clientHeight);
      ctx.strokeStyle = ctx.fillStyle = color ?? getComputedStyle(el).color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (mode === "draw") {
        ctx.lineWidth = width;
        for (const stroke of strokes.current) {
          if (stroke.length === 1) {
            ctx.beginPath();
            ctx.arc(stroke[0].x, stroke[0].y, width / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          for (let i = 1; i < stroke.length; i++) segment(stroke[i - 1], stroke[i]);
        }
        return;
      }

      trail.current = trail.current.filter((p) => now - p.t < fade);
      const pts = trail.current;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (b.t - a.t > 80) continue; // a pause starts a new stroke
        const life = 1 - (now - b.t) / fade;
        ctx.globalAlpha = Math.max(0, life);
        ctx.lineWidth = width * (0.3 + 0.7 * life);
        segment(a, b);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color, width, fade, mode]);

  /** Pointer position in the canvas's own pixels, correct even inside a scaled parent. */
  const at = (e: PointerEvent<HTMLDivElement>): Point => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * el.clientWidth,
      y: ((e.clientY - r.top) / r.height) * el.clientHeight,
      t: performance.now(),
    };
  };

  const clear = useCallback(() => {
    strokes.current = [];
    setEmpty(true);
  }, []);

  const save = useCallback(() => {
    const el = canvas.current;
    if (!el) return;
    // Flatten onto the surface colour so the PNG isn't transparent.
    const out = document.createElement("canvas");
    out.width = el.width;
    out.height = el.height;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    const bg = getComputedStyle(el.parentElement as HTMLElement).backgroundColor;
    ctx.fillStyle = bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(el, 0, 0);
    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [fileName]);

  const button =
    "cursor-pointer rounded-full bg-black/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.01em] text-current outline-none backdrop-blur transition hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-current disabled:cursor-default disabled:opacity-40";

  return (
    <div
      onPointerDown={(e) => {
        if (mode !== "draw" || (e.target as HTMLElement).closest("button")) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        drawing.current = true;
        strokes.current.push([at(e)]);
        setEmpty(false);
      }}
      onPointerMove={(e) => {
        if (mode === "trail") trail.current.push(at(e));
        else if (drawing.current) strokes.current[strokes.current.length - 1]?.push(at(e));
      }}
      onPointerUp={() => (drawing.current = false)}
      onPointerCancel={() => (drawing.current = false)}
      className={cn("relative overflow-hidden", mode === "draw" && "cursor-crosshair touch-none select-none", className)}
    >
      <div className="relative z-0 h-full">{children}</div>
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full" />
      {mode === "draw" && controls && (
        <div className="absolute bottom-3 right-3 z-20 flex gap-1.5">
          <button type="button" onClick={clear} disabled={empty} className={button}>
            Clear
          </button>
          <button type="button" onClick={save} disabled={empty} className={button}>
            Save PNG
          </button>
        </div>
      )}
    </div>
  );
}
