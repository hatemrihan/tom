"use client";

import { Stamp } from "../stamp/stamp";

export default function StampDemo() {
  return (
    <div className="flex items-center gap-10">
      <Stamp denomination="1.20" caption="Cairo" postmark="Tom post">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/FaragOne-image.png" alt="Studio photograph" />
      </Stamp>
      <Stamp rotate={4} caption="Hello">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-300 to-rose-400 font-serif text-4xl text-white">
          H.
        </div>
      </Stamp>
    </div>
  );
}
