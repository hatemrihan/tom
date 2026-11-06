"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface FanGalleryImage {
  src: string;
  alt: string;
}

export interface FanGalleryProps {
  images: FanGalleryImage[];
  /** Total fan angle in degrees. */
  spread?: number;
  className?: string;
}

/**
 * Photos fanned out like a hand of prints. Hover spreads the fan, hovering a
 * print lifts it, clicking opens it full-size with a shared-element transition.
 */
export function FanGallery({ images, spread = 30, className }: FanGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [fanned, setFanned] = useState(false);
  const uid = useId();
  const n = images.length;
  const mid = (n - 1) / 2;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div
        className={cn("relative flex h-72 w-full items-center justify-center", className)}
        onMouseEnter={() => setFanned(true)}
        onMouseLeave={() => {
          setFanned(false);
          setHovered(null);
        }}
      >
        {images.map((img, i) => {
          const t = n > 1 ? (i - mid) / mid : 0;
          const factor = fanned ? 1 : 0.45;
          return (
            <motion.button
              key={img.src}
              type="button"
              layoutId={`${uid}-${i}`}
              onClick={() => setOpen(i)}
              onMouseEnter={() => setHovered(i)}
              onFocus={() => {
                setFanned(true);
                setHovered(i);
              }}
              aria-label={`Open ${img.alt}`}
              className="absolute w-36 origin-bottom overflow-hidden rounded-xl bg-white p-1.5 pb-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-neutral-100"
              animate={{
                rotate: t * (spread / 2) * factor,
                x: t * 110 * factor,
                y: (hovered === i ? -24 : 0) + Math.abs(t) * 14 * factor,
                scale: hovered === i ? 1.06 : 1,
                zIndex: hovered === i ? 20 : i,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              style={{ visibility: open === i ? "hidden" : "visible" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="" draggable={false} className="aspect-[4/5] w-full rounded-lg object-cover" />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.figure
              layoutId={`${uid}-${open}`}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-2 pb-4 shadow-2xl"
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[open].src} alt={images[open].alt} className="max-h-[70vh] w-full rounded-xl object-cover" />
              <figcaption className="px-2 pt-3 text-sm text-neutral-600">{images[open].alt}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
