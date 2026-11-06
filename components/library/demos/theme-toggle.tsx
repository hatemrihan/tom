"use client";

import { ThemeToggle } from "../theme-toggle/theme-toggle";

export default function ThemeToggleDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ThemeToggle className="size-14 border border-neutral-200 dark:border-neutral-800" />
      <p className="text-xs text-neutral-500">Click — the whole page flips from the button.</p>
    </div>
  );
}
