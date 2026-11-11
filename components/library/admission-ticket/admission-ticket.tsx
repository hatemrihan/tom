"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { encode } from "uqr";
import { cn } from "../_lib/cn";

export interface AdmissionTicketProps {
  /** Logo shown top left: an <svg>, an <img>, anything. */
  logo?: ReactNode;
  /** Venue name under the logo (use "\n" for a second line). */
  venue: string;
  /** Ticket number. Also drawn as the barcode. */
  number: string;
  date: string;
  /** Ticket type, e.g. "General ticket". */
  kind: string;
  time: string;
  /** What the QR codes open or contain. */
  qr: string;
  /** Colour of the strip and the small bar. */
  accent?: string;
  /** Text colour on the strip. */
  onAccent?: string;
  /** Paper colour of the main part. */
  paper?: string;
  className?: string;
}

/** A real, scannable QR code drawn as one SVG path. */
function Qr({ value, className }: { value: string; className?: string }) {
  const { data, size } = useMemo(() => encode(value, { border: 0 }), [value]);
  const d = data.map((row, y) => row.map((on, x) => (on ? `M${x} ${y}h1v1h-1z` : "")).join("")).join("");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} shapeRendering="crispEdges" role="img" aria-label="QR code">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

/** Bars derived from the ticket number. Decorative: it is not a scannable symbology. */
function Bars({ value, count = 34, className }: { value: string; count?: number; className?: string }) {
  const bars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // a small hash of the number and the bar's position
        const text = `${value}:${i}`;
        const h = Array.from(text).reduce((acc, ch) => Math.imul(acc ^ ch.charCodeAt(0), 16777619) >>> 0, 2166136261);
        return 1 + (h % 3);
      }),
    [value, count]
  );
  return (
    <span aria-hidden className={cn("flex items-stretch gap-[2px]", className)}>
      {bars.map((w, i) => (
        <span key={i} className="bg-current" style={{ width: w }} />
      ))}
    </span>
  );
}

const SERRATED = "radial-gradient(circle at 0 6px, transparent 3px, black 3.500px) 0 0 / 100% 12px repeat-y";

/**
 * A museum-style admission ticket: a paper body with a coloured strip, and a
 * dark stub that leans away on hover as if about to be torn off.
 */
export function AdmissionTicket({ logo, venue, number, date, kind, time, qr, accent = "#4763c9", onAccent = "#ffffff", paper = "#f6f4ee", className }: AdmissionTicketProps) {
  return (
    <div
      className={cn("group flex w-[540px] max-w-full items-stretch text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em] text-stone-900 drop-shadow-[0_10px_16px_rgba(28,25,23,0.14)]", className)}
      style={{ "--accent": accent, "--on-accent": onAccent, "--paper": paper } as CSSProperties}
    >
      {/* body */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-l-lg rounded-r-[3px] bg-[var(--paper)]">
        <div className="flex flex-1 justify-between gap-6 px-5 pb-5 pt-5">
          <div>
            {logo && <div className="mb-3 h-11 [&>*]:h-full [&>*]:w-auto">{logo}</div>}
            <p className="whitespace-pre">{venue}</p>
          </div>
          <div className="self-end text-right">
            <span className="mb-1.5 ml-auto block h-2.5 w-24 bg-[var(--accent)]" />
            <p className="font-normal tabular-nums text-stone-500">No. <span className="font-medium text-stone-900">{number}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-5 bg-[var(--accent)] px-5 py-3 text-[var(--on-accent)]">
          <Qr value={qr} className="size-10 shrink-0" />
          <p className="flex flex-1 items-center justify-between gap-4 tabular-nums">
            <span>{date}</span>
            <span>{kind}</span>
            <span>{time}</span>
          </p>
        </div>
      </div>

      {/* stub */}
      <div
        className="flex w-[170px] shrink-0 origin-bottom-left justify-between gap-3 rounded-r-lg bg-stone-900 p-4 pl-5 text-stone-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 group-hover:rotate-[1.5deg]"
        style={{ maskImage: SERRATED, WebkitMaskImage: SERRATED }}
      >
        <div className="flex flex-col justify-between">
          <Qr value={qr} className="size-10" />
          <Bars value={number} count={11} className="h-20" />
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <span className="mb-1 ml-auto block h-1.5 w-12 bg-[var(--accent)]" />
            <p className="text-[9px] tabular-nums">{number}</p>
          </div>
          <p className="rotate-180 whitespace-nowrap text-[10px] leading-[1.6] [writing-mode:vertical-rl]">
            {date}
            <br />
            {kind}
            <br />
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}
