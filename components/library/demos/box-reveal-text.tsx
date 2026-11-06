"use client";

import { useRef } from "react";
import { BoxRevealText } from "../box-reveal-text/box-reveal-text";

export default function BoxRevealTextDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="relative h-[420px] w-full overflow-y-auto rounded-2xl bg-neutral-50 px-8 dark:bg-neutral-900">
      <p className="pt-10 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">Scroll to reveal</p>
      <div className="py-[300px]">
        <BoxRevealText
          container={scroller}
          boxClassName="bg-orange-500"
          lines={["I build interfaces", "that feel physical,", "move with purpose,", "and stay out of", "your way."]}
        />
      </div>
    </div>
  );
}
