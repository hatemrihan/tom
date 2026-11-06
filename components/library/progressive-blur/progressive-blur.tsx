import { cn } from "../_lib/cn";

export interface ProgressiveBlurProps {
  /** Which edge is most blurred. */
  side?: "top" | "bottom" | "left" | "right";
  /** Blur at the strongest edge, in px. */
  strength?: number;
  /** Number of stacked layers (more = smoother). */
  layers?: number;
  className?: string;
}

/**
 * A smooth, graduated backdrop blur — like iOS headers. Stacks several
 * backdrop-filter layers, each masked to a band, doubling in strength.
 * Place it absolutely over scrolling content. Works in Server Components.
 */
export function ProgressiveBlur({ side = "bottom", strength = 16, layers = 6, className }: ProgressiveBlurProps) {
  const dir = { top: "to top", bottom: "to bottom", left: "to left", right: "to right" }[side];
  const band = 100 / layers;

  return (
    <div aria-hidden className={cn("pointer-events-none absolute", positionClass[side], className)}>
      {Array.from({ length: layers }).map((_, i) => {
        const blur = strength / Math.pow(2, layers - 1 - i);
        const start = i * band;
        const mask = `linear-gradient(${dir}, transparent ${Math.max(start - band, 0)}%, #000 ${start}%, #000 ${start + band}%, transparent ${Math.min(start + band * 2, 100)}%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: i === layers - 1 ? `linear-gradient(${dir}, transparent ${start - band}%, #000 ${start}%)` : mask,
              WebkitMaskImage: i === layers - 1 ? `linear-gradient(${dir}, transparent ${start - band}%, #000 ${start}%)` : mask,
            }}
          />
        );
      })}
    </div>
  );
}

const positionClass = {
  top: "inset-x-0 top-0 h-24",
  bottom: "inset-x-0 bottom-0 h-24",
  left: "inset-y-0 left-0 w-24",
  right: "inset-y-0 right-0 w-24",
};
