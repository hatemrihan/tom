"use client";

import { RollingText } from "../rolling-text/rolling-text";

export default function RollingTextDemo() {
  return (
    <nav className="flex flex-col items-center gap-3 text-3xl font-semibold uppercase tracking-tight text-neutral-900 dark:text-white">
      {["Work", "About", "Contact"].map((label) => (
        <a key={label} href="#" onClick={(e) => e.preventDefault()}>
          <RollingText text={label} />
        </a>
      ))}
    </nav>
  );
}
