"use client";

import { TactileButton } from "../tactile-button/tactile-button";

export default function TactileButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <TactileButton tone="paper">Cancel</TactileButton>
      <TactileButton tone="ink">Continue</TactileButton>
      <TactileButton tone="signal">Launch</TactileButton>
    </div>
  );
}
