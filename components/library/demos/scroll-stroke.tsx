"use client";

import { useRef } from "react";
import { ScrollStroke } from "../scroll-stroke/scroll-stroke";

export default function ScrollStrokeDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="relative h-[440px] w-full overflow-y-auto rounded-2xl bg-[#f7fbe9]">
      <div className="h-40" />
      <ScrollStroke container={scroller} className="h-[420px]">
        <h3 className="text-center text-[clamp(2rem,6vw,4.2rem)] font-medium leading-[0.95] tracking-[-0.05em] text-[#14243a]">
          Every stroke
          <br />
          follows the
          <br />
          scroll.
        </h3>
      </ScrollStroke>
      <p className="py-40 text-center text-xs text-[#14243a]/50">Keep scrolling ↓</p>
    </div>
  );
}
