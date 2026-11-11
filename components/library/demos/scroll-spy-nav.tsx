"use client";

import { ScrollSpyNav } from "../scroll-spy-nav/scroll-spy-nav";

const SECTIONS = [
  {
    id: "index",
    title: "The index",
    text: [
      "The list on the left is the whole page at a glance. Each entry is a section, in reading order, and the dot sits on the one you are in.",
      "Click any entry and the page glides there. The dot follows the scroll, not the click, so it never claims a section you have not reached.",
    ],
  },
  {
    id: "line",
    title: "The reading line",
    text: [
      "A section becomes current when its heading crosses an invisible line a quarter of the way down the reading area.",
      "Move that line with the offset setting. Nearer the top feels strict; nearer the middle switches earlier, which suits short sections.",
    ],
  },
  {
    id: "rule",
    title: "The rule",
    text: [
      "The thin rule under the index fills as you read. It is driven straight from the scroll position, so it stays in step however fast you go.",
    ],
  },
  {
    id: "edges",
    title: "The edges",
    text: [
      "Reaching the top or bottom stops here. The page behind does not start moving, which is what made the old version feel like it was lagging.",
      "At the very end the last entry always becomes current, even when its section is too short to reach the reading line.",
    ],
  },
];

export default function ScrollSpyNavDemo() {
  return (
    <div className="h-[420px] w-full max-w-2xl overflow-hidden rounded-2xl bg-white text-neutral-900">
      <ScrollSpyNav
        title="How it works"
        sections={SECTIONS.map((s) => ({
          id: s.id,
          title: s.title,
          content: s.text.map((t) => <p key={t}>{t}</p>),
        }))}
      />
    </div>
  );
}
