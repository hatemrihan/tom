"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Bar chart — daily submissions                                               */
/* -------------------------------------------------------------------------- */

export function BarChart({
  data,
  height = 160,
}: {
  data: { date: string; count: number }[];
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1];
  const active = hover !== null ? data[hover] : null;

  return (
    <div className="relative">
      <div className="mb-3 flex h-5 items-baseline justify-between text-xs text-neutral-500">
        <span>
          {active ? formatDay(active.date) : "Last 30 days"}
        </span>
        <span className="tabular-nums text-neutral-900 dark:text-neutral-100">
          {active
            ? `${active.count} ${active.count === 1 ? "message" : "messages"}`
            : `${data.reduce((s, d) => s + d.count, 0)} total`}
        </span>
      </div>
      <div className="flex gap-2">
        <div
          className="flex flex-col justify-between text-right text-[10px] tabular-nums text-neutral-400"
          style={{ height }}
        >
          {[...ticks].reverse().map((t) => (
            <span key={t} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
              {t}
            </span>
          ))}
        </div>
        <div
          className="relative flex flex-1 items-end gap-[3px]"
          style={{ height }}
          onMouseLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <div
              key={t}
              className="pointer-events-none absolute inset-x-0 border-t border-dashed border-neutral-200 dark:border-neutral-800"
              style={{ bottom: `${(t / top) * 100}%` }}
            />
          ))}
          {data.map((d, i) => (
            <button
              type="button"
              key={d.date}
              aria-label={`${formatDay(d.date)}: ${d.count}`}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              className="group relative flex h-full flex-1 items-end outline-none"
            >
              <span
                className={cn(
                  "block w-full rounded-t-[3px] transition-[height,background-color] duration-500 ease-out",
                  d.count === 0
                    ? "bg-neutral-200 dark:bg-neutral-800"
                    : hover === i
                      ? "bg-neutral-900 dark:bg-white"
                      : "bg-neutral-700 dark:bg-neutral-300"
                )}
                style={{ height: d.count === 0 ? 2 : `${(d.count / top) * 100}%` }}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between pl-6 text-[10px] text-neutral-400">
        <span>{data[0] && formatDay(data[0].date)}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Donut chart — status breakdown                                              */
/* -------------------------------------------------------------------------- */

export function DonutChart({
  segments,
  size = 148,
  label = "Total",
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  label?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0);
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const focus = hover !== null ? segments[hover] : null;

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-neutral-100 dark:stroke-neutral-800"
          />
          {total > 0 &&
            segments.map((s, i) => {
              const len = (s.value / total) * c;
              const gap = segments.filter((x) => x.value > 0).length > 1 ? 2 : 0;
              const el = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={hover === i ? stroke + 3 : stroke}
                  strokeDasharray={`${Math.max(len - gap, 0)} ${c}`}
                  strokeDashoffset={-offset}
                  className="cursor-pointer transition-[stroke-width] duration-200"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              );
              offset += len;
              return el;
            })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-neutral-900 dark:text-white">
            {focus ? focus.value : total}
          </span>
          <span className="text-[11px] text-neutral-500">{focus ? focus.label : label}</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {segments.map((s, i) => (
          <li
            key={s.label}
            className={cn(
              "flex items-center gap-2 transition-opacity",
              hover !== null && hover !== i && "opacity-40"
            )}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="size-2.5 rounded-full" style={{ background: s.color }} />
            <span className="text-neutral-600 dark:text-neutral-400">{s.label}</span>
            <span className="ml-auto pl-4 tabular-nums text-neutral-900 dark:text-white">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Horizontal bars — project types                                             */
/* -------------------------------------------------------------------------- */

export function HorizontalBars({
  rows,
}: {
  rows: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (rows.length === 0) {
    return <p className="text-sm text-neutral-500">No data yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-neutral-600 dark:text-neutral-400">{r.label}</span>
            <span className="tabular-nums text-neutral-900 dark:text-white">{r.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-neutral-800 transition-[width] duration-700 ease-out dark:bg-neutral-200"
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */

export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const w = 96;
  const h = 28;
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const points = values.map((v, i) => `${i * step},${h - (v / max) * (h - 2) - 1}`).join(" ");
  return (
    <svg width={w} height={h} className={cn("overflow-visible", className)} aria-hidden>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function niceTicks(max: number): number[] {
  const step = max <= 4 ? 1 : Math.ceil(max / 4 / Math.pow(10, Math.floor(Math.log10(max / 4)))) * Math.pow(10, Math.floor(Math.log10(max / 4)));
  const ticks: number[] = [];
  for (let t = 0; t <= max + step - 1; t += step) {
    ticks.push(t);
    if (t >= max) break;
  }
  return ticks;
}

function formatDay(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
