"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps {
  /** Element that receives the `dark` class. Defaults to <html>. */
  target?: () => HTMLElement;
  /** localStorage key ("" to disable persistence). */
  storageKey?: string;
  onChange?: (dark: boolean) => void;
  className?: string;
}

/**
 * Light/dark toggle. The new theme expands as a circle from the button using
 * the View Transitions API (falls back to an instant switch). The icon morphs
 * between sun and moon.
 */
export function ThemeToggle({
  target = () => document.documentElement,
  storageKey = "theme",
  onChange,
  className,
}: ThemeToggleProps) {
  const button = useRef<HTMLButtonElement>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const el = target();
    let initial = el.classList.contains("dark");
    try {
      const saved = storageKey ? localStorage.getItem(storageKey) : null;
      if (saved) initial = saved === "dark";
    } catch {}
    el.classList.toggle("dark", initial);
    setDark(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: boolean) => {
    target().classList.toggle("dark", next);
    setDark(next);
    onChange?.(next);
    try {
      if (storageKey) localStorage.setItem(storageKey, next ? "dark" : "light");
    } catch {}
  };

  const toggle = () => {
    const next = !dark;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce || !button.current) {
      apply(next);
      return;
    }
    const r = button.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = doc.startViewTransition(() => flushSync(() => apply(next)));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  return (
    <button
      ref={button}
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full text-neutral-700 outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-800",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
        <mask id="theme-toggle-moon">
          <rect width="24" height="24" fill="white" />
          <motion.circle r="7" fill="black" initial={false} animate={dark ? { cx: 17, cy: 7 } : { cx: 30, cy: -6 }} transition={{ type: "spring", bounce: 0.2 }} />
        </mask>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          stroke="none"
          mask="url(#theme-toggle-moon)"
          initial={false}
          animate={{ r: dark ? 8 : 4.5 }}
          transition={{ type: "spring", bounce: 0.3 }}
        />
        <motion.g initial={false} animate={{ opacity: dark ? 0 : 1, rotate: dark ? -45 : 0, scale: dark ? 0.6 : 1 }} style={{ originX: "12px", originY: "12px" }}>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1={12 + Math.cos(a) * 7.5} y1={12 + Math.sin(a) * 7.5} x2={12 + Math.cos(a) * 9.8} y2={12 + Math.sin(a) * 9.8} />;
          })}
        </motion.g>
      </svg>
    </button>
  );
}
