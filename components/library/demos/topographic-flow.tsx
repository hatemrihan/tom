"use client";

import { TopographicFlow } from "../topographic-flow/topographic-flow";

export default function TopographicFlowDemo() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-950">
      <TopographicFlow className="text-neutral-400 dark:text-neutral-600" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-neutral-900 backdrop-blur dark:bg-neutral-900/80 dark:text-white">
          Elevation 2,431 m
        </span>
      </div>
    </div>
  );
}
