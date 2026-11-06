"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface MusicToggleProps {
  /** Optional audio file to loop while on. */
  src?: string;
  defaultOn?: boolean;
  bars?: number;
  onChange?: (on: boolean) => void;
  className?: string;
}

/**
 * A sound on/off toggle whose equaliser bars dance while playing and settle
 * into a flat line when muted.
 */
export function MusicToggle({ src, defaultOn = false, bars = 5, onChange, className }: MusicToggleProps) {
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
        setOn((o) => !o);
        onChange?.(!on);
      }}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className={cn(
        "inline-flex h-10 items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-4 text-xs font-medium uppercase tracking-[0.15em] text-neutral-700 outline-none transition hover:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
        className
      )}
    >
      {src && <audio ref={audio} src={src} loop preload="none" />}
      <span className="flex h-4 items-center gap-[3px]">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-current"
            animate={on ? { height: ["30%", "100%", "45%", "85%", "30%"] } : { height: "2px" }}
            transition={on ? { duration: 0.9 + (i % 3) * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 } : { duration: 0.3 }}
          />
        ))}
      </span>
      <span className="w-7 text-left">{on ? "On" : "Off"}</span>
    </button>
  );
}
