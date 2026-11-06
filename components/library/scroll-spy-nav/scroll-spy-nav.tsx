"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface SpySection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface ScrollSpyNavProps {
  sections: SpySection[];
  title?: string;
  className?: string;
}

/**
 * A long-form page with a side index that follows along — the active entry
 * gets a sliding marker, and a thin bar shows how far through it you are.
 * Self-contained scroll area; click an entry to glide to it.
 */
export function ScrollSpyNav({ sections, title, className }: ScrollSpyNavProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const [active, setActive] = useState(sections[0]?.id);
  const [progress, setProgress] = useState(0);
  const markerId = useId();

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const line = el.scrollTop + el.clientHeight * 0.3;
      let current = sections[0]?.id;
      for (const s of sections) {
        const node = refs.current[s.id];
        if (node && node.offsetTop <= line) current = s.id;
      }
      setActive(current);
      setProgress(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <div className={cn("grid h-full grid-cols-[180px_1fr] overflow-hidden", className)}>
      <nav aria-label="On this page" className="relative border-r border-neutral-200 py-6 pl-4 pr-3 dark:border-neutral-800">
        {title && <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">{title}</p>}
        <ul className="space-y-0.5">
          {sections.map((s) => (
            <li key={s.id} className="relative">
              {active === s.id && (
                <motion.span layoutId={markerId} className="absolute inset-0 rounded-md bg-neutral-100 dark:bg-neutral-800" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
              <button
                type="button"
                onClick={() => {
                  const node = refs.current[s.id];
                  if (node && scroller.current) scroller.current.scrollTo({ top: node.offsetTop - 16, behavior: "smooth" });
                }}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "relative block w-full truncate rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors",
                  active === s.id ? "text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                )}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-6 left-4 right-3 h-0.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <motion.div className="h-full origin-left bg-neutral-900 dark:bg-white" style={{ scaleX: progress }} />
        </div>
      </nav>
      <div ref={scroller} className="relative overflow-y-auto px-8 py-6">
        {sections.map((s) => (
          <section
            key={s.id}
            id={s.id}
            ref={(node) => {
              refs.current[s.id] = node;
            }}
            className="mb-10 scroll-mt-4"
          >
            <h3 className="mb-3 text-lg font-medium text-neutral-900 dark:text-white">{s.title}</h3>
            <div className="space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{s.content}</div>
          </section>
        ))}
        <div className="h-[40%]" />
      </div>
    </div>
  );
}
