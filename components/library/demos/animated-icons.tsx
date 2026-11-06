"use client";

import { useState } from "react";
import { BellIcon, CopyCheckIcon, MenuIcon, PlayPauseIcon, PlusMinusIcon } from "../animated-icons/animated-icons";

export default function AnimatedIconsDemo() {
  const [state, setState] = useState<Record<string, boolean>>({});
  const icons = [
    { key: "menu", label: "Menu", Icon: MenuIcon },
    { key: "play", label: "Play", Icon: PlayPauseIcon },
    { key: "copy", label: "Copy", Icon: CopyCheckIcon },
    { key: "plus", label: "Expand", Icon: PlusMinusIcon },
    { key: "bell", label: "Notify", Icon: BellIcon },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {icons.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          aria-label={label}
          aria-pressed={!!state[key]}
          onClick={() => setState((s) => ({ ...s, [key]: !s[key] }))}
          className="flex size-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-800 shadow-sm transition hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
        >
          <Icon active={!!state[key]} />
        </button>
      ))}
    </div>
  );
}
