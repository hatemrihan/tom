"use client";

import { DevourInput } from "../devour-input/devour-input";

export default function DevourInputDemo() {
  return (
    <div className="w-full max-w-xl px-2">
      <p className="mb-6 text-sm text-neutral-500">Join the newsletter — one email when new components ship.</p>
      <DevourInput placeholder="you@studio.com" />
    </div>
  );
}
