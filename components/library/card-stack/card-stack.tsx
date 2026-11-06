"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { cn } from "../_lib/cn";

export interface StackCard {
  id: string;
  content: ReactNode;
}

export interface CardStackProps {
  cards: StackCard[];
  /** Cards loop back to the bottom instead of disappearing. */
  loop?: boolean;
  onSwipe?: (card: StackCard, direction: "left" | "right") => void;
  className?: string;
}

/**
 * A swipeable stack. Drag the top card past the threshold (or flick it) to
 * send it away; the cards beneath scale up to take its place.
 */
export function CardStack({ cards: initial, loop = true, onSwipe, className }: CardStackProps) {
  const [cards, setCards] = useState(initial);
  const [exitX, setExitX] = useState(0);

  const swipe = (dir: "left" | "right") => {
    const [top, ...rest] = cards;
    if (!top) return;
    setExitX(dir === "right" ? 400 : -400);
    onSwipe?.(top, dir);
    setCards(loop ? [...rest, { ...top, id: `${top.id.split("~")[0]}~${Date.now()}` }] : rest);
  };

  return (
    <div className={cn("relative h-72 w-60", className)}>
      <AnimatePresence initial={false} custom={exitX}>
        {cards.slice(0, 4).map((card, i) => (
          <Card key={card.id} index={i} exitX={exitX} onSwipe={swipe}>
            {card.content}
          </Card>
        )).reverse()}
      </AnimatePresence>
      {cards.length === 0 && <p className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">All done.</p>}
      <div className="absolute -bottom-14 left-1/2 flex -translate-x-1/2 gap-2">
        <button type="button" onClick={() => swipe("left")} aria-label="Swipe left" className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          ←
        </button>
        <button type="button" onClick={() => swipe("right")} aria-label="Swipe right" className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          →
        </button>
      </div>
    </div>
  );
}

function Card({ index, exitX, onSwipe, children }: { index: number; exitX: number; onSwipe: (d: "left" | "right") => void; children: ReactNode }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const isTop = index === 0;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 110 || info.velocity.x > 600) onSwipe("right");
    else if (info.offset.x < -110 || info.velocity.x < -600) onSwipe("left");
  };

  return (
    <motion.div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)] dark:border-neutral-800 dark:bg-neutral-900",
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      )}
      style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0, zIndex: 10 - index }}
      drag={isTop ? "x" : false}
      dragSnapToOrigin
      onDragEnd={onDragEnd}
      initial={{ scale: 0.85, y: 40, opacity: 0 }}
      animate={{ scale: 1 - index * 0.05, y: index * 14, opacity: index > 2 ? 0 : 1 }}
      custom={exitX}
      variants={{
        exit: (dx: number) => ({ x: dx, rotate: dx > 0 ? 18 : -18, opacity: 0, transition: { duration: 0.35 } }),
      }}
      exit="exit"
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}
