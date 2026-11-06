"use client";

import { SnapButton } from "../snap-button/snap-button";

export default function SnapButtonDemo() {
  return (
    <SnapButton className="h-80 w-full max-w-lg rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700" label="Chat">
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    </SnapButton>
  );
}
