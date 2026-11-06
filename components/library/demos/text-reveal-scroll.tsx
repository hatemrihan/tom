"use client";

import { useRef } from "react";
import { TextRevealScroll } from "../text-reveal-scroll/text-reveal-scroll";

export default function TextRevealScrollDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="h-80 w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 px-6 dark:border-neutral-800">
      <p className="pt-8 text-center text-xs text-neutral-400">Scroll inside ↓</p>
      <div className="py-40">
        <TextRevealScroll
          container={scroller}
          className="text-2xl"
          text="I design and build interfaces that feel physical — buttons you want to press, motion that explains, and details most people only notice when they're missing."
        />
      </div>
    </div>
  );
}
