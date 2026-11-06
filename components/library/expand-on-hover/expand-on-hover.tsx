"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ExpandItem {
  src: string;
  title: string;
  subtitle?: string;
}

export interface ExpandOnHoverProps {
  items: ExpandItem[];
  /** Index expanded by default. */
  defaultIndex?: number;
  /** Lay panels out vertically instead. */
  vertical?: boolean;
  className?: string;
}

/**
 * A row (or column) of image panels; the hovered/focused one expands while the
 * others compress. Captions slide in on the active panel.
 */
export function ExpandOnHover({ items, defaultIndex = 0, vertical = false, className }: ExpandOnHoverProps) {
  const [active, setActive] = useState(defaultIndex);

  return (
    <div className={cn("flex w-full gap-2", vertical ? "h-[420px] flex-col" : "h-72 flex-row", className)}>
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <motion.button
            key={item.src}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-expanded={isActive}
            animate={{ flexGrow: isActive ? 5 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
            className="relative min-h-0 min-w-0 basis-0 overflow-hidden rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
            <motion.div
              animate={{ opacity: isActive ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 p-4 text-white"
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }}
              transition={{ duration: 0.35, delay: isActive ? 0.12 : 0 }}
            >
              <p className="whitespace-nowrap text-base font-medium">{item.title}</p>
              {item.subtitle && <p className="whitespace-nowrap text-xs text-white/70">{item.subtitle}</p>}
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
