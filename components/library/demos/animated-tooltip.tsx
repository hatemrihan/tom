"use client";

import { AnimatedTooltip } from "../animated-tooltip/animated-tooltip";

const people = [
  { name: "Hatem", role: "Design engineer", color: "bg-neutral-900" },
  { name: "Lina", role: "Product designer", color: "bg-rose-500" },
  { name: "Omar", role: "Backend", color: "bg-sky-500" },
  { name: "Nour", role: "Motion", color: "bg-amber-500" },
];

export default function AnimatedTooltipDemo() {
  return (
    <div className="flex -space-x-2">
      {people.map((p) => (
        <AnimatedTooltip
          key={p.name}
          content={
            <span>
              {p.name} <span className="opacity-60">· {p.role}</span>
            </span>
          }
        >
          <button
            type="button"
            aria-label={p.name}
            className={`flex size-11 items-center justify-center rounded-full border-2 border-white text-sm font-medium text-white transition-transform hover:z-10 hover:-translate-y-1 dark:border-neutral-950 ${p.color}`}
          >
            {p.name[0]}
          </button>
        </AnimatedTooltip>
      ))}
    </div>
  );
}
