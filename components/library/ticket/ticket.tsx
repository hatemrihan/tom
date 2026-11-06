"use client";

import { Children, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "../_lib/cn";

export interface TicketProps {
  children: ReactNode;
  /** Radius of the side notches at each perforation (px). */
  notch?: number;
  /** Tilt toward the pointer (degrees). 0 to disable. */
  tilt?: number;
  className?: string;
}

/**
 * A perforated ticket. Each direct child becomes a section; perforations with
 * side notches are drawn between sections. Leans gently toward the pointer.
 */
export function Ticket({ children, notch = 10, tilt = 8, className }: TicketProps) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 20 });
  const sy = useSpring(py, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const glare = useTransform(
    () => `radial-gradient(circle at ${sx.get() * 100}% ${sy.get() * 100}%, rgba(255,255,255,0.45), transparent 55%)`
  );
  const sections = Children.toArray(children);
  const last = sections.length - 1;

  return (
    <div style={{ perspective: 900 }} className={cn("w-full max-w-[340px]", className)}>
      <motion.div
        onPointerMove={(e) => {
          if (!tilt) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX, rotateY }}
        className="relative drop-shadow-[0_18px_24px_rgba(0,0,0,0.18)]"
      >
        {sections.map((section, i) => {
          const mask = notchMask(i > 0, i < last, notch);
          return (
            <div
              key={i}
              className="relative bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white"
              style={{
                borderTopLeftRadius: i === 0 ? 18 : 0,
                borderTopRightRadius: i === 0 ? 18 : 0,
                borderBottomLeftRadius: i === last ? 18 : 0,
                borderBottomRightRadius: i === last ? 18 : 0,
                WebkitMask: mask,
                mask,
              }}
            >
              {section}
              {i < last && (
                <div
                  aria-hidden
                  className="absolute bottom-0 border-b-2 border-dashed border-neutral-200 dark:border-neutral-700"
                  style={{ left: notch + 8, right: notch + 8 }}
                />
              )}
            </div>
          );
        })}
        <motion.div
          aria-hidden
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 rounded-[18px] mix-blend-soft-light"
        />
      </motion.div>
    </div>
  );
}

/** Builds a mask that cuts half-circle notches on the top and/or bottom corners. */
function notchMask(top: boolean, bottom: boolean, r: number) {
  const cut = (pos: string, at: string) =>
    `radial-gradient(circle ${r}px at ${at}, transparent ${r}px, #000 ${r + 0.5}px) ${pos} / 51% 51% no-repeat`;
  const solid = (pos: string) => `linear-gradient(#000,#000) ${pos} / 100% 51% no-repeat`;
  return [
    ...(top ? [cut("top left", "0 0"), cut("top right", "100% 0")] : [solid("top")]),
    ...(bottom ? [cut("bottom left", "0 100%"), cut("bottom right", "100% 100%")] : [solid("bottom")]),
  ].join(", ");
}

/** Optional helper for a padded ticket section. */
export function TicketSection({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}
