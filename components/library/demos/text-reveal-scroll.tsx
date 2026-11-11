"use client";

import { useRef } from "react";
import { TextRevealScroll } from "../text-reveal-scroll/text-reveal-scroll";

export default function TextRevealScrollDemo() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div ref={scroller} className="relative h-[420px] w-full overflow-y-auto rounded-2xl bg-white">
      <p className="pt-6 text-center text-[11px] font-medium uppercase tracking-[0.01em] text-neutral-400">Scroll</p>
      {/* room above and below so the paragraph can travel to the centre and finish */}
      <div className="mx-auto max-w-xl px-6 pb-[220px] pt-[340px]">
        <TextRevealScroll
          container={scroller}
          className="justify-center text-center text-2xl"
          text="You must not fool yourself, and you are the easiest person to fool."
        />
        <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-[0.01em] text-neutral-400">Richard Feynman, 1974</p>
      </div>
    </div>
  );
}
