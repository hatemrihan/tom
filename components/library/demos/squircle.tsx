"use client";

import { useState } from "react";
import { Squircle } from "../squircle/squircle";

export default function SquircleDemo() {
  const [smoothing, setSmoothing] = useState(0.8);
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="size-32 rounded-[36px] bg-gradient-to-br from-orange-400 to-pink-500" />
          <span className="text-xs text-neutral-500">border-radius</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Squircle radius={36} smoothing={smoothing} className="size-32 bg-gradient-to-br from-orange-400 to-pink-500" />
          <span className="text-xs text-neutral-500">squircle</span>
        </div>
      </div>
      <label className="flex items-center gap-3 text-xs text-neutral-500">
        Smoothing
        <input type="range" min={0} max={1} step={0.05} value={smoothing} onChange={(e) => setSmoothing(+e.target.value)} />
        <span className="w-8 tabular-nums">{smoothing.toFixed(2)}</span>
      </label>
    </div>
  );
}
