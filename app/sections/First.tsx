"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ScrollProgress } from "@/components/ui/scroll-progress";

/** Pixels of scroll over which the hero video shrinks to its smallest size. */
const SHRINK_DISTANCE = 2500;

const MARQUEE_TEXT = "Wanna Hire This Guy?";

/**
 * Hero: a full-screen video that shrinks into the centre as you scroll,
 * revealing a marquee behind it. Driven by motion values, so scrolling never
 * triggers React re-renders (only the 40% threshold flips state once).
 */
const First = () => {
  const { scrollY } = useScroll();
  const [isMinimized, setIsMinimized] = useState(false);

  const progress = useTransform(scrollY, [0, SHRINK_DISTANCE], [0, 1], { clamp: true });
  const width = useTransform(progress, (p) => `${100 - p * 95}vw`);
  const height = useTransform(progress, (p) => `${100 - p * 90}vh`);
  const scale = useTransform(progress, (p) => 1 - p * 0.99);

  useMotionValueEvent(progress, "change", (p) => {
    const next = p > 0.4;
    setIsMinimized((current) => (current === next ? current : next));
  });

  return (
    <>
      {isMinimized && <ScrollProgress />}

      <section aria-label="Intro" className="relative min-h-screen bg-[#f2f2f2]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          {/* Marquee revealed behind the shrinking video */}
          <motion.div
            aria-hidden={!isMinimized}
            className="absolute inset-0 z-0 flex items-center overflow-hidden"
            initial={false}
            animate={{ opacity: isMinimized ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex animate-marquee-left whitespace-nowrap will-change-transform">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  aria-hidden={i > 0}
                  className="pr-[0.5em] text-5xl font-bold uppercase tracking-wider text-black sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
                >
                  {MARQUEE_TEXT}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative z-20 will-change-transform"
            style={{ width, height, scale }}
          >
            <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/videos/hatem-poster.jpg"
              aria-label="Hatem at work"
            >
              <source src="/videos/hatem.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>

        {/* Scroll runway */}
        <div className="h-[300vh]" />
      </section>
    </>
  );
};

export default First;
