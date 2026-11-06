"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface SmoothCaretInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  caretClassName?: string;
  className?: string;
}

/**
 * A text input whose caret glides between positions instead of jumping —
 * typing, arrowing and clicking all move it with a soft spring.
 */
export function SmoothCaretInput({ placeholder = "Type something…", value, onChange, caretClassName = "bg-blue-500", className }: SmoothCaretInputProps) {
  const [internal, setInternal] = useState("");
  const v = value ?? internal;
  const input = useRef<HTMLInputElement>(null);
  const mirror = useRef<HTMLSpanElement>(null);
  const [x, setX] = useState(0);
  const [focused, setFocused] = useState(false);
  const [typing, setTyping] = useState(false);

  const sync = () => {
    const el = input.current;
    const m = mirror.current;
    if (!el || !m) return;
    const pos = el.selectionStart ?? v.length;
    m.textContent = el.value.slice(0, pos) || "";
    setX(m.offsetWidth - el.scrollLeft);
  };

  useLayoutEffect(sync);

  useEffect(() => {
    const onSel = () => document.activeElement === input.current && sync();
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  });

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setTyping(false), 500);
    return () => clearTimeout(t);
  }, [typing, v]);

  return (
    <label className={cn("relative block w-full max-w-sm", className)}>
      <span ref={mirror} aria-hidden className="invisible absolute left-4 top-0 whitespace-pre text-lg" />
      <input
        ref={input}
        value={v}
        onChange={(e) => {
          setInternal(e.target.value);
          onChange?.(e.target.value);
          setTyping(true);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-14 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-lg text-neutral-900 caret-transparent outline-none transition focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
      />
      {focused && (
        <motion.span
          aria-hidden
          className={cn("pointer-events-none absolute top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full", caretClassName)}
          initial={false}
          animate={{ x: 16 + x, opacity: typing ? 1 : [1, 1, 0, 0, 1] }}
          transition={{ x: { type: "spring", stiffness: 700, damping: 40 }, opacity: typing ? { duration: 0 } : { duration: 1.1, repeat: Infinity, times: [0, 0.45, 0.5, 0.95, 1] } }}
          style={{ left: 0 }}
        />
      )}
    </label>
  );
}
