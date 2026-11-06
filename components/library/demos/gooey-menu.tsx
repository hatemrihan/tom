"use client";

import { GooeyMenu } from "../gooey-menu/gooey-menu";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function GooeyMenuDemo() {
  return (
    <div className="flex h-72 items-end pb-4">
      <GooeyMenu
        items={[
          { label: "Share", icon: icon("M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13") },
          { label: "Like", icon: icon("M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z") },
          { label: "Comment", icon: icon("M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z") },
        ]}
      />
    </div>
  );
}
