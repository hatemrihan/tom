"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface TimelineDay {
  date: string; // e.g. "September 30"
  weekday: string;
  tasks: string[];
}

export interface TimelineChecklistProps {
  days: TimelineDay[];
  className?: string;
}

/**
 * A calm agenda: sticky day headers, tasks you can tick off with an animated
 * check and strike-through, and a live "x of y done" counter per day.
 */
export function TimelineChecklist({ days, className }: TimelineChecklistProps) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <div className={cn("relative overflow-y-auto", className)}>
      {days.map((day) => {
        const count = day.tasks.filter((t) => done[`${day.date}|${t}`]).length;
        return (
          <section key={day.date} className="pb-8">
            <header className="sticky top-0 z-10 mb-3 flex items-baseline justify-between border-b border-neutral-200 bg-white/90 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
              <h3 className="text-lg font-medium tracking-tight text-neutral-900 dark:text-white">
                {day.date} <span className="text-neutral-400">/ {day.weekday}</span>
              </h3>
              <span className="text-xs tabular-nums text-neutral-400">
                {count}/{day.tasks.length}
              </span>
            </header>
            <ul className="space-y-1">
              {day.tasks.map((task) => {
                const key = `${day.date}|${task}`;
                const checked = !!done[key];
                return (
                  <li key={key}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
                      className="group flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                    >
                      <motion.span
                        animate={{ scale: checked ? [1, 0.8, 1.1, 1] : 1 }}
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                          checked ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white" : "border-neutral-300 group-hover:border-neutral-500 dark:border-neutral-700"
                        )}
                      >
                        <AnimatePresence>
                          {checked && (
                            <motion.svg viewBox="0 0 16 16" className="size-2.5 text-white dark:text-neutral-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <motion.path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }} />
                            </motion.svg>
                          )}
                        </AnimatePresence>
                      </motion.span>
                      <span className="relative text-sm text-neutral-700 dark:text-neutral-300">
                        <span className={cn("transition-colors duration-300", checked && "text-neutral-400")}>{task}</span>
                        <motion.span
                          aria-hidden
                          className="absolute left-0 top-1/2 h-px w-full origin-left bg-neutral-400"
                          initial={false}
                          animate={{ scaleX: checked ? 1 : 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
