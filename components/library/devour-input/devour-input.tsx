"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface DevourInputProps {
  placeholder?: string;
  type?: "email" | "text";
  onSubmit?: (value: string) => void | Promise<void>;
  /** Message shown after submitting. */
  doneLabel?: string;
  className?: string;
}

/**
 * An oversized, borderless input on a hairline. On submit the arrow
 * "devours" the text — letters slide right and shrink into it, one by one.
 */
export function DevourInput({ placeholder = "you@studio.com", type = "email", onSubmit, doneLabel = "Got it — talk soon.", className }: DevourInputProps) {
  const [value, setValue] = useState("");
  const [eating, setEating] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v || (type === "email" && !/^\S+@\S+\.\S+$/.test(v))) {
      input.current?.animate([{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }], { duration: 260 });
      return;
    }
    setEating(v);
    setValue("");
    await onSubmit?.(v);
    setTimeout(() => {
      setEating(null);
      setDone(true);
    }, 300 + v.length * 35);
  };

  return (
    <form onSubmit={submit} className={cn("relative w-full max-w-xl", className)}>
      <div className="relative flex items-center border-b border-neutral-300 dark:border-neutral-700">
        <div className="relative h-16 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.p key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex h-full items-center text-3xl tracking-tight text-neutral-900 dark:text-white">
                {doneLabel}
              </motion.p>
            ) : eating ? (
              <div key="eat" className="flex h-full items-center text-3xl tracking-tight text-neutral-900 dark:text-white" aria-hidden>
                {Array.from(eating).map((ch, i, arr) => (
                  <motion.span
                    key={i}
                    className="inline-block whitespace-pre"
                    initial={{ x: 0, scale: 1, opacity: 1 }}
                    animate={{ x: 500, scale: 0.2, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.45, delay: (arr.length - 1 - i) * 0.035, ease: [0.6, 0, 0.8, 0.4] }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>
            ) : (
              <motion.input
                key="input"
                ref={input}
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="h-full w-full bg-transparent text-3xl tracking-tight text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-600"
              />
            )}
          </AnimatePresence>
        </div>
        <motion.button
          type="submit"
          aria-label="Submit"
          animate={eating ? { scale: [1, 1.35, 1, 1.25, 1], rotate: [0, -8, 0] } : { scale: 1 }}
          transition={{ duration: 0.6 }}
          whileHover={{ x: 4 }}
          className="relative z-10 flex size-12 items-center justify-center bg-[inherit] text-3xl text-neutral-900 dark:text-white"
        >
          →
        </motion.button>
      </div>
      {done && (
        <button type="button" onClick={() => setDone(false)} className="mt-3 text-xs text-neutral-500 underline-offset-4 hover:underline">
          Send another
        </button>
      )}
    </form>
  );
}
