"use client";

import { IridescentFoil } from "../iridescent-foil/iridescent-foil";

export default function IridescentFoilDemo() {
  return (
    <IridescentFoil>
      <div className="flex h-full flex-col justify-between bg-gradient-to-br from-neutral-800 to-neutral-950 p-5 text-white">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/60">
          <span>Member</span>
          <span>No. 001</span>
        </div>
        <div>
          <p className="text-4xl font-semibold tracking-tight">TOM</p>
          <p className="mt-1 text-xs text-white/60">Design engineering · Since 2023</p>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-xs text-white/70">Hatem Rihan</span>
          <span className="size-8 rounded-md bg-gradient-to-br from-amber-200 to-amber-500 shadow-inner" />
        </div>
      </div>
    </IridescentFoil>
  );
}
