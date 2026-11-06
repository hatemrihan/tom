"use client";

import { useState } from "react";
import { DynamicButton } from "../dynamic-button/dynamic-button";

type State = "idle" | "copying" | "copied";

export default function DynamicButtonDemo() {
  const [state, setState] = useState<State>("idle");

  const copy = () => {
    if (state !== "idle") return;
    setState("copying");
    navigator.clipboard?.writeText("https://tomm.one/invite/7K4F").catch(() => {});
    setTimeout(() => setState("copied"), 700);
    setTimeout(() => setState("idle"), 2200);
  };

  return (
    <DynamicButton stateKey={state} onClick={copy}>
      {state === "idle" && "Copy invite link"}
      {state === "copying" && (
        <span className="flex items-center gap-2">
          <span className="size-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
          Copying
        </span>
      )}
      {state === "copied" && "Copied ✓"}
    </DynamicButton>
  );
}
