"use client";

import { useRef } from "react";
import { StickyCardStack } from "../sticky-card-stack/sticky-card-stack";

const projects = [
  { src: "/images/JayashOne-image.jpg", title: "Jayash", tag: "Branding" },
  { src: "/images/UnlimitedOne-image.jpg", title: "Unlimited", tag: "E‑commerce" },
  { src: "/images/FaragOne-image.png", title: "Farag", tag: "Photography" },
  { src: "/images/NaderOne-image.png", title: "NE Coach", tag: "Platform" },
];

export default function StickyCardStackDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="relative h-[460px] w-full max-w-md overflow-y-auto rounded-2xl bg-neutral-950 px-4">
      <p className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Scroll down to stack</p>
      <StickyCardStack
        container={scroller}
        className="pb-24"
        cards={projects.map((p) => (
          <div key={p.title} className="relative h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.title} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <span className="text-xl font-semibold">{p.title}</span>
              <span className="text-xs text-white/70">{p.tag}</span>
            </div>
          </div>
        ))}
      />
    </div>
  );
}
