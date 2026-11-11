"use client";

import { LiquidGlassLogo } from "../liquid-glass-logo/liquid-glass-logo";

export default function LiquidGlassLogoDemo() {
  return (
    <LiquidGlassLogo>
      {/* Any logo works here: an <svg>, an <img> or text. */}
      <svg
        viewBox="0 0 64 64"
        className="size-24 text-neutral-900 dark:text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="TOM"
      >
        <path d="M21 57c-4-9-5-22-1-32 4-11 16-14 23-6 2 3 4 5 9 6 5 1 7 4 7 8s-3 6-8 6c-6 0-9 2-10 6-1 4 0 8 2 12" />
        <path d="M27 17c-11-2-17 8-15 21 1 7 9 7 11-1 1-6 1-12 4-20Z" />
        <circle cx="40" cy="27" r="2" fill="currentColor" stroke="none" />
        <path d="M36 21.500q4-2.500 8 0" strokeWidth={2} />
        <circle cx="56.500" cy="31.500" r="4" fill="currentColor" stroke="none" />
        <path d="M51 39q-3 3-7 1" strokeWidth={2} />
        <path d="M19 50q12 4 23 0" />
        <circle cx="30" cy="57" r="2.200" fill="currentColor" stroke="none" />
      </svg>
    </LiquidGlassLogo>
  );
}
