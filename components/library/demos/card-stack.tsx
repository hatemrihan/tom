"use client";

import { CardStack } from "../card-stack/card-stack";

const projects = [
  { id: "jayash", src: "/images/JayashOne-image.jpg", title: "Jayash", tag: "Branding" },
  { id: "unlimited", src: "/images/UnlimitedOne-image.jpg", title: "Unlimited", tag: "E‑commerce" },
  { id: "farag", src: "/images/FaragOne-image.png", title: "Farag", tag: "Photography" },
  { id: "nader", src: "/images/NaderOne-image.png", title: "NE Coach", tag: "Platform" },
];

export default function CardStackDemo() {
  return (
    <div className="pb-16">
      <CardStack
        cards={projects.map((p) => ({
          id: p.id,
          content: (
            <div className="flex h-full flex-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" draggable={false} className="h-52 w-full object-cover" />
              <div className="flex flex-1 items-center justify-between px-4">
                <p className="font-medium text-neutral-900 dark:text-white">{p.title}</p>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">{p.tag}</span>
              </div>
            </div>
          ),
        }))}
      />
    </div>
  );
}
