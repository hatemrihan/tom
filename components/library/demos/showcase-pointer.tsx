"use client";

import { ShowcasePointer } from "../showcase-pointer/showcase-pointer";

const work = [
  { src: "/images/JayashOne-image.jpg", title: "Jayash" },
  { src: "/images/UnlimitedOne-image.jpg", title: "Unlimited" },
  { src: "/images/FaragOne-image.png", title: "Farag" },
];

export default function ShowcasePointerDemo() {
  return (
    <ShowcasePointer className="w-full max-w-lg rounded-2xl">
      <div className="grid grid-cols-3 gap-3 p-3">
        {work.map((w) => (
          <a key={w.title} href="#" data-cursor={`View ${w.title}`} onClick={(e) => e.preventDefault()} className="group block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.src} alt={w.title} className="aspect-[3/4] w-full rounded-xl object-cover transition duration-500 group-hover:scale-[0.97]" />
            <p className="mt-2 text-xs text-neutral-500">{w.title}</p>
          </a>
        ))}
      </div>
    </ShowcasePointer>
  );
}
