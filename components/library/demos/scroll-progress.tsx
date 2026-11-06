"use client";

import { useRef } from "react";
import { ScrollProgress } from "../scroll-progress/scroll-progress";

export default function ScrollProgressDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-80 w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      <ScrollProgress container={scroller} variant="bar" className="absolute inset-x-0 top-0 z-10 rounded-none" />
      <div ref={scroller} className="relative h-full overflow-y-auto px-6 py-8 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i} className="mb-4">
            Paragraph {i + 1}. Progress indicators reassure readers about how much is left. A ring is great for floating
            corners; a bar works best pinned to the top of a reading surface.
          </p>
        ))}
      </div>
      <ScrollProgress container={scroller} className="absolute bottom-4 right-4" />
    </div>
  );
}
