"use client";

import { DrawingCursor } from "../drawing-cursor/drawing-cursor";

export default function DrawingCursorDemo() {
  return (
    <DrawingCursor mode="draw" width={5} fileName="drawing.png" className="h-80 w-full rounded-2xl bg-white text-neutral-900">
      <p className="flex h-full items-center justify-center text-[11px] font-medium uppercase tracking-[0.01em] text-neutral-400">
        Press and drag to draw
      </p>
    </DrawingCursor>
  );
}
