import type { CSSProperties, ReactNode } from "react";
import { cn } from "../_lib/cn";

export type Segment =
  | { label: string; href?: string }
  | { image: string; alt?: string; href?: string };

export interface SegmentTagsProps {
  /** Shown in the first, square tile: a logo, an icon, a letter. */
  mark?: ReactNode;
  /** Label tiles (use "\n" for a second line) and image tiles, in order. */
  segments: Segment[];
  /** Tile colour. */
  color?: string;
  /** Text and mark colour. */
  ink?: string;
  /** Tile height in px; everything else scales from it. */
  size?: number;
  className?: string;
}

/**
 * A label built from soft-cornered tiles that sit shoulder to shoulder: a
 * square mark, then one tile per label, then optionally a picture. Tiles
 * that have an `href` are links and lift a little on hover.
 */
export function SegmentTags({ mark, segments, color = "#a9a9ad", ink = "#ececee", size = 72, className }: SegmentTagsProps) {
  const tile = "flex shrink-0 items-center overflow-hidden rounded-[0.26em] bg-[var(--tile)] transition-transform duration-300 ease-out";
  const lift = "hover:-translate-y-[0.06em] focus-visible:-translate-y-[0.06em] outline-none";

  return (
    <div
      className={cn("inline-flex max-w-full flex-wrap gap-px font-semibold leading-[0.95] tracking-[-0.03em]", className)}
      style={{ "--tile": color, color: ink, fontSize: size, height: undefined } as CSSProperties}
    >
      {mark && (
        <span className={cn(tile, "h-[1em] w-[1.18em] justify-center")}>
          <span className="flex size-[0.72em] items-center justify-center text-[0.72em] [&>svg]:size-full">{mark}</span>
        </span>
      )}
      {segments.map((segment, i) => {
        const Tag = segment.href ? "a" : "span";
        if ("image" in segment) {
          return (
            <Tag key={i} href={segment.href} className={cn(tile, "h-[1em] w-[1.75em]", segment.href && lift)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={segment.image} alt={segment.alt ?? ""} draggable={false} className="h-full w-full object-cover object-[50%_20%]" />
            </Tag>
          );
        }
        return (
          <Tag key={i} href={segment.href} className={cn(tile, "h-[1em] px-[0.22em]", segment.href && lift)}>
            <span className="whitespace-pre text-[0.36em]">{segment.label}</span>
          </Tag>
        );
      })}
    </div>
  );
}
