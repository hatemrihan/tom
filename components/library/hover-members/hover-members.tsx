"use client";

import { useState } from "react";
import { cn } from "../_lib/cn";

export interface Member {
  name: string;
  role?: string;
  image: string;
}

export interface HoverMembersProps {
  members: Member[];
  /** Shown while nothing is hovered. */
  title: string;
  /** Portrait size at rest, in px. */
  size?: number;
  className?: string;
}

/**
 * A row of small portraits. The one you point at grows, its neighbours lean
 * in, and the caption underneath swaps to that person. Sizes change with
 * plain CSS transitions, so it stays quick with any number of people.
 */
export function HoverMembers({ members, title, size = 36, className }: HoverMembersProps) {
  const [hover, setHover] = useState<number | null>(null);
  const current = hover === null ? null : members[hover];

  return (
    <div className={cn("flex flex-col items-center gap-5 text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em]", className)}>
      <div className="flex items-end gap-1.5" style={{ height: size * 2 }} onMouseLeave={() => setHover(null)}>
        {members.map((m, i) => {
          const distance = hover === null ? 9 : Math.abs(hover - i);
          const scale = distance === 0 ? 2 : distance === 1 ? 1.35 : 1;
          return (
            <button
              key={m.name}
              type="button"
              aria-label={m.role ? `${m.name}, ${m.role}` : m.name}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              style={{ width: size * scale, height: size * scale }}
              className="shrink-0 cursor-pointer overflow-hidden rounded-md bg-neutral-200 outline-none transition-[width,height] duration-200 ease-out will-change-[width,height] focus-visible:ring-2 focus-visible:ring-current"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.image} alt="" draggable={false} decoding="async" className="h-full w-full object-cover object-[50%_20%]" />
            </button>
          );
        })}
      </div>

      <p className="h-[2.7em] text-center" aria-live="polite">
        {current?.name ?? title}
        <br />
        <span className="font-normal opacity-50">{current ? current.role : `${members.length} people`}</span>
      </p>
    </div>
  );
}
