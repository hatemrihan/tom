"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

export interface ModelSelectorProps {
  models?: ModelOption[];
  value?: string;
  onChange?: (id: string) => void;
  className?: string;
}

const DEFAULT_MODELS: ModelOption[] = [
  { id: "swift", name: "Swift", description: "Fast answers for everyday tasks" },
  { id: "balanced", name: "Balanced", description: "Great quality, quick responses", badge: "Default" },
  { id: "deep", name: "Deep", description: "Careful reasoning for hard problems", badge: "New" },
];

/**
 * A compact model picker. The trigger morphs into the menu with a shared
 * layout animation. Full keyboard support: ↑ ↓ Enter Esc.
 */
export function ModelSelector({ models = DEFAULT_MODELS, value, onChange, className }: ModelSelectorProps) {
  const [internal, setInternal] = useState(value ?? models[1]?.id ?? models[0]?.id);
  const selectedId = value ?? internal;
  const selected = models.find((m) => m.id === selectedId) ?? models[0];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const layoutId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const choose = (id: string) => {
    setInternal(id);
    onChange?.(id);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setActive(Math.max(0, models.findIndex((m) => m.id === selectedId)));
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % models.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + models.length) % models.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(models[active].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={root} className={cn("relative inline-block", className)} onKeyDown={onKeyDown}>
      <motion.button
        layoutId={layoutId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        style={{ borderRadius: 12 }}
        className="flex h-9 items-center gap-2 border border-neutral-200 bg-white pl-3 pr-2 text-sm text-neutral-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
      >
        <motion.span layout="position" className="flex items-center gap-2">
          <Spark />
          {selected?.name}
        </motion.span>
        <motion.svg layout="position" animate={{ rotate: open ? 180 : 0 }} viewBox="0 0 16 16" className="size-3.5 text-neutral-400">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-activedescendant={`${listId}-${models[active]?.id}`}
            initial={{ opacity: 0, y: -6, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, scale: 0.97, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
            className="absolute left-0 top-11 z-20 w-72 origin-top-left rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.2)] dark:border-neutral-800 dark:bg-neutral-900"
          >
            {models.map((m, i) => (
              <li
                key={m.id}
                id={`${listId}-${m.id}`}
                role="option"
                aria-selected={m.id === selectedId}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(m.id)}
                className="relative flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5"
              >
                {active === i && (
                  <motion.span
                    layoutId={`${layoutId}-hl`}
                    className="absolute inset-0 rounded-xl bg-neutral-100 dark:bg-neutral-800"
                    transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                  />
                )}
                <div className="relative min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white">
                    {m.name}
                    {m.badge && (
                      <span className="rounded-full bg-neutral-900 px-1.5 py-px text-[10px] font-medium text-white dark:bg-white dark:text-neutral-900">
                        {m.badge}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">{m.description}</p>
                </div>
                <span className="relative mt-0.5 size-4">
                  {m.id === selectedId && (
                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} viewBox="0 0 16 16" className="size-4 text-neutral-900 dark:text-white">
                      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 text-neutral-500" aria-hidden>
      <path d="M8 1.5l1.6 4.2 4.4 1.3-4.4 1.3L8 12.5 6.4 8.3 2 7l4.4-1.3z" fill="currentColor" />
    </svg>
  );
}
