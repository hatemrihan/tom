"use client";

import { useState } from "react";
import { ScrambleText } from "../scramble-text/scramble-text";

const code = () =>
  Array.from({ length: 8 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

export default function ScrambleTextDemo() {
  const [invite, setInvite] = useState("7K4F2Q9M");
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        tomm.one/invite/<ScrambleText text={invite} className="text-neutral-900 dark:text-white" />
      </div>
      <button
        type="button"
        onClick={() => setInvite(code())}
        className="text-xs text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline dark:hover:text-white"
      >
        Regenerate
      </button>
    </div>
  );
}
