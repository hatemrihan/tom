"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { cn } from "../_lib/cn";

export interface HoldToConfirmProps {
  /** Label shown while idle / holding. */
  children?: ReactNode;
  /** Label shown once confirmed. */
  confirmedLabel?: ReactNode;
  /** How long (ms) the user must hold. */
  holdDuration?: number;
  /** Called once the hold completes. */
  onConfirm: () => void;
  /** Return to idle after this many ms (0 = stay confirmed). */
  resetAfter?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * A destructive-action button that must be pressed and held.
 * The fill is a single motion value — it drains back smoothly if released early.
 * Works with pointer and keyboard (Space / Enter).
 */
export function HoldToConfirm({
  children = "Hold to delete",
  confirmedLabel = "Deleted",
  holdDuration = 1500,
  onConfirm,
  resetAfter = 2000,
  disabled,
  className,
}: HoldToConfirmProps) {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const clip = useTransform(progress, (p) => `inset(0 ${100 - p * 100}% 0 0)`);
  const [confirmed, setConfirmed] = useState(false);
  const holding = useRef(false);
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  const resetTimer = useRef<number | null>(null);

  const start = useCallback(() => {
    if (disabled || confirmed || holding.current) return;
    holding.current = true;
    controls.current?.stop();
    const remaining = (1 - progress.get()) * holdDuration;
    controls.current = animate(progress, 1, {
      duration: remaining / 1000,
      ease: "linear",
      onComplete: () => {
        if (!holding.current) return;
        holding.current = false;
        setConfirmed(true);
        if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(12);
        onConfirm();
        if (resetAfter > 0) {
          resetTimer.current = window.setTimeout(() => {
            setConfirmed(false);
            progress.set(0);
          }, resetAfter);
        }
      },
    });
  }, [confirmed, disabled, holdDuration, onConfirm, progress, resetAfter]);

  const cancel = useCallback(() => {
    if (!holding.current) return;
    holding.current = false;
    controls.current?.stop();
    controls.current = animate(progress, 0, reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 });
  }, [progress, reduce]);

  useEffect(
    () => () => {
      controls.current?.stop();
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    []
  );

  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-label={typeof children === "string" ? `${children} (press and hold)` : undefined}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        start();
      }}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onLostPointerCapture={cancel}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={(e) => (e.key === " " || e.key === "Enter") && cancel()}
      onBlur={cancel}
      whileTap={confirmed ? undefined : { scale: 0.97 }}
      className={cn(
        "relative isolate inline-flex h-10 min-w-44 touch-none select-none items-center justify-center overflow-hidden rounded-xl px-4 text-sm font-medium",
        "border border-red-500/30 bg-red-50 text-red-600 outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2",
        "dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        confirmed && "border-red-600 bg-red-600 text-white dark:bg-red-600 dark:text-white",
        className
      )}
    >
      {confirmed ? (
        <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <motion.path
              d="M3 8.5l3.2 3L13 4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          </svg>
          {confirmedLabel}
        </motion.span>
      ) : (
        <>
          <span className="flex items-center gap-1.5">{children}</span>
          {/* Filled duplicate, revealed by clip-path as progress grows */}
          <motion.span
            aria-hidden
            style={{ clipPath: clip }}
            className="absolute inset-0 flex items-center justify-center gap-1.5 bg-red-600 text-white"
          >
            {children}
          </motion.span>
        </>
      )}
    </motion.button>
  );
}
