"use client";

import { useState, useSyncExternalStore } from "react";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Edition = "react" | "flutter";
type Tab = Edition | "motion";

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

const HINTS: Record<Tab, string> = {
  react: "React, in TypeScript and Tailwind",
  flutter: "Flutter, in Dart",
  motion: "A motion graphic: edit it, add your own image or video, download it",
};

/**
 * The editions of a component behind one row of tabs: TypeScript, Dart and,
 * where there is one, Motion. The choice of language is remembered, so someone
 * working in Flutter sees Dart on every component page. Motion is opened per
 * page and is only loaded once it is asked for.
 */
export function Editions({ react, flutter, motion }: { react: React.ReactNode; flutter?: React.ReactNode; motion?: React.ReactNode }) {
  const saved = useSyncExternalStore(subscribe, read, () => "react" as Edition);
  const [inMotion, setInMotion] = useState(false);
  const [opened, setOpened] = useState(false);
  const tab: Tab = inMotion && motion ? "motion" : saved === "flutter" && flutter ? "flutter" : "react";

  const choose = (next: Tab) => {
    if (next === "motion") {
      setOpened(true);
      setInMotion(true);
      return;
    }
    setInMotion(false);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
    if (next !== saved) track("switch", { edition: next });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "react", label: "TypeScript" },
    ...(flutter ? [{ id: "flutter" as const, label: "Dart" }] : []),
    ...(motion ? [{ id: "motion" as const, label: "Motion" }] : []),
  ];

  return (
    <section className="mt-16">
      <div className="mb-8 flex items-end justify-between gap-6 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div>
          <h2 className="text-neutral-900 dark:text-white">{tab === "motion" ? "Make it yours" : "Use it"}</h2>
          <p className="font-normal text-neutral-500">{HINTS[tab]}</p>
        </div>

        <div role="tablist" aria-label="Edition" className="flex shrink-0 items-center gap-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === tab}
              onClick={() => choose(t.id)}
              className={cn(
                "relative cursor-pointer uppercase transition-colors",
                t.id === tab ? "text-neutral-900 dark:text-white" : "font-normal text-neutral-400 hover:text-neutral-900 dark:hover:text-white",
              )}
            >
              {t.label}
              {/* the active tab sits on the rule under the row */}
              <span className={cn("absolute inset-x-0 -bottom-[13px] h-px bg-neutral-900 transition-opacity dark:bg-white", t.id === tab ? "opacity-100" : "opacity-0")} />
            </button>
          ))}
        </div>
      </div>

      {/* all stay in the page so switching is instant and none loses its place */}
      <div hidden={tab !== "react"}>{react}</div>
      {flutter && <div hidden={tab !== "flutter"}>{flutter}</div>}
      {motion && opened && <div hidden={tab !== "motion"}>{motion}</div>}
    </section>
  );
}
