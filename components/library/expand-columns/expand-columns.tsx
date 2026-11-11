"use client";

import { useRef, useState, type CSSProperties } from "react";
import { cn } from "../_lib/cn";

export interface ColumnItem {
  title: string;
  /** Small second label, shown only while the item is open: a year, a role. */
  meta?: string;
  image: string;
  alt?: string;
  /** Which part of the image to keep when it is cropped, e.g. "50% 20%". */
  focus?: string;
}

export interface ExpandColumnsProps {
  items: ColumnItem[];
  /** Which item starts open. */
  defaultIndex?: number;
  /** Height of the row on wide screens, in px. The open image keeps a 4:5 shape. */
  height?: number;
  /** Show the button that opens the whole, uncropped image. */
  zoom?: boolean;
  onChange?: (index: number) => void;
  className?: string;
}

const EASE = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";
const SIDEWAYS = "whitespace-nowrap md:rotate-180 md:[writing-mode:vertical-rl]";

/**
 * A row of thin columns with sideways labels. The one you point at opens to
 * show its image; a small button shows the image whole. On narrow screens it
 * turns into a list of rows that open downward on tap.
 */
export function ExpandColumns({ items, defaultIndex = 0, height = 360, zoom = true, onChange, className }: ExpandColumnsProps) {
  const [active, setActive] = useState(defaultIndex);
  const [viewing, setViewing] = useState<ColumnItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const open = (i: number) => {
    if (i === active) return;
    setActive(i);
    onChange?.(i);
  };

  const view = (item: ColumnItem) => {
    setViewing(item);
    dialog.current?.showModal();
  };

  return (
    <>
      <ul
        style={{ "--h": `${height}px` } as CSSProperties}
        className={cn("flex w-full flex-col text-[11px] font-medium uppercase leading-none tracking-[0.01em] md:h-[var(--h)] md:flex-row md:justify-center", className)}
      >
        {items.map((item, i) => {
          const on = i === active;
          return (
            <li
              key={item.title}
              onMouseEnter={() => open(i)}
              className={cn(
                "flex min-w-0 flex-col border-b border-current/15 transition-[flex-basis] md:shrink-0 md:grow-0 md:flex-row md:border-b-0 md:border-l md:last:border-r",
                EASE,
                // open: label strip + a 4:5 image + its padding
                on ? "md:basis-[calc((var(--h)-1rem)*0.8+2.75rem)]" : "md:basis-9"
              )}
            >
              {/* label: a row on phones, a sideways strip on wide screens */}
              <button
                type="button"
                aria-expanded={on}
                onFocus={() => open(i)}
                onClick={() => open(i)}
                className={cn(
                  "order-2 flex cursor-pointer items-center justify-between py-3 text-left outline-none transition-opacity duration-300 focus-visible:underline md:order-1 md:h-full md:w-9 md:shrink-0 md:flex-col-reverse md:py-2",
                  on ? "opacity-100" : "opacity-40 hover:opacity-100"
                )}
              >
                <span className={SIDEWAYS}>{item.title}</span>
                {item.meta && <span className={cn(SIDEWAYS, "font-normal transition-opacity duration-500", on ? "opacity-100" : "opacity-0")}>{item.meta}</span>}
              </button>

              {/* image: grows down on phones, sideways on wide screens */}
              <div className={cn("order-1 grid transition-[grid-template-rows] md:order-2 md:block md:h-full md:min-w-0 md:flex-1", EASE, on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden md:h-full md:py-2 md:pr-2">
                  <div className={cn("relative h-64 overflow-hidden rounded-lg transition-opacity duration-500 md:h-full", on ? "opacity-100" : "opacity-0")}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.alt ?? item.title}
                      draggable={false}
                      style={{ objectPosition: item.focus ?? "50% 20%" }}
                      className="h-full w-full object-cover"
                    />
                    {zoom && on && (
                      <button
                        type="button"
                        onClick={() => view(item)}
                        aria-label={`View ${item.title} full size`}
                        className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-white/90 px-2.5 py-1.5 text-neutral-900 outline-none backdrop-blur transition hover:bg-white focus-visible:ring-2 focus-visible:ring-white"
                      >
                        View ↗
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* the whole image, uncropped. <dialog> gives Esc-to-close and focus handling for free */}
      <dialog
        ref={dialog}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onClose={() => setViewing(null)}
        className="m-auto max-h-none max-w-none bg-transparent p-6 text-[11px] font-medium uppercase tracking-[0.01em] text-white backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        {viewing && (
          <figure className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewing.image} alt={viewing.alt ?? viewing.title} className="max-h-[80vh] max-w-[88vw] rounded-lg object-contain" />
            <figcaption className="flex w-full items-center justify-between gap-6">
              <span>
                {viewing.title}
                {viewing.meta && <span className="font-normal opacity-60">, {viewing.meta}</span>}
              </span>
              <button type="button" autoFocus onClick={() => dialog.current?.close()} className="cursor-pointer uppercase underline-offset-4 outline-none hover:underline focus-visible:underline">
                Close
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
