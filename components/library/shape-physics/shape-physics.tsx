"use client";

import { useEffect, useRef } from "react";
import { cn } from "../_lib/cn";

export interface PhysicsItem {
  label: string;
  /** Shape of the body. Physics treats every body as a circle. */
  shape?: "circle" | "square";
  size?: number;
  className?: string;
}

export interface ShapePhysicsProps {
  items?: PhysicsItem[];
  gravity?: number;
  /** Bounciness, 0–1. */
  restitution?: number;
  className?: string;
}

const DEFAULT_ITEMS: PhysicsItem[] = [
  { label: "React", size: 96, className: "bg-sky-400 text-sky-950" },
  { label: "Next.js", shape: "square", size: 92, className: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" },
  { label: "TypeScript", size: 104, className: "bg-blue-600 text-white" },
  { label: "Tailwind", shape: "square", size: 84, className: "bg-teal-300 text-teal-950" },
  { label: "Python", size: 88, className: "bg-yellow-300 text-yellow-950" },
  { label: "Motion", shape: "square", size: 76, className: "bg-fuchsia-400 text-fuchsia-950" },
  { label: "Node", size: 72, className: "bg-lime-400 text-lime-950" },
  { label: "SQL", shape: "square", size: 66, className: "bg-orange-400 text-orange-950" },
];

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  angle: number;
  el: HTMLDivElement | null;
}

/**
 * Labelled shapes that drop into the box, tumble and pile up. Grab and fling
 * them. A ~100 line custom engine — no physics library needed.
 */
export function ShapePhysics({ items = DEFAULT_ITEMS, gravity = 1800, restitution = 0.45, className }: ShapePhysicsProps) {
  const box = useRef<HTMLDivElement>(null);
  const bodies = useRef<Body[]>([]);
  const drag = useRef<{ i: number; x: number; y: number; px: number; py: number } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const { width } = el.getBoundingClientRect();
    bodies.current = items.map((it, i) => ({
      x: ((i + 0.5) / items.length) * width + (Math.random() - 0.5) * 20,
      y: -100 - i * 70,
      vx: (Math.random() - 0.5) * 200,
      vy: 0,
      r: (it.size ?? 80) / 2,
      angle: (Math.random() - 0.5) * 0.6,
      el: bodies.current[i]?.el ?? null,
    }));

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const { width: W, height: H } = el.getBoundingClientRect();
      const bs = bodies.current;

      for (let s = 0; s < 3; s++) {
        const h = dt / 3;
        for (let i = 0; i < bs.length; i++) {
          const b = bs[i];
          if (drag.current?.i === i) {
            const d = drag.current;
            b.vx = (d.x - b.x) / h * 0.25;
            b.vy = (d.y - b.y) / h * 0.25;
          } else {
            b.vy += gravity * h;
          }
          b.vx *= 0.999;
          b.x += b.vx * h;
          b.y += b.vy * h;

          // Walls (open top so shapes can fall in)
          if (b.y + b.r > H) {
            b.y = H - b.r;
            b.vy *= -restitution;
            b.vx *= 0.96;
          }
          if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx *= -restitution;
          } else if (b.x + b.r > W) {
            b.x = W - b.r;
            b.vx *= -restitution;
          }
        }

        // Circle-circle collisions
        for (let i = 0; i < bs.length; i++) {
          for (let j = i + 1; j < bs.length; j++) {
            const a = bs[i];
            const b = bs[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const overlap = a.r + b.r - dist;
            if (overlap <= 0) continue;
            const nx = dx / dist;
            const ny = dy / dist;
            const ma = a.r * a.r;
            const mb = b.r * b.r;
            const total = ma + mb;
            a.x -= nx * overlap * (mb / total);
            a.y -= ny * overlap * (mb / total);
            b.x += nx * overlap * (ma / total);
            b.y += ny * overlap * (ma / total);
            const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (rel < 0) {
              const imp = (-(1 + restitution) * rel) / (1 / ma + 1 / mb);
              a.vx -= (imp / ma) * nx;
              a.vy -= (imp / ma) * ny;
              b.vx += (imp / mb) * nx;
              b.vy += (imp / mb) * ny;
            }
          }
        }
      }

      for (const b of bs) {
        b.angle += (b.vx * dt) / b.r; // roll
        if (b.el) b.el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px) rotate(${b.angle}rad)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [items, gravity, restitution]);

  const local = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div
      ref={box}
      className={cn("relative h-80 w-full touch-none select-none overflow-hidden", className)}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const p = local(e);
        drag.current.x = p.x;
        drag.current.y = p.y;
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      {items.map((it, i) => (
        <div
          key={it.label}
          ref={(node) => {
            if (!bodies.current[i]) bodies.current[i] = { x: -999, y: -999, vx: 0, vy: 0, r: (it.size ?? 80) / 2, angle: 0, el: node };
            else bodies.current[i].el = node;
          }}
          onPointerDown={(e) => {
            const p = local(e);
            drag.current = { i, ...p, px: p.x, py: p.y };
          }}
          className={cn(
            "absolute left-0 top-0 flex cursor-grab items-center justify-center text-sm font-semibold tracking-tight shadow-[inset_0_-4px_0_rgba(0,0,0,0.12)] will-change-transform active:cursor-grabbing",
            it.shape === "square" ? "rounded-[28%]" : "rounded-full",
            it.className ?? "bg-neutral-200 text-neutral-900"
          )}
          style={{ width: it.size ?? 80, height: it.size ?? 80, transform: "translate(-999px,-999px)" }}
        >
          {it.label}
        </div>
      ))}
    </div>
  );
}
