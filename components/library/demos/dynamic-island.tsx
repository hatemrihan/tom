"use client";

import { useState } from "react";
import { DynamicIsland, islandViews } from "../dynamic-island/dynamic-island";

const VIEWS = {
  idle: islandViews.idle(),
  copied: islandViews.status("Copied to clipboard"),
  publishing: islandViews.progress("Publishing", 0.64),
  live: islandViews.notice("Version 1.2 is live", "26 components, 3 new"),
};
type Key = keyof typeof VIEWS;

export default function DynamicIslandDemo() {
  const [view, setView] = useState<Key>("idle");

  return (
    <div className="flex w-full flex-col items-center gap-8 text-[11px] font-medium uppercase tracking-[0.01em]">
      <div className="flex h-16 items-start">
        <DynamicIsland view={VIEWS[view]} />
      </div>
      <div className="flex gap-5">
        {(Object.keys(VIEWS) as Key[]).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={k === view}
            onClick={() => setView(k)}
            className={`cursor-pointer uppercase outline-none transition-colors focus-visible:underline ${
              k === view ? "text-neutral-900 underline underline-offset-4 dark:text-white" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
