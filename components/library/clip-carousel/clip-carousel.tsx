"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ClipSlide {
  src: string;
  title: string;
}

export interface ClipCarouselProps {
  slides: ClipSlide[];
  /** Auto-advance interval (ms), 0 to disable. */
  autoplay?: number;
  className?: string;
}

/**
 * A row of square covers where the active one opens up to a tall poster.
 * The size change is done with clip-path, so nothing reflows — buttery smooth.
 */
export function ClipCarousel({ slides, autoplay = 0, className }: ClipCarouselProps) {
  const [index, setIndex] = useState(0);
  const n = slides.length;
  const go = (i: number) => setIndex(((i % n) + n) % n);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), autoplay);
    return () => clearInterval(t);
  }, [autoplay, n]);

  const W = 168; // slot width
  const GAP = 14;

  return (
    <div
      className={cn("relative w-full select-none overflow-hidden", className)}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div className="relative h-[260px]">
        <motion.div
          className="absolute left-1/2 top-0 flex h-full items-center"
          style={{ gap: GAP }}
          animate={{ x: -(index * (W + GAP) + W / 2) }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -40) go(index + 1);
            else if (info.offset.x > 40) go(index - 1);
          }}
        >
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <motion.button
                key={s.src}
                type="button"
                aria-label={s.title}
                aria-current={active}
                onClick={() => go(i)}
                className="relative h-full shrink-0 overflow-hidden outline-none"
                style={{ width: W }}
                initial={false}
                animate={{
                  clipPath: active ? "inset(0% 0% 0% 0% round 20px)" : "inset(17% 0% 17% 0% round 16px)",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt="" draggable={false} className="h-full w-full object-cover" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>
      <motion.p key={index} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-center text-xs text-neutral-500" aria-live="polite">
        {slides[index]?.title}
      </motion.p>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Go to ${s.title}`}
            onClick={() => go(i)}
            className={cn("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-neutral-900 dark:bg-white" : "w-1.5 bg-neutral-300 dark:bg-neutral-700")}
          />
        ))}
      </div>
      {(["‹", "›"] as const).map((arrow, k) => (
        <button
          key={arrow}
          type="button"
          aria-label={k ? "Next" : "Previous"}
          onClick={() => go(index + (k ? 1 : -1))}
          className={cn(
            "absolute top-[115px] flex size-8 items-center justify-center rounded-full bg-white/90 text-lg text-neutral-700 shadow-sm backdrop-blur dark:bg-neutral-900/90 dark:text-neutral-200",
            k ? "right-2" : "left-2"
          )}
        >
          {arrow}
        </button>
      ))}
    </div>
  );
}
