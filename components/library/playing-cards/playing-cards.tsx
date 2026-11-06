"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

const SUIT_GLYPH: Record<Suit, string> = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" };
const isRed = (s: Suit) => s === "hearts" || s === "diamonds";

/* Pip layouts on a 3×7 grid (col, row) for number cards. */
const PIPS: Partial<Record<Rank, [number, number][]>> = {
  "2": [[1, 0], [1, 6]],
  "3": [[1, 0], [1, 3], [1, 6]],
  "4": [[0, 0], [2, 0], [0, 6], [2, 6]],
  "5": [[0, 0], [2, 0], [1, 3], [0, 6], [2, 6]],
  "6": [[0, 0], [2, 0], [0, 3], [2, 3], [0, 6], [2, 6]],
  "7": [[0, 0], [2, 0], [1, 1.5], [0, 3], [2, 3], [0, 6], [2, 6]],
  "8": [[0, 0], [2, 0], [1, 1.5], [0, 3], [2, 3], [1, 4.5], [0, 6], [2, 6]],
  "9": [[0, 0], [2, 0], [0, 2], [2, 2], [1, 3], [0, 4], [2, 4], [0, 6], [2, 6]],
  "10": [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2], [0, 4], [2, 4], [1, 5], [0, 6], [2, 6]],
};

export interface PlayingCardProps {
  rank: Rank;
  suit: Suit;
  faceDown?: boolean;
  className?: string;
}

/** A single, fully-vector playing card. Scales with its width. */
export function PlayingCard({ rank, suit, faceDown, className }: PlayingCardProps) {
  const glyph = SUIT_GLYPH[suit];
  const color = isRed(suit) ? "text-red-600" : "text-neutral-900";
  const pips = PIPS[rank];

  return (
    <div
      role="img"
      aria-label={faceDown ? "Face-down card" : `${rank} of ${suit}`}
      className={cn(
        "relative aspect-[5/7] w-28 select-none overflow-hidden rounded-[10px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_20px_-8px_rgba(0,0,0,0.3)] [container-type:inline-size]",
        className
      )}
    >
      {faceDown ? (
        <div className="absolute inset-[5%] rounded-[6px] bg-neutral-900 [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_8px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_8px)]" />
      ) : (
        <div className={cn("absolute inset-0 font-serif", color)}>
          {[false, true].map((flip) => (
            <div
              key={String(flip)}
              className={cn(
                "absolute flex flex-col items-center leading-none",
                flip ? "bottom-[5%] right-[6%] rotate-180" : "left-[6%] top-[5%]"
              )}
              style={{ fontSize: "16cqw" }}
            >
              <span className="font-semibold tracking-tighter">{rank}</span>
              <span style={{ fontSize: "13cqw" }}>{glyph}</span>
            </div>
          ))}

          {pips ? (
            <div className="absolute inset-x-[24%] inset-y-[14%]">
              {pips.map(([c, r], i) => (
                <span
                  key={i}
                  className={cn("absolute -translate-x-1/2 -translate-y-1/2 leading-none", r > 3 && "rotate-180")}
                  style={{ left: `${c * 50}%`, top: `${(r / 6) * 100}%`, fontSize: "18cqw" }}
                >
                  {glyph}
                </span>
              ))}
            </div>
          ) : rank === "A" ? (
            <span className="absolute inset-0 flex items-center justify-center" style={{ fontSize: "52cqw" }}>
              {glyph}
            </span>
          ) : (
            <div className="absolute inset-[18%_20%] flex flex-col items-center justify-center rounded-[4px] border border-current/20">
              <span className="font-semibold leading-none tracking-tighter" style={{ fontSize: "34cqw" }}>
                {rank}
              </span>
              <span style={{ fontSize: "22cqw" }}>{glyph}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export interface CardHandProps {
  cards: { rank: Rank; suit: Suit }[];
  /** Total fan angle in degrees. */
  spread?: number;
  onPlay?: (card: { rank: Rank; suit: Suit }) => void;
  className?: string;
}

/**
 * A fanned hand of cards. Hover (or focus) to thumb through, click to play a
 * card — it lifts out of the hand and the rest close the gap.
 */
export function CardHand({ cards: initial, spread = 36, onPlay, className }: CardHandProps) {
  const [cards, setCards] = useState(initial);
  const [hover, setHover] = useState<number | null>(null);
  const n = cards.length;
  const mid = (n - 1) / 2;

  return (
    <div
      className={cn("relative flex h-56 w-full items-end justify-center", className)}
      onMouseLeave={() => setHover(null)}
    >
      <AnimatePresence initial={false}>
        {cards.map((card, i) => {
          const angle = n > 1 ? ((i - mid) / Math.max(mid, 1)) * (spread / 2) : 0;
          const lifted = hover === i;
          const nudge = hover === null || lifted ? 0 : i < hover ? -10 : 10;
          return (
            <motion.button
              key={`${card.rank}-${card.suit}`}
              type="button"
              aria-label={`Play ${card.rank} of ${card.suit}`}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onClick={() => {
                setHover(null);
                setCards((c) => c.filter((_, j) => j !== i));
                onPlay?.(card);
              }}
              className="absolute bottom-0 origin-[50%_120%] rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              initial={{ opacity: 0, y: 80 }}
              animate={{
                rotate: angle,
                x: (i - mid) * 30 + nudge,
                y: lifted ? -36 : Math.abs(i - mid) * 3,
                opacity: 1,
                zIndex: lifted ? 50 : i,
              }}
              exit={{ y: -260, opacity: 0, rotate: 0, scale: 1.05, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <PlayingCard {...card} />
            </motion.button>
          );
        })}
      </AnimatePresence>
      {n === 0 && <p className="mb-20 text-sm text-neutral-400">Hand played.</p>}
    </div>
  );
}
