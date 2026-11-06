"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface AiInputProps {
  placeholder?: string;
  suggestions?: string[];
  onSubmit?: (value: string) => void | Promise<void>;
  maxRows?: number;
  className?: string;
}

/**
 * A prompt box that grows with its content, glows while focused, offers
 * one-tap suggestions and morphs its send button into a stop/loader.
 * Enter sends, Shift+Enter adds a new line.
 */
export function AiInput({
  placeholder = "Ask anything…",
  suggestions = ["Summarise this page", "Write a cover letter", "Explain like I'm five"],
  onSubmit,
  maxRows = 6,
  className,
}: AiInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    const line = parseFloat(getComputedStyle(el).lineHeight) || 22;
    el.style.height = `${Math.min(el.scrollHeight, line * maxRows + 8)}px`;
  }, [value, maxRows]);

  const send = async () => {
    const text = value.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      await (onSubmit?.(text) ?? new Promise((r) => setTimeout(r, 1400)));
      setValue("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <div className="relative">
        {/* Animated glow */}
        <motion.div
          aria-hidden
          className="absolute -inset-px rounded-[22px] opacity-0 blur-md"
          style={{ background: "conic-gradient(from var(--a, 0deg), #7c5cff, #21d4fd, #ff5fa2, #7c5cff)" }}
          animate={{ opacity: focused || busy ? 0.55 : 0, "--a": ["0deg", "360deg"] }}
          transition={{ opacity: { duration: 0.3 }, "--a": { duration: 4, repeat: Infinity, ease: "linear" } }}
        />
        <div className="relative rounded-[20px] border border-neutral-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <textarea
            ref={area}
            rows={1}
            value={value}
            placeholder={placeholder}
            aria-label="Prompt"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
            className="block w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-[22px] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
          />
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="px-2 text-[11px] text-neutral-400">{value.length > 0 ? `${value.length} chars` : "Shift + Enter for new line"}</span>
            <motion.button
              type="button"
              onClick={send}
              disabled={!value.trim() && !busy}
              aria-label={busy ? "Generating" : "Send"}
              whileTap={{ scale: 0.92 }}
              className="flex size-9 items-center justify-center rounded-full bg-neutral-900 text-white transition-opacity disabled:opacity-30 dark:bg-white dark:text-neutral-900"
            >
              <AnimatePresence mode="wait" initial={false}>
                {busy ? (
                  <motion.span key="busy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="size-3 rounded-[3px] bg-current" />
                ) : (
                  <motion.svg key="send" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!value && suggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                onClick={() => {
                  setValue(s);
                  area.current?.focus();
                }}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
