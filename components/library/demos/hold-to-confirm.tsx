"use client";

import { useState } from "react";
import { HoldToConfirm } from "../hold-to-confirm/hold-to-confirm";

export default function HoldToConfirmDemo() {
  const [deleted, setDeleted] = useState(false);
  return (
    <div className="w-full max-w-xs rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm font-medium text-neutral-900 dark:text-white">Delete this project?</p>
      <p className="mt-1 text-xs leading-relaxed text-neutral-500">
        {deleted ? "Project deleted. It will be gone for good in 30 days." : "This permanently removes the project and everything inside it."}
      </p>
      <div className="mt-4 flex justify-end">
        <HoldToConfirm onConfirm={() => setDeleted(true)} resetAfter={2400}>
          Hold to delete
        </HoldToConfirm>
      </div>
    </div>
  );
}
