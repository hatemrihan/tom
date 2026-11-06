"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "../_lib/cn";

export interface SpotlightCardsProps {
  children: ReactNode;
  /** Spotlight colour (any CSS colour). */
  color?: string;
  /** Spotlight radius in px. */
  radius?: number;
  className?: string;
}

/**
 * A group of cards that share one spotlight — the light follows the pointer
 * across the whole grid, lighting card borders and surfaces it passes near.
 * Wrap any number of <SpotlightCard>s. Zero re-renders: CSS variables only.
 */
export function SpotlightCards({ children, color = "rgba(255,255,255,0.18)", radius = 340, className }: SpotlightCardsProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        for (const card of el.querySelectorAll<HTMLElement>("[data-spotlight]")) {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--x", `${e.clientX - r.left}px`);
          card.style.setProperty("--y", `${e.clientY - r.top}px`);
        }
      }}
      onPointerLeave={() => {
        ref.current?.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((c) => {
          c.style.setProperty("--x", "-999px");
          c.style.setProperty("--y", "-999px");
        });
      }}
      style={{ ["--spot" as string]: color, ["--r" as string]: `${radius}px` }}
      className={cn("group/spot grid gap-3", className)}
    >
      {children}
    </div>
  );
}

export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-spotlight
      className={cn("relative overflow-hidden rounded-2xl bg-neutral-900 p-px [--x:-999px] [--y:-999px]", className)}
      style={{
        background:
          "radial-gradient(var(--r) circle at var(--x) var(--y), var(--spot), transparent 60%), rgb(38 38 38)",
      }}
    >
      <div
        className="relative h-full rounded-[15px] bg-neutral-950"
        style={{ backgroundImage: "radial-gradient(calc(var(--r) * 0.8) circle at var(--x) var(--y), rgba(255,255,255,0.06), transparent 60%)" }}
      >
        {children}
      </div>
    </div>
  );
}
