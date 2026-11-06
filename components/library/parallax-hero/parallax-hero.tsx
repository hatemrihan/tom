"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "../_lib/cn";

export interface ParallaxHeroProps {
  image: string;
  eyebrow?: string;
  title: string;
  body?: string;
  /** Scroll container to track (defaults to the window). */
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * An editorial project hero: a full-bleed image that zooms out and drifts as
 * you scroll, while a paper panel slides up over it carrying the title.
 */
export function ParallaxHero({ image, eyebrow = "Case study", title, body, container, className }: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const dim = useTransform(scrollYProgress, [0, 0.8], [0, 0.45]);
  const titleY = useTransform(scrollYProgress, [0, 0.6], [80, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="sticky top-0 h-[70vh] min-h-[320px] overflow-hidden">
        <motion.img src={image} alt="" style={{ scale, y }} className="h-full w-full object-cover grayscale" />
        <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black" />
      </div>
      <div className="relative z-10 -mt-[18vh] rounded-t-[28px] bg-[#f6f3ec] px-6 pb-20 pt-10 text-center text-neutral-900">
        <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">{eyebrow}</p>
        <motion.h2 style={{ y: titleY, opacity: titleOpacity }} className="mt-4 text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
          {title}
        </motion.h2>
        {body && <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-neutral-600">{body}</p>}
        <span className="mx-auto mt-8 flex size-9 items-center justify-center rounded-full bg-neutral-900 text-white">↓</span>
      </div>
    </div>
  );
}
