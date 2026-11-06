"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dial?: string;
}

export const COUNTRIES: Country[] = [
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "TR", name: "Türkiye", dial: "+90" },
];

/** Converts "EG" to the 🇪🇬 emoji using regional indicator symbols. */
export const flag = (code: string) =>
  String.fromCodePoint(...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

export interface CountryPickerProps {
  countries?: Country[];
  value?: string;
  onChange?: (code: string) => void;
  className?: string;
}

/**
 * A round flag pill that unfolds into a searchable country list.
 * Type to filter, ↑ ↓ to move, Enter to pick, Esc to close.
 */
export function CountryPicker({ countries = COUNTRIES, value, onChange, className }: CountryPickerProps) {
  const [internal, setInternal] = useState(value ?? countries[0]?.code);
  const selected = countries.find((c) => c.code === (value ?? internal)) ?? countries[0];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const layout = useId();

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries.filter((c) => !q || c.name.toLowerCase().includes(q) || c.dial?.includes(q) || c.code.toLowerCase() === q);
  }, [countries, query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const choose = (code: string) => {
    setInternal(code);
    onChange?.(code);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={root} className={cn("relative inline-block", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {!open ? (
          <motion.button
            key="pill"
            layoutId={layout}
            type="button"
            aria-haspopup="listbox"
            aria-label={`Country: ${selected?.name}`}
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            style={{ borderRadius: 999 }}
            className="flex h-9 items-center gap-1.5 bg-neutral-100 pl-1.5 pr-2.5 text-sm text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <span className="flex size-6 items-center justify-center overflow-hidden rounded-full text-lg leading-none">{selected && flag(selected.code)}</span>
            <svg viewBox="0 0 16 16" className="size-3 opacity-60" aria-hidden>
              <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            layoutId={layout}
            style={{ borderRadius: 18 }}
            className="w-64 overflow-hidden bg-neutral-100 p-1.5 shadow-xl dark:bg-neutral-800"
          >
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, list.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter" && list[active]) {
                  choose(list[active].code);
                } else if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              placeholder="Search country"
              aria-label="Search country"
              className="mb-1 h-9 w-full rounded-xl bg-white px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:bg-neutral-900 dark:text-white"
            />
            <motion.ul
              role="listbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.12 } }}
              className="max-h-56 overflow-y-auto [scrollbar-width:thin]"
            >
              {list.map((c, i) => (
                <li
                  key={c.code}
                  role="option"
                  aria-selected={c.code === selected?.code}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(c.code)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-neutral-800 dark:text-neutral-200",
                    i === active && "bg-white dark:bg-neutral-900"
                  )}
                >
                  <span className="text-lg leading-none">{flag(c.code)}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-xs tabular-nums text-neutral-400">{c.dial}</span>
                </li>
              ))}
              {list.length === 0 && <li className="px-3 py-4 text-center text-xs text-neutral-500">No matches</li>}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
