"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ReceiveButtonProps {
  /** Address / link / handle people can copy. */
  address: string;
  label?: string;
  className?: string;
}

function hashCells(text: string, size: number) {
  let h = 2166136261;
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    h ^= text.charCodeAt(i % text.length) + i;
    h = Math.imul(h, 16777619);
    cells.push(((h >>> 0) & 3) === 0 || ((h >>> 3) & 1) === 1);
  }
  return cells;
}

/**
 * A bright pill that unfolds into a receive card: a code-like pattern
 * generated from the address, the address itself, and a copy button.
 */
export function ReceiveButton({ address, label = "Receive", className }: ReceiveButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const size = 15;
  const cells = useMemo(() => hashCells(address, size), [address]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Finder squares in three corners, like a real scannable code.
  const isFinder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 4 && c >= c0 && c < c0 + 4;
    return inBox(0, 0) || inBox(0, size - 4) || inBox(size - 4, 0);
  };

  return (
    <div ref={root} className={cn("relative flex justify-center", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {!open ? (
          <motion.button
            key="pill"
            layoutId={id}
            type="button"
            onClick={() => setOpen(true)}
            style={{ borderRadius: 999 }}
            whileTap={{ scale: 0.97 }}
            className="h-11 w-56 bg-sky-500 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-8px_rgba(14,165,233,0.7)] outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <motion.span layoutId={`${id}-label`} className="inline-block">{label}</motion.span>
          </motion.button>
        ) : (
          <motion.div
            key="card"
            layoutId={id}
            role="dialog"
            aria-label={label}
            style={{ borderRadius: 28 }}
            className="w-64 bg-sky-500 p-4 text-white shadow-[0_20px_40px_-15px_rgba(14,165,233,0.7)]"
          >
            <div className="flex items-center justify-between">
              <motion.span layoutId={`${id}-label`} className="text-sm font-semibold">{label}</motion.span>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="flex size-7 items-center justify-center rounded-full bg-white/20 text-xs">
                ✕
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { delay: 0.12 } }}
              className="mt-4 rounded-2xl bg-white p-3"
            >
              <div className="grid aspect-square gap-[2px]" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                {cells.map((on, i) => {
                  const r = Math.floor(i / size);
                  const c = i % size;
                  const finder = isFinder(r, c);
                  return (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15 + (r + c) * 0.012 }}
                      className={cn("rounded-[2px]", finder ? "bg-neutral-900" : on ? "bg-neutral-800" : "bg-transparent")}
                    />
                  );
                })}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="mt-3 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-lg bg-white/15 px-2.5 py-2 font-mono text-[11px]">{address}</code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(address).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="h-8 shrink-0 rounded-lg bg-white px-3 text-xs font-semibold text-sky-600"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
