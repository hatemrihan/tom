"use client";

import { useState } from "react";
import { HoldToConfirm } from "../hold-to-confirm/hold-to-confirm";

export default function HoldToConfirmDemo() {
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 text-center text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em]">
      <p className="text-neutral-900 dark:text-white">
        Delete this project?
        <br />
        <span className="font-normal text-neutral-500">{deleted ? "Deleted. It is gone for good in 30 days." : "This removes it and everything inside it."}</span>
      </p>
      <HoldToConfirm onConfirm={() => setDeleted(true)} resetAfter={2400}>
        Hold to delete
      </HoldToConfirm>
    </div>
  );
}
