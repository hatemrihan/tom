"use client";

import { useState } from "react";
import { LiquidGlassOrb, type OrbState } from "../liquid-glass-orb/liquid-glass-orb";

const STATES: OrbState[] = ["idle", "listening", "thinking", "speaking"];

export default function LiquidGlassOrbDemo() {
  const [state, setState] = useState<OrbState>("idle");
  return (
    <div className="flex flex-col items-center gap-6">
      <LiquidGlassOrb state={state} />
      <div className="flex gap-1 rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
        {STATES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setState(s)}
            className={`rounded-full px-3 py-1 text-xs capitalize transition ${s === state ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
