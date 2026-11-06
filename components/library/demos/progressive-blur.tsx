"use client";

import { ProgressiveBlur } from "../progressive-blur/progressive-blur";

export default function ProgressiveBlurDemo() {
  return (
    <div className="relative h-80 w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <div className="h-full overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 p-2 pb-24">
          {["JayashOne-image.jpg", "UnlimitedOne-image.jpg", "FaragOne-image.png", "NaderOne-image.png", "FaragThree-image.png", "JayashThree-image.png"].map((f) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={f} src={`/images/${f}`} alt="" className="aspect-[3/4] w-full rounded-lg object-cover" />
          ))}
        </div>
      </div>
      <ProgressiveBlur side="bottom" className="h-28" />
      <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-sm font-medium text-white drop-shadow">Scroll ↕</p>
    </div>
  );
}
