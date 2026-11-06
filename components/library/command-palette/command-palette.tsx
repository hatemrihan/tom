"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface Command {
  id: string;
  label: string;
  group?: string;
  icon?: ReactNode;
  shortcut?: string;
  keywords?: string[];
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  commands: Command[];
  /** Controlled open state. Leave undefined to use ⌘K / Ctrl+K. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  /** Render inline instead of as a modal (for embedding in pages/demos). */
  inline?: boolean;
  className?: string;
}

/** Simple fuzzy score: all query chars must appear in order. Higher = better. */
function score(text: string, query: string) {
  if (!query) return 1;
  const t = text.toLowerCase();
  let ti = 0;
  let s = 0;
  for (const ch of query.toLowerCase()) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return 0;
    s += found === ti ? 3 : 1; // reward consecutive matches
    ti = found + 1;
  }
  return s + (t.startsWith(query.toLowerCase()) ? 5 : 0);
}

/**
 * A ⌘K command palette: fuzzy search, grouped results, a sliding highlight,
 * full keyboard control. Works as a modal or inline.
 */
export function CommandPalette({ commands, open: controlled, onOpenChange, placeholder = "Type a command or search…", inline = false, className }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = inline || (controlled ?? internalOpen);
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const hl = useId();
  const listId = useId();

  useEffect(() => {
    if (inline) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setInternalOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inline]);

  const results = useMemo(
    () =>
      commands
        .map((c) => ({ c, s: Math.max(score(c.label, query), ...(c.keywords ?? []).map((k) => score(k, query) - 1)) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((r) => r.c),
    [commands, query]
  );

  const groups = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const c of results) {
      const g = query ? "Results" : c.group ?? "Commands";
      map.set(g, [...(map.get(g) ?? []), c]);
    }
    return [...map.entries()];
  }, [results, query]);
  const flat = groups.flatMap(([, items]) => items);

  const run = (c?: Command) => {
    if (!c) return;
    c.onSelect?.();
    if (!inline) setOpen(false);
    setQuery("");
  };

  const panel = (
    <motion.div
      initial={inline ? false : { opacity: 0, scale: 0.96, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -6, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn("w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900", className)}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label="Command palette"
    >
      <div className="flex items-center gap-3 border-b border-neutral-100 px-4 dark:border-neutral-800">
        <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          ref={input}
          autoFocus={!inline}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, flat.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              run(flat[active]);
            } else if (e.key === "Escape" && !inline) {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          aria-label="Search commands"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          className="h-12 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
        />
        {!inline && <kbd className="rounded border border-neutral-200 px-1.5 text-[10px] text-neutral-400 dark:border-neutral-700">esc</kbd>}
      </div>
      <div id={listId} role="listbox" className="max-h-72 overflow-y-auto p-1.5">
        {flat.length === 0 && <p className="py-10 text-center text-sm text-neutral-500">No results for “{query}”.</p>}
        {groups.map(([group, items]) => (
          <div key={group} className="mb-1">
            <p className="px-2.5 pb-1 pt-2 text-[11px] font-medium text-neutral-400">{group}</p>
            {items.map((c) => {
              const i = flat.indexOf(c);
              return (
                <div
                  key={c.id}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(c)}
                  className="relative flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  {i === active && <motion.span layoutId={hl} className="absolute inset-0 rounded-lg bg-neutral-100 dark:bg-neutral-800" transition={{ type: "spring", stiffness: 600, damping: 40 }} />}
                  <span className="relative size-4 text-neutral-500 [&>svg]:size-full">{c.icon}</span>
                  <span className="relative flex-1 truncate text-neutral-900 dark:text-white">{c.label}</span>
                  {c.shortcut && <kbd className="relative rounded border border-neutral-200 px-1.5 font-sans text-[10px] text-neutral-400 dark:border-neutral-700">{c.shortcut}</kbd>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );

  if (inline) return panel;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 px-4 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          {panel}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
