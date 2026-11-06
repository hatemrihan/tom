"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface NumberFlowProps {
  value: number;
  /** Intl.NumberFormat options, e.g. { style: "currency", currency: "USD" }. */
  format?: Intl.NumberFormatOptions;
  locale?: string;
  className?: string;
}

const DIGITS = "0123456789";

/**
 * Animated number. Each digit is a vertical reel that spins to its new value;
 * separators and symbols fade in/out as the formatted string changes.
 */
export function NumberFlow({ value, format, locale = "en-US", className }: NumberFlowProps) {
  const parts = useMemo(() => new Intl.NumberFormat(locale, format).format(value), [value, format, locale]);
  // Key characters from the right so the ones/tens columns stay stable.
  const chars = Array.from(parts);

  return (
    <span className={cn("inline-flex items-baseline tabular-nums", className)} aria-label={parts} role="text">
      <AnimatePresence initial={false} mode="popLayout">
        {chars.map((ch, i) => {
          const key = `${chars.length - i}`;
          return DIGITS.includes(ch) ? (
            <motion.span
              key={`d${key}`}
              layout="position"
              initial={{ opacity: 0, y: "0.5em" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-0.5em" }}
              className="relative inline-block h-[1.15em] w-[1ch] overflow-hidden"
              aria-hidden
            >
              <motion.span
                className="absolute left-0 top-0 flex flex-col"
                initial={false}
                animate={{ y: `${-Number(ch) * 1.15}em` }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
              >
                {DIGITS.split("").map((d) => (
                  <span key={d} className="block h-[1.15em] leading-[1.15em]">
                    {d}
                  </span>
                ))}
              </motion.span>
            </motion.span>
          ) : (
            <motion.span
              key={`s${key}${ch}`}
              layout="position"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="inline-block leading-[1.15em]"
              aria-hidden
            >
              {ch === " " ? " " : ch}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </span>
  );
}
