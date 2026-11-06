"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ExpandableCard {
  id: string;
  title: string;
  value: string;
  icon: ReactNode;
  /** Card colour (any CSS colour). */
  color: string;
  /** Text colour on the card. */
  ink?: string;
  details?: { label: string; value: string }[];
}

export interface ExpandableCardsProps {
  cards: ExpandableCard[];
  className?: string;
}

/**
 * A compact grid of colourful tiles. Tap one and it grows into a full panel
 * (shared-layout morph) with its details; tap outside or press Esc to close.
 */
export function ExpandableCards({ cards, className }: ExpandableCardsProps) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  const active = cards.find((c) => c.id === open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={cn("relative grid w-[300px] grid-cols-2 gap-2.5", className)}>
      {cards.map((c) => (
        <motion.button
          key={c.id}
          type="button"
          layoutId={`${uid}-${c.id}`}
          onClick={() => setOpen(c.id)}
          style={{ backgroundColor: c.color, color: c.ink ?? "#fff", borderRadius: 22 }}
          className="relative flex aspect-[1.15] flex-col justify-between p-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          whileTap={{ scale: 0.96 }}
        >
          <motion.span layoutId={`${uid}-${c.id}-icon`} className="size-6">{c.icon}</motion.span>
          <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-black/15 text-[10px]">•••</span>
          <span>
            <motion.span layoutId={`${uid}-${c.id}-title`} className="block text-sm font-semibold">{c.title}</motion.span>
            <motion.span layoutId={`${uid}-${c.id}-value`} className="block text-xs opacity-75">{c.value}</motion.span>
          </span>
        </motion.button>
      ))}

      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="scrim"
              className="absolute -inset-4 z-10 rounded-[28px] bg-black/0"
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(6px)" }}
              exit={{ backdropFilter: "blur(0px)" }}
              onClick={() => setOpen(null)}
            />
            <motion.div
              key="panel"
              role="dialog"
              aria-label={active.title}
              layoutId={`${uid}-${active.id}`}
              style={{ backgroundColor: active.color, color: active.ink ?? "#fff", borderRadius: 28 }}
              className="absolute inset-0 z-20 flex flex-col p-5"
            >
              <div className="flex items-start justify-between">
                <motion.span layoutId={`${uid}-${active.id}-icon`} className="size-8">{active.icon}</motion.span>
                <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="flex size-7 items-center justify-center rounded-full bg-black/15 text-sm">
                  ✕
                </button>
              </div>
              <motion.span layoutId={`${uid}-${active.id}-title`} className="mt-4 block text-xl font-semibold">{active.title}</motion.span>
              <motion.span layoutId={`${uid}-${active.id}-value`} className="block text-3xl font-semibold tracking-tight">{active.value}</motion.span>
              <motion.dl
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="mt-auto space-y-1.5 text-sm"
              >
                {active.details?.map((d) => (
                  <div key={d.label} className="flex justify-between border-t border-current/15 pt-1.5">
                    <dt className="opacity-70">{d.label}</dt>
                    <dd className="font-medium">{d.value}</dd>
                  </div>
                ))}
              </motion.dl>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
