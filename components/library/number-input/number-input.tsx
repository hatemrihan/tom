"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface NumberInputProps {
  /** Maximum digits. */
  digits?: number;
  value?: string;
  onChange?: (value: string) => void;
  prefix?: string;
  className?: string;
}

/**
 * An oversized numeric field. New digits drop in with a spring, deleted ones
 * fall away, and empty slots show ghost zeros. Click anywhere to type.
 */
export function NumberInput({ digits = 6, value, onChange, prefix, className }: NumberInputProps) {
  const [internal, setInternal] = useState("");
  const v = value ?? internal;
  const input = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const ghost = Math.max(0, Math.min(3, digits) - v.length);

  const set = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, digits);
    setInternal(clean);
    onChange?.(clean);
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)} onClick={() => input.current?.focus()}>
      <input
        ref={input}
        inputMode="numeric"
        value={v}
        onChange={(e) => set(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Number"
        className="absolute inset-0 cursor-text opacity-0"
      />
      <div className="pointer-events-none flex h-24 items-center text-7xl font-medium tabular-nums tracking-tight" aria-hidden>
        {prefix && <span className="mr-2 text-neutral-400">{prefix}</span>}
        {Array.from({ length: ghost }).map((_, i) => (
          <span key={`g${i}`} className="text-neutral-300 dark:text-neutral-700">0</span>
        ))}
        <AnimatePresence mode="popLayout" initial={false}>
          {v.split("").map((d, i) => (
            <motion.span
              key={`${i}-${d}`}
              layout
              initial={{ y: -40, opacity: 0, filter: "blur(6px)", scale: 1.2 }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ y: 40, opacity: 0, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              className="inline-block text-neutral-900 dark:text-white"
            >
              {d}
            </motion.span>
          ))}
        </AnimatePresence>
        <motion.span
          className="ml-1 h-16 w-[3px] rounded-full bg-neutral-900 dark:bg-white"
          animate={{ opacity: focused ? [1, 0, 1] : 0 }}
          transition={{ duration: 1, repeat: focused ? Infinity : 0 }}
        />
      </div>
      <p className="mt-2 text-xs text-neutral-400">{focused ? `${v.length}/${digits}` : "Click and type a number"}</p>
    </div>
  );
}
