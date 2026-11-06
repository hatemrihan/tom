"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface IndexProject {
  name: string;
  image: string;
  href?: string;
  meta?: string;
}

export interface ProjectIndexProps {
  projects: IndexProject[];
  label?: string;
  className?: string;
}

/**
 * A minimal project index: names stacked on the right, a framed preview on
 * the left that wipes to the hovered project. A dot marks the active name.
 */
export function ProjectIndex({ projects, label = "My projects", className }: ProjectIndexProps) {
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <div className={cn("relative grid min-h-[320px] grid-cols-1 gap-8 sm:grid-cols-2", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-900 sm:self-start">
        <AnimatePresence initial={false}>
          <motion.img
            key={current?.image}
            src={current?.image}
            alt={current?.name ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.1 }}
            animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
            exit={{ opacity: 0.6, transition: { duration: 0.6 } }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />
        </AnimatePresence>
        {current?.meta && <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white backdrop-blur">{current.meta}</span>}
      </div>

      <div className="flex flex-col justify-end sm:items-end">
        <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          {label}
          <span className="h-px w-24 bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <ul className="sm:text-right">
          {projects.map((p, i) => (
            <li key={p.name}>
              <a
                href={p.href ?? "#"}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={(e) => !p.href && e.preventDefault()}
                className={cn(
                  "inline-flex items-center gap-2 text-2xl leading-snug tracking-tight transition-colors duration-300 outline-none",
                  i === active ? "text-neutral-900 dark:text-white" : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-600"
                )}
              >
                {p.name}
                <motion.span
                  className="size-1.5 rounded-full bg-current"
                  initial={false}
                  animate={{ scale: i === active ? 1 : 0, opacity: i === active ? 1 : 0 }}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
