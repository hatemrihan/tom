"use client";

import { DrawingCursor } from "../drawing-cursor/drawing-cursor";

export default function DrawingCursorDemo() {
  return (
    <DrawingCursor color="#ef4444" className="h-80 w-full rounded-2xl bg-[#f6f3ec]">
      <div className="flex h-full flex-col items-center justify-center text-neutral-900">
        <p className="text-6xl font-black tracking-tight">Draw</p>
        <p className="mt-2 text-sm text-neutral-500">Move your cursor across the page</p>
      </div>
    </DrawingCursor>
  );
}
