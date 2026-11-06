"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "../_lib/cn";

export interface ScrollImageExpandProps {
  /** Centre image — this one grows to fill the frame. */
  hero: string;
  /** Up to 8 surrounding images. */
  around: string[];
  caption?: string;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

const SLOTS = [
  { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
  { x: -1, y: 0 }, { x: 1, y: 0 },
  { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
];

/**
 * A pinned 3×3 image grid. As you scroll, the centre image scales up to fill
 * the frame while its neighbours drift outward and fade.
 */
export function ScrollImageExpand({ hero, around, caption, container, className }: ScrollImageExpandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 3.2]);
  const spread = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const fade = useTransform(scrollYProgress, [0.1, 0.7], [1, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.65, 0.9], [0, 1]);

  return (
    <div ref={ref} className={cn("relative h-[300%]", className)}>
      <div className="sticky top-0 flex h-[33.34%] min-h-[320px] items-center justify-center overflow-hidden">
        {around.slice(0, 8).map((src, i) => (
          <Satellite key={src + i} src={src} slot={SLOTS[i]} spread={spread} fade={fade} />
        ))}
        <motion.div style={{ scale: heroScale }} className="relative z-10 h-[30%] w-[22%] min-w-24 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt={caption ?? ""} className="h-full w-full object-cover" />
        </motion.div>
        {caption && (
          <motion.p style={{ opacity: captionOpacity }} className="absolute bottom-6 z-20 text-3xl font-semibold tracking-tight text-white drop-shadow-lg">
            {caption}
          </motion.p>
        )}
      </div>
    </div>
  );
}

function Satellite({ src, slot, spread, fade }: { src: string; slot: { x: number; y: number }; spread: MotionValue<number>; fade: MotionValue<number> }) {
  const x = useTransform(spread, (s) => `calc(${slot.x * 112}% + ${slot.x * s * 140}%)`);
  const y = useTransform(spread, (s) => `calc(${slot.y * 112}% + ${slot.y * s * 140}%)`);
  return (
    <motion.div style={{ x, y, opacity: fade }} className="absolute h-[30%] w-[22%] min-w-24 overflow-hidden rounded-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover" />
    </motion.div>
  );
}
