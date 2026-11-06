"use client";

import { useState } from "react";
import { NumberFlow } from "../number-flow/number-flow";

export default function NumberFlowDemo() {
  const [value, setValue] = useState(1240);
  return (
    <div className="flex flex-col items-center gap-5">
      <NumberFlow value={value} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} className="text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white" />
      <div className="flex gap-2">
        {[-500, -10, +10, +2500].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setValue((v) => Math.max(0, v + d))}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs tabular-nums text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {d > 0 ? `+${d}` : d}
          </button>
        ))}
      </div>
    </div>
  );
}
