"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface Member {
  name: string;
  role?: string;
  image: string;
}

export interface HoverMembersProps {
  members: Member[];
  /** Big headline under the row. Replaced by the hovered member's name. */
  title: string;
  className?: string;
}

/**
 * A row of tiny portraits above an oversized headline. Hovering a portrait
 * magnifies it and its neighbours (dock-style) and swaps the headline for
 * that person's name.
 */
export function HoverMembers({ members, title, className }: HoverMembersProps) {
  const [hover, setHover] = useState<number | null>(null);
  const label = hover !== null ? members[hover].name : title;

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="flex h-16 items-end gap-1.5" onMouseLeave={() => setHover(null)}>
        {members.map((m, i) => {
          const d = hover === null ? 99 : Math.abs(hover - i);
          const scale = d === 0 ? 1.9 : d === 1 ? 1.35 : 1;
          return (
            <motion.button
              key={m.name}
              type="button"
              aria-label={m.name}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              animate={{ width: 32 * scale, height: 32 * scale, borderRadius: d === 0 ? 10 : 7 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="relative shrink-0 overflow-hidden bg-neutral-800 outline-none ring-white/60 focus-visible:ring-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.image} alt="" draggable={false} className="h-full w-full object-cover" />
            </motion.button>
          );
        })}
      </div>

      <div className="relative w-full overflow-hidden text-center" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.h2
            key={label}
            initial={{ y: "60%", opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-60%", opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="whitespace-nowrap text-[clamp(2.5rem,11vw,9rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]"
          >
            {label}
          </motion.h2>
        </AnimatePresence>
        <AnimatePresence>
          {hover !== null && members[hover].role && (
            <motion.p
              key={members[hover].role}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-xs uppercase tracking-[0.3em] opacity-60"
            >
              {members[hover].role}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
