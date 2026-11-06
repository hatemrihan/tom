"use client";

import { useRef, type ReactNode } from "react";
import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { cn } from "../_lib/cn";

export interface SnapButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /** Gap (px) between the button and the container edge when snapped. */
  inset?: number;
  label?: string;
  className?: string;
}

/**
 * A floating action button you can fling anywhere inside its container — on
 * release it springs to the nearest corner, using your throw's velocity.
 */
export function SnapButton({ children, onClick, inset = 16, label = "Action", className }: SnapButtonProps) {
  const area = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragged = useRef(false);

  const snap = (_: unknown, info: PanInfo) => {
    const a = area.current?.getBoundingClientRect();
    const b = btn.current?.getBoundingClientRect();
    if (!a || !b) return;
    // Project where the throw would land, then pick the nearest corner.
    const px = x.get() + info.velocity.x * 0.2;
    const py = y.get() + info.velocity.y * 0.2;
    const maxX = a.width - b.width - inset * 2;
    const maxY = a.height - b.height - inset * 2;
    const tx = px > maxX / 2 ? maxX : 0;
    const ty = py > maxY / 2 ? maxY : 0;
    animate(x, tx, { type: "spring", stiffness: 300, damping: 24, velocity: info.velocity.x });
    animate(y, ty, { type: "spring", stiffness: 300, damping: 24, velocity: info.velocity.y });
  };

  return (
    <div ref={area} className={cn("relative overflow-hidden", className)} style={{ padding: inset }}>
      <motion.button
        ref={btn}
        type="button"
        aria-label={label}
        drag
        dragConstraints={area}
        dragElastic={0.15}
        dragMomentum={false}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={(e, info) => {
          snap(e, info);
          setTimeout(() => (dragged.current = false), 0);
        }}
        onClick={() => !dragged.current && onClick?.()}
        style={{ x, y }}
        whileTap={{ scale: 0.92 }}
        whileDrag={{ scale: 1.08, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4)" }}
        className="relative z-10 flex size-14 cursor-grab touch-none items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-white dark:text-neutral-900"
      >
        {children}
      </motion.button>
    </div>
  );
}
