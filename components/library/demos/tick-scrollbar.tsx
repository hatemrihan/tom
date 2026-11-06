"use client";

import { TickScrollArea } from "../tick-scrollbar/tick-scrollbar";

const PARAGRAPH =
  "Good interfaces explain themselves. Motion is not decoration — it tells you where something came from, where it went and what will happen next. Every interaction in this library starts with that question: what does the user need to understand right now? Then we make it feel physical, quick and quiet.";

export default function TickScrollbarDemo() {
  return (
    <TickScrollArea className="h-[400px] w-full max-w-lg rounded-2xl bg-neutral-100 dark:bg-neutral-900">
      <article className="space-y-5 p-8 pb-24 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
        <h3 className="text-xl font-medium text-neutral-900 dark:text-white">#1 How I work</h3>
        {Array.from({ length: 6 }).map((_, i) => (
          <p key={i}>{PARAGRAPH}</p>
        ))}
      </article>
    </TickScrollArea>
  );
}
