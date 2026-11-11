"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface MusicToggleProps {
  /** Optional audio file to loop while on. */
  src?: string;
  defaultOn?: boolean;
  /** Number of equaliser bars. */
  bars?: number;
  /** Text beside the bars. */
  labels?: { on: string; off: string };
  onChange?: (on: boolean) => void;
  className?: string;
}

/**
 * A sound switch reduced to the essentials: a few bars that move while the
 * sound is on and rest as dots when it is off, and one word.
 */
export function MusicToggle({
  src,
  defaultOn = false,
  bars = 4,
  labels = { on: "Sound on", off: "Sound off" },
  onChange,
  className,
}: MusicToggleProps) {
  const [on, setOn] = useState(defaultOn);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    if (on) el.play().catch(() => setOn(false));
    else el.pause();
  }, [on]);

  return (
    <button
      type="button"
      onClick={() => {
        setOn(!on);
        onChange?.(!on);
      }}
      aria-pressed={on}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-[11px] font-medium uppercase leading-none tracking-[0.01em] outline-none transition-colors focus-visible:underline",
        on ? "text-neutral-900 dark:text-white" : "text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white",
        className
      )}
    >
      {src && <audio ref={audio} src={src} loop preload="none" />}
      <span aria-hidden className="flex h-[11px] items-center gap-[2px]">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.span
            key={i}
            className="w-[2px] bg-current"
            animate={on ? { height: ["25%", "100%", "45%", "80%", "25%"] } : { height: "2px" }}
            transition={on ? { duration: 0.9 + (i % 3) * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 } : { duration: 0.25 }}
          />
        ))}
      </span>
      {on ? labels.on : labels.off}
    </button>
  );
}
