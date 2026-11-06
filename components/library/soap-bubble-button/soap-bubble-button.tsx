"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface SoapBubbleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * A translucent, iridescent bubble that wobbles on hover and pops into
 * droplets on click before gently re-forming.
 */
export function SoapBubbleButton({ children, onClick, className }: SoapBubbleButtonProps) {
  const [popped, setPopped] = useState(0);
  const [visible, setVisible] = useState(true);

  const pop = () => {
    if (!visible) return;
    onClick?.();
    setVisible(false);
    setPopped((p) => p + 1);
    window.setTimeout(() => setVisible(true), 900);
  };

  return (
    <div className={cn("relative inline-flex size-36 items-center justify-center", className)}>
      <AnimatePresence>
        {visible && (
          <motion.button
            key={`bubble-${popped}`}
            type="button"
            onClick={pop}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.25, opacity: 0, transition: { duration: 0.12 } }}
            whileHover={{ scaleX: [1, 1.06, 0.97, 1.02, 1], scaleY: [1, 0.95, 1.04, 0.99, 1], transition: { duration: 0.9 } }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
            className="relative flex size-32 items-center justify-center rounded-full text-sm font-medium text-neutral-800 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 dark:text-white"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95) 0 6%, transparent 14%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.35), transparent 30%), conic-gradient(from 200deg, rgba(255,140,200,0.35), rgba(140,200,255,0.35), rgba(160,255,200,0.3), rgba(255,230,140,0.35), rgba(255,140,200,0.35))",
              boxShadow:
                "inset 0 0 18px rgba(255,255,255,0.7), inset -8px -10px 24px rgba(120,160,255,0.25), inset 10px 6px 20px rgba(255,150,220,0.25), 0 10px 30px -10px rgba(120,150,255,0.35)",
              backdropFilter: "blur(2px)",
            }}
          >
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay"
              style={{ background: "conic-gradient(from 0deg, #f9c, #9cf, #9fc, #fe9, #f9c)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            />
            <span className="relative">{children}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Droplets */}
      <AnimatePresence>
        {!visible &&
          Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const d = 70 + (i % 3) * 14;
            return (
              <motion.span
                key={`${popped}-${i}`}
                aria-hidden
                className="absolute size-2 rounded-full bg-sky-200/80 shadow-[inset_0_0_2px_white]"
                initial={{ x: Math.cos(a) * 50, y: Math.sin(a) * 50, scale: 1, opacity: 1 }}
                animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 20, scale: 0.3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            );
          })}
      </AnimatePresence>
    </div>
  );
}
