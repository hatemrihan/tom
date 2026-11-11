"use client";

import { useRef } from "react";
import { BoxRevealText } from "../box-reveal-text/box-reveal-text";

export default function BoxRevealTextDemo() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div ref={scroller} className="relative h-[420px] w-full overflow-y-auto rounded-2xl bg-white text-neutral-900">
      <p className="pt-6 text-center text-[11px] font-medium uppercase tracking-[0.01em] text-neutral-400">Scroll</p>
      <div className="px-6 pb-[200px] pt-[340px]">
        <BoxRevealText
          container={scroller}
          align="center"
          lines={["What I cannot create,", "I do not understand."]}
        />
        <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-[0.01em] text-neutral-400">Richard Feynman, on his blackboard, 1988</p>
      </div>
    </div>
  );
}
