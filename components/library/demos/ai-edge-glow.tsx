"use client";

import { useState } from "react";
import { AiEdgeGlow } from "../ai-edge-glow/ai-edge-glow";

export default function AiEdgeGlowDemo() {
  const [on, setOn] = useState(true);
  return (
    <AiEdgeGlow active={on} className="flex h-72 w-full max-w-lg items-center justify-center bg-neutral-950">
      <button
        type="button"
        onClick={() => setOn((o) => !o)}
        className="rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-white/20"
      >
        {on ? "Stop listening" : "Ask the assistant"}
      </button>
    </AiEdgeGlow>
  );
}
