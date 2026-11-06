"use client";

import { InfiniteDragGrid } from "../infinite-drag-grid/infinite-drag-grid";

const IMAGES = [
  "JayashOne-image.jpg", "UnlimitedOne-image.jpg", "FaragOne-image.png", "NaderOne-image.png", "hatem-image.jpg",
  "JayashThree-image.png", "UnlimitedThree-image.png", "FaragThree-image.png", "NaderTwo-image.png", "JayashFive-image.png",
  "UnlimitedTwo-image.png", "FaragFive-image.png",
];

export default function InfiniteDragGridDemo() {
  return (
    <InfiniteDragGrid
      className="h-[440px] w-full rounded-2xl"
      columns={4}
      items={IMAGES.map((f) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={f} src={`/images/${f}`} alt="" draggable={false} className="h-full w-full rounded-xl object-cover shadow-md" />
      ))}
    />
  );
}
