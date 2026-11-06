"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface WordsPreloaderProps {
  children: ReactNode;
  /** Words flashed one after another. */
  words?: string[];
  /** ms each word stays on screen (the first one stays longer). */
  interval?: number;
  onComplete?: () => void;
  className?: string;
}

const GREETINGS = ["Hello", "مرحبا", "Bonjour", "Hola", "Ciao", "こんにちは", "Hallo", "Olá"];

/**
 * Greets the visitor in several languages, then the curtain lifts with a
 * curved bottom edge to reveal the page.
 */
export function WordsPreloader({ children, words = GREETINGS, interval = 180, onComplete, className }: WordsPreloaderProps) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (index === words.length - 1) {
      const t = setTimeout(() => setDone(true), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), index === 0 ? 900 : interval);
    return () => clearTimeout(t);
  }, [index, words.length, interval]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <AnimatePresence onExitComplete={onComplete}>
        {!done && (
          <motion.div
            key="curtain"
            role="status"
            aria-label="Loading"
            className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-950 text-white"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.p
              key={index}
              initial={{ opacity: index === 0 ? 0 : 0.6 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-4xl font-medium"
            >
              <span className="size-2.5 rounded-full bg-white" />
              {words[index]}
            </motion.p>
            {/* Curved bottom edge that flattens as the curtain lifts */}
            <svg aria-hidden className="absolute top-full h-24 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                className="fill-neutral-950"
                initial={{ d: "M0 0 L100 0 Q50 100 0 0" }}
                exit={{ d: "M0 0 L100 0 Q50 0 0 0" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
