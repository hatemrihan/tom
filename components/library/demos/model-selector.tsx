"use client";

import { ModelSelector } from "../model-selector/model-selector";

export default function ModelSelectorDemo() {
  return (
    <div className="h-64 w-full max-w-sm">
      <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="px-1 pb-8 text-sm text-neutral-400">What do you want to do?</p>
        <ModelSelector />
      </div>
    </div>
  );
}
