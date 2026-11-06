"use client";

import { useRef } from "react";
import { ScrollRevealGrid } from "../scroll-reveal-grid/scroll-reveal-grid";

const IMAGES = [
  "JayashOne-image.jpg", "UnlimitedOne-image.jpg", "FaragOne-image.png", "NaderOne-image.png", "hatem-image.jpg", "JayashThree-image.png",
  "UnlimitedThree-image.png", "FaragThree-image.png", "NaderTwo-image.png", "JayashFive-image.png", "UnlimitedTwo-image.png", "FaragFive-image.png",
];

export default function ScrollRevealGridDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="relative h-[420px] w-full overflow-y-auto rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-900">
      <p className="py-10 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">Scroll ↓</p>
      <ScrollRevealGrid
        container={scroller}
        items={IMAGES.map((f) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={f} src={`/images/${f}`} alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
        ))}
      />
    </div>
  );
}
