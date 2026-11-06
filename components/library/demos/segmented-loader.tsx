"use client";

import { SegmentedLoader } from "../segmented-loader/segmented-loader";

export default function SegmentedLoaderDemo() {
  return (
    <div className="relative flex h-72 w-full items-center justify-center">
      <div className="absolute left-4 top-6 hidden -rotate-6 bg-white p-3 font-mono text-[10px] uppercase leading-tight text-neutral-800 shadow-md sm:block">
        Loaders,<br />interfaces,<br />good UX
      </div>
      <SegmentedLoader label="Exporting" />
      <div className="absolute bottom-6 right-4 hidden rotate-3 bg-white p-3 font-mono text-[10px] uppercase leading-tight text-neutral-800 shadow-md sm:block">
        Made with ♥<br />in Cairo
      </div>
    </div>
  );
}
