"use client";

import { HoverNav } from "../hover-nav/hover-nav";

export default function HoverNavDemo() {
  return (
    <div className="flex w-full max-w-xl items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-2 dark:border-neutral-800 dark:bg-neutral-950">
      <span className="flex items-center gap-2 text-sm font-medium">
        <span className="size-3 bg-neutral-900 dark:bg-white" /> TOM
      </span>
      <HoverNav
        active="#components"
        items={[
          { label: "Work", href: "#work" },
          { label: "Components", href: "#components" },
          { label: "About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ]}
      />
    </div>
  );
}
