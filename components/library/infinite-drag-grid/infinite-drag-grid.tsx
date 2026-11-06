"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { cn } from "../_lib/cn";

export interface InfiniteDragGridProps {
  /** Tiles to repeat across the endless plane. */
  items: ReactNode[];
  /** Tile size in px. */
  cell?: number;
  /** Columns in one repeating block. */
  columns?: number;
  className?: string;
}

/**
 * An endless plane of tiles you can drag (or scroll/trackpad) in any
 * direction, with momentum. Tiles wrap around so it never runs out.
 */
export function InfiniteDragGrid({ items, cell = 160, columns = 6, className }: InfiniteDragGridProps) {
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const rowsInBlock = Math.ceil(items.length / columns);

  useMotionValueEvent(x, "change", (v) => setOffset((o) => ({ ...o, x: v })));
  useMotionValueEvent(y, "change", (v) => setOffset((o) => ({ ...o, y: v })));

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      x.set(x.get() - e.deltaX);
      y.set(y.get() - e.deltaY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
    };
  }, [x, y]);

  // Only render the tiles that cover the viewport (+1 margin).
  const startCol = Math.floor(-offset.x / cell) - 1;
  const startRow = Math.floor(-offset.y / cell) - 1;
  const cols = Math.ceil(size.w / cell) + 3;
  const rows = Math.ceil(size.h / cell) + 3;
  const tiles: { key: string; left: number; top: number; item: ReactNode }[] = [];
  for (let r = startRow; r < startRow + rows; r++) {
    for (let c = startCol; c < startCol + cols; c++) {
      const br = ((r % rowsInBlock) + rowsInBlock) % rowsInBlock;
      const bc = ((c % columns) + columns) % columns;
      // Offset each row a little so repeats feel less grid-like.
      const idx = (br * columns + bc + (Math.floor(r / rowsInBlock) * 2)) % items.length;
      tiles.push({ key: `${r}:${c}`, left: c * cell, top: r * cell, item: items[(idx + items.length) % items.length] });
    }
  }

  return (
    <div
      ref={box}
      className={cn("relative touch-none overflow-hidden bg-neutral-50 select-none dark:bg-neutral-950", className)}
      onPointerDown={(e) => {
        const start = { px: e.clientX, py: e.clientY, x: x.get(), y: y.get(), t: performance.now() };
        let last = { x: e.clientX, y: e.clientY, t: start.t };
        let vel = { x: 0, y: 0 };
        x.stop();
        y.stop();
        const move = (ev: PointerEvent) => {
          const now = performance.now();
          const dt = Math.max(now - last.t, 1);
          vel = { x: ((ev.clientX - last.x) / dt) * 1000, y: ((ev.clientY - last.y) / dt) * 1000 };
          last = { x: ev.clientX, y: ev.clientY, t: now };
          x.set(start.x + ev.clientX - start.px);
          y.set(start.y + ev.clientY - start.py);
        };
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          animate(x, x.get(), { type: "inertia", velocity: vel.x, power: 0.35, timeConstant: 320 });
          animate(y, y.get(), { type: "inertia", velocity: vel.y, power: 0.35, timeConstant: 320 });
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
    >
      <motion.div className="absolute left-0 top-0 cursor-grab active:cursor-grabbing" style={{ x, y }}>
        {tiles.map((t) => (
          <div key={t.key} className="absolute flex items-center justify-center p-3" style={{ left: t.left, top: t.top, width: cell, height: cell }}>
            {t.item}
          </div>
        ))}
      </motion.div>
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-[11px] text-neutral-500 shadow-sm backdrop-blur dark:bg-neutral-900/80">
        Drag or scroll in any direction
      </p>
    </div>
  );
}
