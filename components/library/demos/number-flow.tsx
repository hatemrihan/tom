"use client";

import { useState } from "react";
import { NumberFlow } from "../number-flow/number-flow";

const STEPS = [1, 10, 100, 1000];

export default function NumberFlowDemo() {
  const [value, setValue] = useState(1250);
  const [step, setStep] = useState(100);

  const round =
    "flex size-9 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-lg leading-none text-neutral-900 outline-none transition hover:bg-neutral-900 hover:text-white focus-visible:ring-2 focus-visible:ring-neutral-400 active:scale-90 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-white dark:hover:text-neutral-900";

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex items-center gap-6">
        <button type="button" aria-label={`Subtract ${step}`} disabled={value < step} onClick={() => setValue((v) => v - step)} className={round}>
          −
        </button>
        <NumberFlow
          value={value}
          format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
          className="min-w-[5.2ch] justify-center text-6xl font-medium tracking-[-0.04em] text-neutral-900 dark:text-white"
        />
        <button type="button" aria-label={`Add ${step}`} onClick={() => setValue((v) => v + step)} className={round}>
          +
        </button>
      </div>

      <div role="radiogroup" aria-label="Step" className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.01em]">
        <span className="font-normal text-neutral-400">Step</span>
        {STEPS.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={s === step}
            onClick={() => setStep(s)}
            className={`cursor-pointer tabular-nums outline-none transition-colors focus-visible:underline ${
              s === step ? "text-neutral-900 underline underline-offset-4 dark:text-white" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {s.toLocaleString("en-US")}
          </button>
        ))}
      </div>
    </div>
  );
}
