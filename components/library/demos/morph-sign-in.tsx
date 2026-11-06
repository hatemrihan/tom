"use client";

import { MorphSignIn } from "../morph-sign-in/morph-sign-in";

export default function MorphSignInDemo() {
  return (
    <div className="flex h-72 flex-col items-center justify-center gap-4">
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">Click to open sign in</p>
      <MorphSignIn />
    </div>
  );
}
