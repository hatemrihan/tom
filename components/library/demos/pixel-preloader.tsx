"use client";

import { PixelPreloader } from "../pixel-preloader/pixel-preloader";

export default function PixelPreloaderDemo() {
  return (
    <PixelPreloader className="h-72 w-full max-w-lg rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/JayashOne-image.jpg" alt="Jayash project" className="h-72 w-full object-cover" />
    </PixelPreloader>
  );
}
