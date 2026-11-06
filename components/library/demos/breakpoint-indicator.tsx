"use client";

import { BreakpointIndicator } from "../breakpoint-indicator/breakpoint-indicator";

export default function BreakpointIndicatorDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <BreakpointIndicator position="static" devOnly={false} />
      <p className="text-xs text-neutral-500">Resize your window — in your app it sits fixed in a corner, dev only.</p>
    </div>
  );
}
