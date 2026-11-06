"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface AutoScaleInputProps {
  placeholder?: string;
  /** Largest font size in px. */
  maxSize?: number;
  /** Smallest font size in px. */
  minSize?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * A headline-sized input that shrinks its text smoothly as you type so the
 * whole value always fits on one line — and grows back when you delete.
 */
export function AutoScaleInput({ placeholder = "Name your project", maxSize = 64, minSize = 18, value, onChange, className }: AutoScaleInputProps) {
  const [internal, setInternal] = useState("");
  const v = value ?? internal;
  const box = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(maxSize);

  useLayoutEffect(() => {
    const m = measure.current;
    const b = box.current;
    if (!m || !b) return;
    const fit = () => {
      // Measure at max size, then scale down proportionally.
      const natural = m.scrollWidth || 1;
      const available = b.clientWidth - 8;
      setSize(Math.max(minSize, Math.min(maxSize, (available / natural) * maxSize)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    return () => ro.disconnect();
  }, [v, maxSize, minSize, placeholder]);

  return (
    <div ref={box} className={cn("relative w-full max-w-xl", className)}>
      <span ref={measure} aria-hidden className="invisible absolute whitespace-pre font-semibold tracking-tight" style={{ fontSize: maxSize }}>
        {v || placeholder}
      </span>
      <motion.input
        value={v}
        onChange={(e) => {
          setInternal(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        animate={{ fontSize: size }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-24 w-full border-b border-neutral-200 bg-transparent font-semibold tracking-tight text-neutral-900 outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-800 dark:text-white dark:placeholder:text-neutral-700 dark:focus:border-white"
      />
    </div>
  );
}
