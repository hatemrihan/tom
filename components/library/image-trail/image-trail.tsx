"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ImageTrailProps {
  images: string[];
  /** Pointer distance (px) between spawned images. */
  threshold?: number;
  /** How long each image lives (ms). */
  lifetime?: number;
  /** Image width in px. */
  size?: number;
  children?: ReactNode;
  className?: string;
}

interface Spawn {
  id: number;
  src: string;
  x: number;
  y: number;
  rotate: number;
}

/**
 * Leaves a trail of images behind the cursor. Each one pops in, then shrinks
 * away — the faster you move, the denser the trail.
 */
export function ImageTrail({ images, threshold = 70, lifetime = 900, size = 140, children, className }: ImageTrailProps) {
  const [trail, setTrail] = useState<Spawn[]>([]);
  const last = useRef<{ x: number; y: number } | null>(null);
  const counter = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (images.length === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (last.current && Math.hypot(x - last.current.x, y - last.current.y) < threshold) return;
    last.current = { x, y };
    const id = counter.current++;
    const spawn: Spawn = { id, src: images[id % images.length], x, y, rotate: (Math.random() - 0.5) * 16 };
    setTrail((t) => [...t.slice(-14), spawn]);
    window.setTimeout(() => setTrail((t) => t.filter((s) => s.id !== id)), lifetime);
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={() => {
        last.current = null;
      }}
      className={cn("relative isolate overflow-hidden", className)}
    >
      <AnimatePresence>
        {trail.map((s) => (
          <motion.img
            key={s.id}
            src={s.src}
            alt=""
            aria-hidden
            draggable={false}
            initial={{ opacity: 0, scale: 0.6, rotate: s.rotate - 10 }}
            animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
            exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.35, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="pointer-events-none absolute rounded-lg object-cover shadow-xl"
            style={{ left: s.x - size / 2, top: s.y - (size * 1.25) / 2, width: size, height: size * 1.25 }}
          />
        ))}
      </AnimatePresence>
      <div className="pointer-events-none relative z-10">{children}</div>
    </div>
  );
}
