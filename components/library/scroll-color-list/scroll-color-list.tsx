"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface ColorListItem {
  title: string;
  tag: string;
  meta?: string;
  /** Background colour while this item is active. */
  color: string;
  image?: string;
  href?: string;
}

export interface ScrollColorListProps {
  items: ColorListItem[];
  /** Where the "focus line" sits, as a fraction of the container height. */
  focus?: number;
  /** Play a soft tick + haptic each time the active item changes. */
  tick?: boolean;
  className?: string;
}

const COPIES = 3;

/**
 * An endless list of oversized titles. Whichever row crosses the focus line
 * turns solid, the whole surface tints to that item's colour, and a preview
 * card swaps in. Scroll (or use ↑ ↓) inside it — it loops forever.
 */
export function ScrollColorList({ items, focus = 0.55, tick = false, className }: ScrollColorListProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const lastActive = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const n = items.length;

  const playTick = useCallback(() => {
    if (!tick) return;
    try {
      navigator.vibrate?.(4);
      const ctx = (audio.current ??= new AudioContext());
      if (ctx.state !== "running") return; // browsers need a prior user gesture
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 2200;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {}
  }, [tick]);

  // Start in the middle copy so there is room to loop both ways.
  useLayoutEffect(() => {
    const el = scroller.current;
    const first = rows.current[n];
    if (el && first) el.scrollTop = first.offsetTop - el.clientHeight * focus + first.offsetHeight / 2;
  }, [n, focus]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const setHeight = (rows.current[n]?.offsetTop ?? 0) - (rows.current[0]?.offsetTop ?? 0);
      // Seamless loop: jump by one full copy when drifting into the outer copies.
      if (setHeight > 0) {
        if (el.scrollTop < setHeight * 0.5) el.scrollTop += setHeight;
        else if (el.scrollTop > setHeight * 1.5) el.scrollTop -= setHeight;
      }
      const line = el.scrollTop + el.clientHeight * focus;
      let best = 0;
      let bestDist = Infinity;
      rows.current.forEach((row, i) => {
        if (!row) return;
        const d = Math.abs(row.offsetTop + row.offsetHeight / 2 - line);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      const next = best % n;
      if (next !== lastActive.current) {
        lastActive.current = next;
        setActive(next);
        playTick();
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n, focus, playTick]);

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    const row = rows.current[n + active];
    if (el && row) el.scrollBy({ top: dir * row.offsetHeight, behavior: "smooth" });
  };

  const current = items[active];

  return (
    <motion.div
      className={cn("relative h-full w-full overflow-hidden", className)}
      animate={{ backgroundColor: current?.color }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        ref={scroller}
        tabIndex={0}
        role="listbox"
        aria-label="Projects"
        aria-activedescendant={`scl-${active}`}
        onPointerDown={() => audio.current?.resume().catch(() => {})}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            step(e.key === "ArrowDown" ? 1 : -1);
          }
          if (e.key === "Enter" && current?.href) window.open(current.href, "_blank", "noopener");
        }}
        className="h-full overflow-y-auto overscroll-contain px-6 outline-none [scrollbar-width:none] md:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: COPIES }).flatMap((_, copy) =>
          items.map((item, i) => {
            const isActive = i === active;
            const index = copy * n + i;
            return (
              <div
                key={index}
                id={copy === 1 ? `scl-${i}` : undefined}
                role={copy === 1 ? "option" : undefined}
                aria-selected={copy === 1 ? isActive : undefined}
                aria-hidden={copy !== 1}
                ref={(node) => {
                  rows.current[index] = node;
                }}
                className="flex items-center gap-4 py-2 md:gap-6"
              >
                <span
                  className={cn(
                    "whitespace-nowrap text-[clamp(1.6rem,4vw,2.75rem)] font-medium leading-[1.2] tracking-[-0.035em] transition-colors duration-300",
                    isActive ? "text-neutral-950" : "text-black/[0.13]"
                  )}
                >
                  {item.href && isActive ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" tabIndex={-1} className="outline-none">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </span>
                <span
                  className={cn(
                    "hidden shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300 sm:inline-block",
                    isActive ? "bg-white/45 text-neutral-950" : "bg-black/[0.04] text-black/20"
                  )}
                >
                  {item.tag}
                </span>
                {item.meta && (
                  <span className={cn("hidden shrink-0 text-sm transition-colors duration-300 md:inline", isActive ? "text-neutral-950" : "text-black/20")}>
                    [{item.meta}]
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Preview card */}
      <div className="pointer-events-none absolute inset-y-6 right-6 hidden w-[min(38%,360px)] md:block">
        <AnimatePresence initial={false}>
          {current?.image && (
            <motion.img
              key={current.image + active}
              src={current.image}
              alt=""
              className="absolute inset-0 h-full w-full rounded-xl object-contain object-right"
              initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
