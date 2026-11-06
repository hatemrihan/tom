"use client";

import { useRef } from "react";
import { HorizontalTextScroll } from "../horizontal-text-scroll/horizontal-text-scroll";

export default function HorizontalTextScrollDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="relative h-80 w-full overflow-y-auto overflow-x-hidden rounded-2xl bg-white dark:bg-neutral-950">
      <HorizontalTextScroll container={scroller} text="Design · Build · Ship · Repeat" />
    </div>
  );
}
