"use client";

import { ImageTrail } from "../image-trail/image-trail";

export default function ImageTrailDemo() {
  return (
    <ImageTrail
      className="flex h-80 w-full items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900"
      size={110}
      images={[
        "/images/JayashOne-image.jpg",
        "/images/UnlimitedOne-image.jpg",
        "/images/FaragOne-image.png",
        "/images/NaderOne-image.png",
        "/images/hatem-image.jpg",
      ]}
    >
      <p className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white">Move around</p>
    </ImageTrail>
  );
}
