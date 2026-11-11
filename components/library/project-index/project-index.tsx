"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface IndexProject {
  name: string;
  image: string;
  href?: string;
  /** One quiet line under the name: a year, a field, a client. */
  meta?: string;
}

export interface ProjectIndexProps {
  projects: IndexProject[];
  /** Which project starts selected. */
  defaultIndex?: number;
  className?: string;
}

/**
 * A minimal index: every name on one line, and one framed preview above that
 * wipes to whichever name you point at.
 */
export function ProjectIndex({ projects, defaultIndex = 0, className }: ProjectIndexProps) {
  const [active, setActive] = useState(defaultIndex);
  const current = projects[active];

  return (
    <div className={cn("flex w-full flex-col items-center gap-6 text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em]", className)}>
      <div className="relative aspect-[4/5] w-48 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
        <AnimatePresence initial={false}>
          <motion.img
            key={current?.image}
            src={current?.image}
            alt={current?.name ?? ""}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0.99, transition: { duration: 0.5 } }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          />
        </AnimatePresence>
      </div>

      <p className="h-[1.35em] font-normal opacity-50" aria-live="polite">
        {current?.meta}
      </p>

      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {projects.map((p, i) => (
          <li key={p.name}>
            <a
              href={p.href ?? "#"}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={(e) => !p.href && e.preventDefault()}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "whitespace-nowrap underline-offset-4 outline-none transition-opacity duration-300 focus-visible:underline",
                i === active ? "underline opacity-100" : "opacity-40 hover:opacity-100"
              )}
            >
              {p.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
