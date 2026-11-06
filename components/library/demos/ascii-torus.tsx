"use client";

import { AsciiTorus } from "../ascii-torus/ascii-torus";

export default function AsciiTorusDemo() {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-neutral-950">
      <div className="flex justify-center pt-4">
        <AsciiTorus className="text-[9px] text-white" cols={72} rows={24} />
      </div>
      <div className="bg-[#f2f0ea] px-5 pb-4 pt-2 text-neutral-900">
        <p className="text-[clamp(2.5rem,9vw,5rem)] font-black leading-none tracking-[-0.05em]">tomm.one</p>
        <div className="mt-2 grid grid-cols-3 font-mono text-[10px] uppercase leading-tight">
          <span>Cairo, Egypt<br />and online</span>
          <span>Components<br />open source</span>
          <span className="text-right">Free<br />MIT</span>
        </div>
      </div>
    </div>
  );
}
