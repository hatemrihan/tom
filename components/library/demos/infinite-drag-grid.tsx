"use client";

import { InfiniteDragGrid } from "../infinite-drag-grid/infinite-drag-grid";

/** Public-domain portraits of physicists, via Wikimedia Commons. */
const PORTRAITS = ["feynman", "curie", "einstein", "bohr", "dirac", "schrodinger", "oppenheimer", "tesla"];

export default function InfiniteDragGridDemo() {
  return (
    <InfiniteDragGrid
      className="h-[440px] w-full rounded-2xl"
      columns={4}
      items={PORTRAITS.map((name) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={name} src={`/people/${name}.jpg`} alt="" draggable={false} className="h-full w-full object-cover grayscale" />
      ))}
    />
  );
}
