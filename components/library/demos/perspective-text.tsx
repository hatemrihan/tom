"use client";

import { useRef } from "react";
import { PerspectiveText } from "../perspective-text/perspective-text";

export default function PerspectiveTextDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="relative h-[440px] w-full overflow-y-auto overflow-x-hidden rounded-2xl bg-[#f4f3f0] text-orange-600">
      <p className="pt-10 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">Scroll down</p>
      <PerspectiveText
        container={scroller}
        lines={["Design that moves", "people, not pixels.", "Built in Cairo,", "shipped worldwide,", "open for everyone.", "Say hello →"]}
      />
    </div>
  );
}
