"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

export interface BouncyAccordionProps {
  items: AccordionItem[];
  /** Allow several panels open at once. */
  multiple?: boolean;
  className?: string;
}

/**
 * An accordion with personality: panels spring open with a little overshoot,
 * the open item lifts into its own card, and the icon morphs + → ×.
 */
export function BouncyAccordion({ items, multiple = false, className }: BouncyAccordionProps) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const uid = useId();

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className={cn("w-full max-w-md space-y-2", className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <motion.div
            key={item.title}
            layout
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className={cn(
              "overflow-hidden rounded-2xl border transition-colors",
              isOpen ? "border-neutral-200 bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)] dark:border-neutral-800 dark:bg-neutral-900" : "border-transparent bg-neutral-100 dark:bg-neutral-900/60"
            )}
          >
            <motion.button
              layout="position"
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${uid}-${i}`}
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium text-neutral-900 outline-none dark:text-white"
            >
              {item.title}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm text-white dark:bg-white dark:text-neutral-900"
              >
                +
              </motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { type: "spring", stiffness: 300, damping: 20 }, opacity: { duration: 0.2 } }}
                >
                  <motion.div initial={{ y: -8 }} animate={{ y: 0 }} className="px-4 pb-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.content}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
