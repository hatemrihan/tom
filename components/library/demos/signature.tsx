"use client";

import { Signature } from "../signature/signature";

export default function SignatureDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Signature className="h-24" />
      <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">Hatem Rihan</span>
    </div>
  );
}
