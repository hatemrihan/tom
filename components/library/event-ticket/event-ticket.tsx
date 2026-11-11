"use client";

import { useMemo, type CSSProperties } from "react";
import { encode } from "uqr";
import { cn } from "../_lib/cn";

export interface EventTicketProps {
  /** Small line above the title: the series, the organiser. */
  kicker?: string;
  title: string;
  /** The big figure in the coloured panel, usually the day of the month. */
  day: string;
  /** Under the figure: month and year, or a weekday. */
  month: string;
  /** Labelled facts, two per row: date, doors, venue, seat. */
  details?: { label: string; value: string }[];
  /** Ticket number, printed on the stub. */
  number: string;
  /** What the QR code opens or contains. */
  qr: string;
  /** Panel colour. */
  color?: string;
  /** Text colour on the panel. */
  onColor?: string;
  /** Paper colour. */
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

/** Round bites out of both edges where the stub tears off. */
const NOTCHES =
  "radial-gradient(circle at 0 var(--tear), transparent 7px, black 7.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% var(--tear), transparent 7px, black 7.5px) right / 51% 100% no-repeat";

/**
 * A tall event ticket kept plain: one coloured panel with a large date,
 * the facts in small capitals, a perforation, and a stub with a real QR
 * code. It lifts slightly on hover.
 */
export function EventTicket({
  kicker,
  title,
  day,
  month,
  details = [],
  number,
  qr,
  color = "#4763c9",
  onColor = "#ffffff",
  paper = "#f6f4ee",
  className,
}: EventTicketProps) {
  return (
    <article
      className={cn(
        "w-[220px] text-[10px] font-medium uppercase leading-[1.35] tracking-[0.01em] text-stone-900 drop-shadow-[0_10px_16px_rgba(28,25,23,0.14)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5",
        className
      )}
    >
      <div
        className="flex flex-col rounded-[10px] bg-[var(--paper)]"
        style={{ "--paper": paper, "--tear": "calc(100% - 112px)", maskImage: NOTCHES, WebkitMaskImage: NOTCHES } as CSSProperties}
      >
        {/* coloured panel: the date, large */}
        <div className="m-2 flex aspect-square flex-col justify-between rounded-md p-3" style={{ background: color, color: onColor }}>
          <p className="flex justify-between">
            <span>{kicker}</span>
            <span className="font-normal opacity-70">Admit one</span>
          </p>
          <div>
            <p className="text-[84px] font-medium leading-[0.8] tracking-[-0.06em]">{day}</p>
            <p className="mt-2">{month}</p>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2">
          <h3 className="text-[13px] leading-[1.2]">{title}</h3>
          <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="font-normal text-stone-500">{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* perforation, then the stub */}
        <div aria-hidden className="mx-4 border-t border-dashed border-stone-300" />
        <div className="flex h-[112px] items-center justify-between gap-3 px-4">
          <p>
            <span className="font-normal text-stone-500">No.</span>
            <br />
            <span className="tabular-nums">{number}</span>
            <br />
            <span className="mt-2 block font-normal text-stone-500">Scan at the door</span>
          </p>
          <Qr value={qr} className="size-[72px] shrink-0" />
        </div>
      </div>
    </article>
  );
}
