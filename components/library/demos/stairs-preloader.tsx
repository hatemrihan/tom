"use client";

import { useEffect, useRef, useState } from "react";
import { StairsPreloader } from "../stairs-preloader/stairs-preloader";

/** Public-domain portraits, via Wikimedia Commons. */
const ITEMS = [
  { name: "Marie Curie", year: "c. 1920", note: "Radioactivity", image: "/people/curie.jpg" },
  { name: "Albert Einstein", year: "1921", note: "Photoelectric effect", image: "/people/einstein.jpg" },
  { name: "Niels Bohr", year: "c. 1922", note: "Atomic structure", image: "/people/bohr.jpg" },
  { name: "Richard Feynman", year: "1939", note: "MIT yearbook portrait", image: "/people/feynman.jpg" },
  { name: "Paul Dirac", year: "1933", note: "Quantum mechanics", image: "/people/dirac.jpg" },
  { name: "Erwin Schrödinger", year: "c. 1933", note: "Wave mechanics", image: "/people/schrodinger.jpg" },
  { name: "Robert Oppenheimer", year: "c. 1946", note: "Los Alamos", image: "/people/oppenheimer.jpg" },
  { name: "Nikola Tesla", year: "c. 1890", note: "Alternating current", image: "/people/tesla.jpg" },
];

const W = 260; // the focused image
const H = 190;
const THUMB = 0.28; // thumbnails are the same image, scaled down

export default function StairsPreloaderDemo() {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(3);
  const index = useRef(active);

  const go = (next: number) => {
    const clamped = Math.min(ITEMS.length - 1, Math.max(0, next));
    index.current = clamped;
    setActive(clamped);
  };

  // One portrait per scroll gesture. At either end the page scrolls as normal.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let travelled = 0;
    let lockedUntil = 0;
    const onWheel = (e: WheelEvent) => {
      const direction = Math.sign(e.deltaY);
      const next = index.current + direction;
      if (next < 0 || next >= ITEMS.length) return;
      e.preventDefault();
      const now = performance.now();
      if (now < lockedUntil) return;
      travelled += e.deltaY;
      if (Math.abs(travelled) < 30) return;
      travelled = 0;
      lockedUntil = now + 260;
      go(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Touch and mouse drag.
  const drag = useRef<number | null>(null);

  const corner = "absolute size-2.5 border-neutral-900";
  const current = ITEMS[active];

  return (
    <StairsPreloader className="w-full rounded-2xl" label="Loading archive" duration={2200}>
      <div
        ref={stage}
        tabIndex={0}
        role="group"
        aria-label="Portraits. Scroll, drag or use the arrow keys."
        onKeyDown={(e) => {
          const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
          if (!step) return;
          e.preventDefault();
          go(active + step);
        }}
        onPointerDown={(e) => (drag.current = e.clientY)}
        onPointerMove={(e) => {
          if (drag.current === null) return;
          const moved = e.clientY - drag.current;
          if (Math.abs(moved) < 40) return;
          drag.current = e.clientY;
          go(index.current - Math.sign(moved));
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        className="relative h-[540px] touch-none select-none overflow-hidden bg-white font-mono text-[11px] uppercase leading-[1.4] tracking-[0.02em] text-neutral-900 outline-none"
      >
        {/* every portrait sits at the centre and is moved by its distance from the focused one */}
        {ITEMS.map((item, i) => {
          const d = i - active;
          const away = Math.abs(d);
          const y = d === 0 ? 0 : Math.sign(d) * (H / 2 + 18 + (H * THUMB) / 2 + (away - 1) * (H * THUMB + 10));
          return (
            <button
              key={item.name}
              type="button"
              aria-label={item.name}
              aria-current={d === 0}
              tabIndex={-1}
              onClick={() => go(i)}
              className="absolute left-1/2 top-1/2 cursor-pointer outline-none transition-[transform,filter,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: W,
                height: H,
                marginLeft: -W / 2,
                marginTop: -H / 2,
                transform: `translateY(${y}px) scale(${d === 0 ? 1 : THUMB})`,
                filter: d === 0 ? "blur(0px)" : `blur(${6 + away * 5}px)`,
                opacity: away > 3 ? 0 : d === 0 ? 1 : 0.9 - away * 0.15,
                zIndex: d === 0 ? 2 : 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" draggable={false} className="h-full w-full object-cover object-[50%_18%] grayscale" />
            </button>
          );
        })}

        {/* fixed frame and labels around the centre */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={{ width: W + 18, height: H + 18 }}>
          <span className={`${corner} left-0 top-0 border-l border-t`} />
          <span className={`${corner} right-0 top-0 border-r border-t`} />
          <span className={`${corner} bottom-0 left-0 border-b border-l`} />
          <span className={`${corner} bottom-0 right-0 border-b border-r`} />
          <p className="absolute right-full top-1/2 mr-5 w-48 -translate-y-1/2 text-right">
            <span className="text-neutral-500">
              {String(active + 1).padStart(2, "0")}/{String(ITEMS.length).padStart(2, "0")}
            </span>
            <br />
            {current.name}
          </p>
          <p className="absolute left-full top-1/2 ml-5 w-48 -translate-y-1/2">
            <span className="text-neutral-500">{current.year}</span>
            <br />
            {current.note}
          </p>
        </div>

        <p className="pointer-events-none absolute left-5 top-4">Index&nbsp;&nbsp;Work&nbsp;&nbsp;Archive</p>
        <p className="pointer-events-none absolute right-5 top-4 text-neutral-500">Scroll, drag or use ↑ ↓</p>
        <p className="pointer-events-none absolute bottom-4 left-5">©2026 TOM</p>
        <p className="pointer-events-none absolute bottom-4 right-5">Wikimedia Commons</p>
      </div>
    </StairsPreloader>
  );
}
