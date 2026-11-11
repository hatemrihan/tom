"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../_lib/cn";

export interface ResultSlipProps {
  /** Big title, one entry per line. */
  title: string[];
  /** Short paragraph beside the title. */
  about: string;
  /** Picture in the dark window: an <img>, an <svg>, anything. */
  figure?: ReactNode;
  /** Labelled lines such as { label: "E-mail", value: "hello@…" }. */
  contacts?: { label: string; value: string }[];
  /** Two address blocks along the bottom. */
  places?: { city: string; lines: string[] }[];
  /** Boxed small print, top right. */
  disclaimer: string;
  /** Stamp under the disclaimer, e.g. "Duplicate copy". */
  stamp?: string;
  /** Tall wordmark, bottom right. */
  wordmark: string;
  /** Small print beside the wordmark. */
  credit?: string;
  footer?: string;
  /** Printed date and time. Defaults to the moment it appears. */
  printedAt?: Date;
  /** Paper colour. */
  color?: string;
  /** Ink colour. */
  ink?: string;
  className?: string;
}

/** The outline: a slip with tabs cut into the left and right edges. */
const SHAPE =
  "polygon(0 0, 100% 0, 100% 5%, 98.8% 7%, 98.8% 33%, 100% 35%, 100% 68%, 98.8% 70%, 98.8% 100%, 0 100%, 0 71%, 1.2% 69%, 1.2% 12%, 0 10%)";

/**
 * A printed result slip: tinted paper cut with side tabs, everything
 * set in small monospaced capitals on a loose grid, stamped with the real
 * date and time it was printed.
 */
export function ResultSlip({
  title,
  about,
  figure,
  contacts = [],
  places = [],
  disclaimer,
  stamp = "Duplicate copy",
  wordmark,
  credit,
  footer,
  printedAt,
  color = "#dfe6f7",
  ink = "#22327a",
  className,
}: ResultSlipProps) {
  const [now, setNow] = useState<Date | null>(printedAt ?? null);
  useEffect(() => {
    const id = setTimeout(() => setNow((d) => d ?? new Date()), 0);
    return () => clearTimeout(id);
  }, []);

  const date = now?.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) ?? "";
  const time = now?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) ?? "";

  return (
    <div className={cn("w-[760px] max-w-full drop-shadow-[0_10px_16px_rgba(28,25,23,0.12)]", className)}>
      <div
        className="grid grid-cols-[1.25fr_0.85fr_1.25fr] gap-x-5 bg-[var(--paper)] px-5 pb-4 pt-4 font-mono text-[8.500px] font-medium uppercase leading-[1.45] tracking-[0.04em] text-[var(--ink)]"
        style={{ "--paper": color, "--ink": ink, clipPath: SHAPE } as CSSProperties}
      >
        {/* left: title, about, contact */}
        <div className="flex gap-3">
          <h3 className="text-[22px] font-medium leading-[1.05] tracking-[0.02em]">
            {title.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h3>
        </div>
        <div className="row-span-1">
          <div className="flex h-[88px] items-center justify-center overflow-hidden bg-[var(--ink)] text-[var(--paper)] [&>*]:h-full [&>*]:w-auto">{figure}</div>
        </div>
        <div>
          <div className="rounded-[3px] border border-[var(--ink)] px-2 py-1.5 text-justify [text-align-last:justify]">
            <p className="mb-1 text-center [text-align-last:center]">· Disclaimer ·</p>
            {disclaimer}
          </div>
          <p className="mt-1.5 text-center text-[13px] tracking-[0.06em]">{stamp}</p>
        </div>

        <p className="mt-3 max-w-[30ch] text-right [grid-column:1] sm:ml-auto">{about}</p>
        <div className="col-span-1 mt-3 space-y-0.5">
          {contacts.map((c) => (
            <p key={c.label} className="flex gap-4">
              <span className="w-12 shrink-0">{c.label}</span>
              <span className="truncate">{c.value}</span>
            </p>
          ))}
        </div>
        <div className="mt-3">
          <p>
            This slip
            <br />
            is printed on
          </p>
          <p className="mt-2 flex justify-between gap-4">
            <span>Date&nbsp;&nbsp;{date}</span>
            <span>Time&nbsp;&nbsp;{time}</span>
          </p>
          <p className="mt-4">Thank you and have a nice day</p>
        </div>

        {/* bottom row */}
        <div className="col-span-2 mt-10 grid grid-cols-2 items-end gap-5">
          {places.map((p) => (
            <p key={p.city}>
              ◎&nbsp;&nbsp;{p.city}
              {p.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
          ))}
        </div>
        <div className="mt-6 flex items-end gap-3">
          <p className="text-[44px] font-light leading-[0.8] tracking-[-0.04em] [transform:scaleY(1.5)] [transform-origin:bottom]">{wordmark}</p>
          <p className="flex-1 text-justify [text-align-last:justify]">
            {credit}
            {footer && <span className="mt-1 block [text-align-last:left]">{footer}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
