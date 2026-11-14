"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "../_lib/cn";

export interface WordsPreloaderProps {
  /** The page underneath. */
  children: ReactNode;
  /** Shown one after another. The first fades in, the rest cut. */
  words?: string[];
  /** Small line at the bottom left. */
  label?: string;
  /** Show where it is in the list, such as 03/08. */
  count?: boolean;
  /** Colour of the cover, and of what is written on it. */
  color?: string;
  onColor?: string;
  /** Size of the word, in px. */
  size?: number;
  /** How long the first word stays, in ms. */
  first?: number;
  /** How long each word after it stays, in ms. */
  pace?: number;
  /** How long the last word stays before the cover lifts, in ms. */
  hold?: number;
  /** How long the lift takes, in ms. */
  lift?: number;
  /** How far the lower edge bows while it lifts, from 0 (flat) to 1. */
  curve?: number;
  /** Drive it yourself: the moment to show, in ms. Leave it out and it plays on its own. */
  time?: number;
  /** Wait until the block is on screen before starting, so nobody misses it. */
  startInView?: boolean;
  onComplete?: () => void;
  className?: string;
}

const GREETINGS = ["Hello", "أهلاً", "Bonjour", "Ciao", "Hola", "こんにちは", "Hallo", "Olá"];

/** When each word starts, when the cover begins to lift and when it is all over, in ms. */
export function wordsPreloaderTimeline({ words = GREETINGS.length, first = 1000, pace = 180, hold = 500, lift = 900 } = {}) {
  const starts = Array.from({ length: Math.max(1, words) }, (_, i) => (i === 0 ? 0 : first + (i - 1) * pace));
  const liftAt = words > 1 ? starts[starts.length - 1] + hold : first;
  return { starts, liftAt, total: liftAt + lift };
}

// People who ask for less motion get a fade in place of the lift.
const STILL = "(prefers-reduced-motion: reduce)";
const prefersStill = () => window.matchMedia(STILL).matches;
function watchMotion(onChange: () => void) {
  const query = window.matchMedia(STILL);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** How far below its place the page waits, in px, before it settles as the cover lifts. */
const RISE = 48;

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const easeInOut = (p: number) => (p < 0.5 ? 8 * p ** 4 : 1 - (-2 * p + 2) ** 4 / 2);

/**
 * A preloader that says a few words, one at a time, then lifts away with a
 * bowed lower edge to reveal the page. Every frame is worked out from one
 * number, the time, so it can play on its own or be scrubbed from outside.
 */
export function WordsPreloader({
  children,
  words = GREETINGS,
  label = "Loading",
  count = true,
  color = "#e7e2d9",
  onColor = "#1c1917",
  size = 56,
  first = 1000,
  pace = 180,
  hold = 500,
  lift = 900,
  curve = 0.3,
  time,
  startInView = true,
  onComplete,
  className,
}: WordsPreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const { starts, liftAt, total } = wordsPreloaderTimeline({ words: words.length, first, pace, hold, lift });
  const controlled = time !== undefined;

  const [started, setStarted] = useState(!startInView);
  const [clock, setClock] = useState(0);
  // Someone driving it frame by frame gets the movement as designed, whatever the device prefers.
  const calm = useSyncExternalStore(watchMotion, prefersStill, () => false);
  const still = calm && !controlled;
  const done = useRef(onComplete);
  useEffect(() => {
    done.current = onComplete;
  });

  // Start when visible.
  useEffect(() => {
    if (controlled || started || !root.current) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setStarted(true), { threshold: 0.3 });
    io.observe(root.current);
    return () => io.disconnect();
  }, [controlled, started]);

  // Its own clock, when nobody else is driving.
  useEffect(() => {
    if (controlled || !started) return;
    const begin = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = now - begin;
      setClock(Math.min(t, total));
      if (t < total) frame = requestAnimationFrame(tick);
      else done.current?.();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controlled, started, total]);

  const t = Math.max(0, controlled ? time : clock);
  const index = starts.reduce((found, start, i) => (t >= start ? i : found), 0);
  const p = clamp((t - liftAt) / lift);
  const e = easeInOut(p);

  // The cover is one shape: a rectangle whose lower edge rises and bows on the way.
  const edge = still ? 100 : 100 * (1 - e);
  const bow = still ? 0 : curve * 100 * Math.sin(Math.PI * p);

  return (
    <div ref={root} className={cn("relative overflow-hidden", className)}>
      {/* the page settles upward as the cover leaves; once it has gone, the page is left untouched */}
      <div className="h-full" style={t < total && !still ? { transform: `translateY(${(1 - e) * RISE}px)` } : undefined}>
        {children}
      </div>

      {t < total && (
        <div className="absolute inset-0 z-10" role="status" aria-label={label} style={{ color: onColor, opacity: still ? 1 - e : 1 }}>
          {/* a pixel larger all round, so no hairline of the page shows at the edges */}
          <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute -left-px -top-px h-[calc(100%+2px)] w-[calc(100%+2px)]">
            <path d={`M0 0H100V${edge}Q50 ${edge + bow} 0 ${edge}Z`} fill={color} />
          </svg>

          {/* what is written on the cover rides up with it */}
          <div className="absolute inset-0" style={{ transform: still ? undefined : `translateY(${-e * 100}%)` }}>
            <p
              className="absolute inset-0 flex items-center justify-center px-6 text-center font-medium leading-none tracking-[-0.03em]"
              style={{ fontSize: size, opacity: index === 0 ? clamp(t / (first * 0.45)) : 1 }}
            >
              {words[index]}
            </p>
            <div className="absolute inset-x-5 bottom-4 flex items-end justify-between text-[11px] font-medium uppercase leading-none tracking-[0.01em]">
              <span className="opacity-50">{label}</span>
              {count && (
                <span className="tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                  <span className="opacity-50">/{String(words.length).padStart(2, "0")}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
