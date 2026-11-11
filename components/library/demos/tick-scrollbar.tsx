"use client";

import { TickScrollArea } from "../tick-scrollbar/tick-scrollbar";

const PARAGRAPHS = [
  "A scrollbar tells you two things: how long the page is, and how far you have come. Most do it with a grey lozenge at the edge of the window that nobody looks at.",
  "This one borrows from a ruler. The needle marks where you are, and the ticks near it rise to meet it, so progress reads at a glance without taking your eyes far from the text.",
  "It lives in its own row beneath the reading area. Nothing floats over the words, and the last line of a paragraph is never hidden behind a control.",
  "Click anywhere on the ruler to jump there. With the keyboard, focus it and use the left and right arrows to move a tenth of the page at a time.",
  "It takes the colour of the text around it, so it needs no theme of its own. Put it on white, on black or on a photograph and it follows.",
  "That is the whole component: a needle, some ticks and a number.",
];

export default function TickScrollbarDemo() {
  return (
    <TickScrollArea className="h-[400px] w-full max-w-lg rounded-2xl bg-white text-neutral-900">
      <article className="space-y-4 px-6 py-6 text-sm leading-relaxed text-neutral-600">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.01em] text-neutral-900">A ruler for reading</h3>
        {PARAGRAPHS.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </article>
    </TickScrollArea>
  );
}
