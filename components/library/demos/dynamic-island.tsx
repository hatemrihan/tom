"use client";

import { useState } from "react";
import { DynamicIsland, islandViews } from "../dynamic-island/dynamic-island";

const VIEWS = {
  idle: islandViews.idle(),
  ring: islandViews.ring("Hatem Rihan"),
  timer: islandViews.timer("04:59"),
  music: islandViews.music("Midnight Commit", "The Refactors"),
};

type Key = keyof typeof VIEWS;

export default function DynamicIslandDemo() {
  const [view, setView] = useState<Key>("idle");
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="flex h-24 items-start">
        <DynamicIsland view={VIEWS[view]} />
      </div>
      <div className="flex gap-1 rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
        {(Object.keys(VIEWS) as Key[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setView(k)}
            className={`rounded-full px-3 py-1 text-xs capitalize transition ${k === view ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
