"use client";

import { useSyncExternalStore } from "react";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Edition = "react" | "flutter";

const KEY = "tom-edition";
const EVENT = "tom-edition-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(): Edition {
  try {
    return window.localStorage.getItem(KEY) === "flutter" ? "flutter" : "react";
  } catch {
    return "react";
  }
}

/**
 * The two editions of a component, side by side behind one switch: TypeScript
 * on the left, Dart on the right. The choice is remembered, so someone working
 * in Flutter sees Dart on every component page.
 */
export function Editions({ react, flutter }: { react: React.ReactNode; flutter: React.ReactNode }) {
  const edition = useSyncExternalStore(subscribe, read, () => "react" as Edition);
  const dart = edition === "flutter";

  const choose = (next: Edition) => {
    try {
      window.localStorage.setItem(KEY, next);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
    if (next !== edition) track("switch", { edition: next });
  };

  return (
    <section className="mt-16">
      <div className="mb-8 flex items-end justify-between gap-6 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div>
          <h2 className="text-neutral-900 dark:text-white">Use it</h2>
          <p className="font-normal text-neutral-500">{dart ? "Flutter, in Dart" : "React, in TypeScript and Tailwind"}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => choose("react")}
            aria-pressed={!dart}
            className={cn("cursor-pointer uppercase transition-colors", dart ? "font-normal text-neutral-400 hover:text-neutral-900 dark:hover:text-white" : "text-neutral-900 dark:text-white")}
          >
            TypeScript
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={dart}
            aria-label="Show the Dart edition"
            onClick={() => choose(dart ? "react" : "flutter")}
            className="relative h-[18px] w-8 shrink-0 cursor-pointer rounded-full bg-neutral-900 outline-offset-2 dark:bg-white"
          >
            <span
              className={cn(
                "absolute left-[3px] top-[3px] size-3 rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-neutral-900",
                dart && "translate-x-[14px]",
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => choose("flutter")}
            aria-pressed={dart}
            className={cn("cursor-pointer uppercase transition-colors", dart ? "text-neutral-900 dark:text-white" : "font-normal text-neutral-400 hover:text-neutral-900 dark:hover:text-white")}
          >
            Dart
          </button>
        </div>
      </div>

      {/* both stay in the page so switching is instant and neither loses its place */}
      <div hidden={dart}>{react}</div>
      <div hidden={!dart}>{flutter}</div>
    </section>
  );
}
