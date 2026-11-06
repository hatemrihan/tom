"use client";

import { SmoothCaretInput } from "../smooth-caret-input/smooth-caret-input";

export default function SmoothCaretInputDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <SmoothCaretInput placeholder="Type, then use ← → keys" />
      <p className="text-xs text-neutral-500">The caret glides instead of jumping.</p>
    </div>
  );
}
