"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue } from "motion/react";
import { cn } from "../_lib/cn";

export interface SpySection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface ScrollSpyNavProps {
  sections: SpySection[];
  title?: string;
  /**
   * How far down the reading area a heading must travel before its entry
   * becomes active: 0 is the top edge, 0.5 the middle.
   */
  offset?: number;
  /** Start on this section. */
  defaultSection?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * A long-form page with a side index that follows along. A dot marks the
 * current section and a thin rule shows how far through you are. It scrolls
 * on its own and never drags the page behind it.
 */
export function ScrollSpyNav({ sections, title, offset = 0.25, defaultSection, onChange, className }: ScrollSpyNavProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const nodes = useRef<Record<string, HTMLElement | null>>({});
  const [active, setActive] = useState(defaultSection ?? sections[0]?.id);
  const progress = useMotionValue(0); // drives the rule without re-rendering
  const markerId = useId();
  const notify = useRef(onChange);
  useEffect(() => {
    notify.current = onChange;
  });

  const goTo = (id: string, smooth = true) => {
    const node = nodes.current[id];
    const el = scroller.current;
    if (node && el) el.scrollTo({ top: node.offsetTop - 24, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (defaultSection) goTo(defaultSection, false);

    let frame = 0;
    const read = () => {
      frame = 0;
      const max = el.scrollHeight - el.clientHeight;
      progress.set(max > 0 ? el.scrollTop / max : 0);

      // At the very end the last section wins, even if its heading never reaches the line.
      const line = el.scrollTop + el.clientHeight * offset;
      let current = sections[0]?.id;
      if (max > 0 && el.scrollTop >= max - 2) current = sections[sections.length - 1]?.id;
      else for (const s of sections) if ((nodes.current[s.id]?.offsetTop ?? Infinity) <= line) current = s.id;

      setActive((prev) => {
        if (prev !== current && current) notify.current?.(current);
        return current;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, offset]);

  return (
    <div className={cn("grid h-full grid-cols-[150px_1fr] overflow-hidden text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em]", className)}>
      <nav aria-label="On this page" className="relative py-6 pl-5 pr-3">
        {title && <p className="mb-3 text-neutral-900 dark:text-white">{title}</p>}
        <ul>
          {sections.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goTo(s.id)}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "relative flex h-[22px] w-full cursor-pointer items-center truncate text-left uppercase outline-none transition-[color,padding] duration-200 focus-visible:underline",
                    on ? "pl-3 text-neutral-900 dark:text-white" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  {on && <motion.span layoutId={markerId} className="absolute left-0 size-1 rounded-full bg-current" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                  {s.title}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="absolute bottom-6 left-5 right-3 h-px bg-neutral-200 dark:bg-neutral-800">
          <motion.div className="h-full origin-left bg-neutral-900 dark:bg-white" style={{ scaleX: progress }} />
        </div>
      </nav>

      <div ref={scroller} className="relative overflow-y-auto overscroll-contain px-6 py-6">
        {sections.map((s) => (
          <section
            key={s.id}
            ref={(node) => {
              nodes.current[s.id] = node;
            }}
            className="mb-10"
          >
            <h3 className="mb-2 text-neutral-900 dark:text-white">{s.title}</h3>
            <div className="max-w-md space-y-3 text-sm font-normal normal-case leading-relaxed tracking-normal text-neutral-600 dark:text-neutral-400">{s.content}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
