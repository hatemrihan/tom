"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface HoverNavItem {
  label: string;
  href: string;
}

export interface HoverNavProps {
  items: HoverNavItem[];
  /** href of the current page. */
  active?: string;
  className?: string;
}

/**
 * A top navigation where a soft highlight glides between links as you hover,
 * and a thin underline marks the current page.
 */
export function HoverNav({ items, active, className }: HoverNavProps) {
  const [hover, setHover] = useState<string | null>(null);
  const id = useId();

  return (
    <nav className={cn("relative", className)} onMouseLeave={() => setHover(null)}>
      <ul className="flex items-center">
        {items.map((item) => (
          <li key={item.href} className="relative">
            {hover === item.href && (
              <motion.span
                layoutId={`${id}-hover`}
                className="absolute inset-0 rounded-md bg-neutral-100 dark:bg-neutral-800"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <a
              href={item.href}
              onMouseEnter={() => setHover(item.href)}
              onFocus={() => setHover(item.href)}
              aria-current={active === item.href ? "page" : undefined}
              className={cn(
                "relative block px-3 py-2 text-sm outline-none transition-colors",
                active === item.href || hover === item.href ? "text-neutral-900 dark:text-white" : "text-neutral-500"
              )}
            >
              {item.label}
            </a>
            {active === item.href && (
              <motion.span layoutId={`${id}-active`} className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-neutral-900 dark:bg-white" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
