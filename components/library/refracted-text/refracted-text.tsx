"use client";

import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../_lib/cn";

export interface RefractedTextProps {
  text: string;
  /** Displacement strength in px. */
  strength?: number;
  /** Ripple speed multiplier. */
  speed?: number;
  className?: string;
}

/**
 * Text seen through moving water/glass. An animated SVG turbulence field
 * displaces the glyphs; strength rises near the pointer.
 */
export function RefractedText({ text, strength = 10, speed = 1, className }: RefractedTextProps) {
  const id = useId().replace(/:/g, "");
  const turb = useRef<SVGFETurbulenceElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const boost = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let current = strength;
    const start = performance.now();
    const loop = (now: number) => {
      const t = ((now - start) / 1000) * speed;
      const fx = 0.012 + Math.sin(t * 0.7) * 0.004;
      const fy = 0.05 + Math.cos(t * 0.5) * 0.015;
      turb.current?.setAttribute("baseFrequency", `${fx.toFixed(4)} ${fy.toFixed(4)}`);
      const target = strength + boost.current * strength * 1.8;
      current += (target - current) * 0.08;
      disp.current?.setAttribute("scale", current.toFixed(2));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [strength, speed, reduce]);

  return (
    <span
      onPointerEnter={() => (boost.current = 1)}
      onPointerLeave={() => (boost.current = 0)}
      className={cn("relative inline-block select-none", className)}
    >
      <svg aria-hidden className="absolute size-0">
        <filter id={`refract-${id}`} x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.012 0.05" numOctaves={2} seed={3} result="noise" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="noise" scale={strength} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden
        className="block bg-gradient-to-b from-neutral-900 via-neutral-600 to-neutral-900 bg-clip-text font-semibold tracking-tight text-transparent dark:from-white dark:via-neutral-400 dark:to-white"
        style={{ filter: `url(#refract-${id})` }}
      >
        {text}
      </span>
    </span>
  );
}
