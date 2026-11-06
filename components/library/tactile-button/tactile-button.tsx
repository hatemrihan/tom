"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../_lib/cn";

export interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Tone of the button face. */
  tone?: "ink" | "paper" | "signal";
  /** Depth of the edge in px. */
  depth?: number;
}

const TONES = {
  ink: {
    face: "bg-gradient-to-b from-neutral-700 to-neutral-900 text-white",
    edge: "bg-neutral-950",
    rim: "shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.4)]",
  },
  paper: {
    face: "bg-gradient-to-b from-white to-neutral-100 text-neutral-800",
    edge: "bg-neutral-300",
    rim: "shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.06)]",
  },
  signal: {
    face: "bg-gradient-to-b from-orange-400 to-orange-600 text-white",
    edge: "bg-orange-800",
    rim: "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.25)]",
  },
};

/**
 * A physical-feeling button: a shaped face sitting on a solid edge that
 * compresses when pressed. Pure CSS transforms — no layout shift.
 */
export function TactileButton({
  children,
  tone = "ink",
  depth = 6,
  className,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onKeyDown,
  onKeyUp,
  ...props
}: TactileButtonProps) {
  const [pressed, setPressed] = useState(false);
  const t = TONES[tone];
  const travel = pressed ? depth - 1 : 0;

  return (
    <button
      type="button"
      {...props}
      onPointerDown={(e) => {
        setPressed(true);
        onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        setPressed(false);
        onPointerUp?.(e);
      }}
      onPointerLeave={(e) => {
        setPressed(false);
        onPointerLeave?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") setPressed(true);
        onKeyDown?.(e);
      }}
      onKeyUp={(e) => {
        setPressed(false);
        onKeyUp?.(e);
      }}
      className={cn("group relative inline-block select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-4", className)}
      style={{ paddingBottom: depth }}
    >
      {/* Soft ground shadow — tightens as the button goes down */}
      <span
        aria-hidden
        className="absolute inset-x-1 bottom-0 h-3 rounded-[50%] bg-black/25 blur-md transition-all duration-150"
        style={{ opacity: pressed ? 0.35 : 0.7, transform: `scaleX(${pressed ? 0.92 : 1})` }}
      />
      {/* Edge */}
      <span aria-hidden className={cn("absolute inset-x-0 bottom-0 top-[var(--d)] rounded-2xl", t.edge)} style={{ ["--d" as string]: `${depth}px` }} />
      {/* Face */}
      <span
        className={cn(
          "relative flex h-12 items-center justify-center gap-2 rounded-2xl px-7 text-[15px] font-medium tracking-tight",
          t.face,
          t.rim
        )}
        style={{
          transform: `translateY(${travel}px)`,
          transition: pressed
            ? "transform 60ms cubic-bezier(0.3,0,0.5,1)"
            : "transform 260ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {children}
      </span>
    </button>
  );
}
