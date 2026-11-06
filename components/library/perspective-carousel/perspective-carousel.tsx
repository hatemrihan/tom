"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface CarouselSlide {
  src: string;
  title: string;
}

export interface PerspectiveCarouselProps {
  slides: CarouselSlide[];
  /** Auto-advance interval in ms (0 = off). */
  autoplay?: number;
  className?: string;
}

/**
 * A 3D cover-flow carousel. Neighbouring slides turn away in perspective.
 * Drag/swipe, click a side slide, or use ← → keys.
 */
export function PerspectiveCarousel({ slides, autoplay = 0, className }: PerspectiveCarouselProps) {
  const [index, setIndex] = useState(0);
  const n = slides.length;
  const go = (i: number) => setIndex(((i % n) + n) % n);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), autoplay);
    return () => clearInterval(t);
  }, [autoplay, n]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Gallery"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      className={cn("relative h-80 w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-neutral-300", className)}
      style={{ perspective: 1100 }}
    >
      <motion.div
        className="absolute inset-0"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50 || info.velocity.x < -400) go(index + 1);
          else if (info.offset.x > 50 || info.velocity.x > 400) go(index - 1);
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {slides.map((s, i) => {
          // Shortest signed distance on the loop.
          let d = i - index;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const abs = Math.abs(d);
          return (
            <motion.button
              key={s.src}
              type="button"
              aria-label={s.title}
              aria-current={d === 0}
              tabIndex={-1}
              onClick={() => d !== 0 && go(i)}
              className="absolute left-1/2 top-1/2 h-64 w-48 -ml-24 -mt-32 overflow-hidden rounded-2xl bg-neutral-200 shadow-2xl outline-none"
              animate={{
                x: d * 150 - Math.sign(d) * Math.max(abs - 1, 0) * 40,
                z: -abs * 140,
                rotateY: -Math.sign(d) * Math.min(abs, 1) * 48,
                opacity: abs > 2 ? 0 : 1 - abs * 0.18,
                zIndex: 10 - abs,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt="" draggable={false} className="h-full w-full object-cover" />
              <motion.span
                className="absolute inset-0 bg-black"
                animate={{ opacity: Math.min(abs * 0.25, 0.6) }}
              />
            </motion.button>
          );
        })}
      </motion.div>
      <p aria-live="polite" className="absolute inset-x-0 bottom-1 text-center text-sm text-neutral-600 dark:text-neutral-400">
        {slides[index]?.title}
      </p>
    </div>
  );
}
