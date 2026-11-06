"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface LiquidGlassLogoProps {
  /** Your logo — SVG, <img>, or any node. */
  children: ReactNode;
  /** Total length of the intro sequence in ms. */
  duration?: number;
  /** Size of the glass tile in px. */
  size?: number;
  onComplete?: () => void;
  className?: string;
}

type Phase = "drop" | "glass" | "settle";

/**
 * A logo reveal: a droplet falls, splashes into a liquid-glass tile that
 * refracts the logo, ripples spread out — then the glass and waves dissolve,
 * leaving the plain logo on the background at its normal size.
 */
export function LiquidGlassLogo({ children, duration = 3200, size = 132, onComplete, className }: LiquidGlassLogoProps) {
  const [phase, setPhase] = useState<Phase>("drop");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glass"), duration * 0.22);
    const t2 = setTimeout(() => setPhase("settle"), duration * 0.72);
    const t3 = setTimeout(() => onComplete?.(), duration);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [duration, onComplete]);

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size * 2.4, height: size * 2.4 }}>
      {/* Droplet */}
      <AnimatePresence>
        {phase === "drop" && (
          <motion.span
            key="drop"
            className="absolute size-5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-white/70 shadow-[inset_-2px_-3px_6px_rgba(0,0,0,0.15),inset_2px_2px_4px_rgba(255,255,255,0.9),0_6px_12px_rgba(0,0,0,0.15)] backdrop-blur"
            initial={{ y: -size, scaleY: 1.3, opacity: 0 }}
            animate={{ y: 0, scaleY: 1, opacity: 1 }}
            exit={{ scaleX: 2.2, scaleY: 0.3, opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: (duration * 0.2) / 1000, ease: [0.55, 0, 1, 0.45] }}
          />
        )}
      </AnimatePresence>

      {/* Ripples */}
      <AnimatePresence>
        {phase === "glass" &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={`ring-${i}`}
              aria-hidden
              className="absolute rounded-[32%] border border-white/60 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              style={{ width: size, height: size }}
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, delay: i * 0.28, ease: "easeOut" }}
            />
          ))}
      </AnimatePresence>

      {/* Glass tile */}
      <AnimatePresence>
        {phase === "glass" && (
          <motion.div
            key="glass"
            aria-hidden
            className="absolute z-20 overflow-hidden rounded-[32%]"
            style={{
              width: size,
              height: size,
              background: "linear-gradient(145deg, rgba(255,255,255,0.35), rgba(255,255,255,0.06))",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -10px 20px rgba(0,0,0,0.06), inset 8px 8px 18px rgba(255,255,255,0.5), 0 20px 40px -12px rgba(0,0,0,0.25)",
              backdropFilter: "blur(1.5px) saturate(1.8)",
              WebkitBackdropFilter: "blur(1.5px) saturate(1.8)",
            }}
            initial={{ scale: 0.15, borderRadius: "50%", opacity: 0 }}
            animate={{ scale: [0.15, 1.12, 0.96, 1], borderRadius: ["50%", "28%", "34%", "32%"], opacity: 1 }}
            exit={{ scale: 1.3, opacity: 0, filter: "blur(8px)", transition: { duration: 0.6, ease: "easeOut" } }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="absolute -left-1/4 top-0 h-1/2 w-[150%] -rotate-12 bg-gradient-to-b from-white/50 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo — magnified inside the glass, then settles to its real size */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={
          phase === "drop"
            ? { opacity: 0, scale: 0.6, filter: "blur(6px)" }
            : phase === "glass"
              ? { opacity: 1, scale: 1.15, filter: "blur(0.6px)" }
              : { opacity: 1, scale: 1, filter: "blur(0px)" }
        }
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
