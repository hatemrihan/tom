"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../_lib/cn";

export interface ScrollFadeListProps {
  children: ReactNode;
  /** Max height of the scroll area (px). */
  maxHeight?: number;
  /** Size of the fade at each edge (px). */
  fade?: number;
  className?: string;
}

/**
 * A scroll container whose top/bottom edges softly fade — but only when there
 * is actually more content in that direction.
 */
export function ScrollFadeList({ children, maxHeight = 280, fade = 40, className }: ScrollFadeListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const top = el.scrollTop > 1;
      const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      setEdges((e) => (e.top === top && e.bottom === bottom ? e : { top, bottom }));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const mask = `linear-gradient(to bottom, transparent 0, #000 ${edges.top ? fade : 0}px, #000 calc(100% - ${edges.bottom ? fade : 0}px), transparent 100%)`;

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={cn(
        "overflow-y-auto overscroll-contain outline-none [scrollbar-width:thin] focus-visible:ring-2 focus-visible:ring-neutral-300",
        className
      )}
      style={{ maxHeight, WebkitMaskImage: mask, maskImage: mask }}
    >
      <div>{children}</div>
    </div>
  );
}
