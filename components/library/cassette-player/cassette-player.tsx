"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { cn } from "../_lib/cn";

export interface CassettePlayerProps {
  title?: string;
  side?: "A" | "B";
  /** Optional audio file. Without it the player runs a simulated timeline. */
  src?: string;
  /** Length in seconds when simulating (ignored when `src` is set). */
  duration?: number;
  className?: string;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * A tactile tape deck. Reels spin while playing and tape visibly moves from
 * the left spool to the right one as the track progresses.
 */
export function CassettePlayer({ title = "Late Night Sketches", side = "A", src, duration = 96, className }: CassettePlayerProps) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState(duration);
  const [speed, setSpeed] = useState(1); // 1 = play, 6 = ff, -6 = rewind
  const rotation = useMotionValue(0);

  const progress = length > 0 ? Math.min(time / length, 1) : 0;

  // Drive reels + simulated clock from one rAF loop.
  useAnimationFrame((_, delta) => {
    const active = playing || speed !== 1;
    if (!active) return;
    const rate = playing && speed === 1 ? 1 : speed;
    rotation.set(rotation.get() + delta * 0.25 * rate);
    if (!src) {
      setTime((t) => {
        const next = Math.min(Math.max(t + (delta / 1000) * rate, 0), length);
        if (next >= length || next <= 0) {
          if (next >= length) setPlaying(false);
          setSpeed(1);
        }
        return next;
      });
    }
  });

  useEffect(() => {
    const el = audio.current;
    if (!el || !src) return;
    const onTime = () => setTime(el.currentTime);
    const onMeta = () => setLength(el.duration || duration);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, [src, duration]);

  useEffect(() => {
    const el = audio.current;
    if (!el || !src) return;
    if (playing) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing, src]);

  const seekBy = (dir: 1 | -1) => {
    if (src && audio.current) {
      audio.current.currentTime = Math.min(Math.max(audio.current.currentTime + dir * 10, 0), length);
      rotation.set(rotation.get() + dir * 360);
    } else {
      setSpeed(dir * 6);
      window.setTimeout(() => setSpeed(1), 450);
    }
  };

  // Tape radius on each spool (px), conserving the visual "amount" of tape.
  const minR = 14;
  const maxR = 30;
  const leftR = minR + (maxR - minR) * Math.sqrt(1 - progress);
  const rightR = minR + (maxR - minR) * Math.sqrt(progress);

  return (
    <div className={cn("w-[320px] select-none", className)}>
      {src && <audio ref={audio} src={src} preload="metadata" />}

      {/* Cassette shell */}
      <div className="relative rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 p-3 shadow-[0_24px_40px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
        {/* Label */}
        <div className="rounded-lg bg-[#f4efe6] px-3 pb-2 pt-2.5 text-neutral-800">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
            <span>Side {side}</span>
            <span>C‑{Math.ceil(length / 60) * 2}</span>
          </div>
          <p className="mt-1 truncate text-sm font-medium [font-family:'Bradley_Hand','Segoe_Print',cursive]">{title}</p>
          <div className="mt-1 h-px bg-neutral-300" />

          {/* Window */}
          <div className="relative mx-auto mt-3 flex h-[74px] items-center justify-between rounded-md bg-neutral-900 px-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]">
            {[leftR, rightR].map((r, i) => (
              <div key={i} className="relative flex size-[64px] items-center justify-center">
                <div
                  className="absolute rounded-full bg-[#3a2a1f] shadow-[inset_0_0_6px_rgba(0,0,0,0.6)] transition-[width,height] duration-300"
                  style={{ width: r * 2, height: r * 2 }}
                />
                <motion.div style={{ rotate: rotation }} className="relative size-7 rounded-full bg-neutral-100">
                  {[0, 60, 120].map((deg) => (
                    <span
                      key={deg}
                      className="absolute left-1/2 top-1/2 h-1.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-900"
                      style={{ transform: `translate(-50%,-50%) rotate(${deg}deg)` }}
                    />
                  ))}
                  <span className="absolute inset-[9px] rounded-full bg-neutral-100" />
                </motion.div>
              </div>
            ))}
            <span className="pointer-events-none absolute inset-x-[30%] top-1/2 h-[3px] -translate-y-1/2 bg-[#3a2a1f]/80" />
          </div>
        </div>
        <div className="mx-auto mt-2 h-3 w-2/3 rounded-t-md bg-neutral-950/60" />
      </div>

      {/* Transport */}
      <div className="mt-4 flex items-center gap-3">
        <span className="w-10 font-mono text-xs tabular-nums text-neutral-500">{fmt(time)}</span>
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div className="absolute inset-y-0 left-0 rounded-full bg-neutral-900 dark:bg-white" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="w-10 text-right font-mono text-xs tabular-nums text-neutral-500">{fmt(length)}</span>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        <DeckKey label="Rewind" onClick={() => seekBy(-1)}>
          ◀◀
        </DeckKey>
        <DeckKey
          label={playing ? "Pause" : "Play"}
          active={playing}
          onClick={() => {
            if (!playing && time >= length) setTime(0);
            setPlaying((p) => !p);
          }}
          wide
        >
          {playing ? "❚❚" : "▶"}
        </DeckKey>
        <DeckKey label="Fast forward" onClick={() => seekBy(1)}>
          ▶▶
        </DeckKey>
      </div>
    </div>
  );
}

function DeckKey({
  children,
  label,
  onClick,
  active,
  wide,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  wide?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      whileTap={{ y: 3 }}
      className={cn(
        "flex h-10 items-center justify-center rounded-lg border-b-4 text-[11px] tracking-tighter outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400",
        wide ? "w-20" : "w-14",
        active
          ? "translate-y-[2px] border-neutral-400 bg-neutral-200 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
          : "border-neutral-300 bg-white text-neutral-700 shadow-sm dark:border-neutral-950 dark:bg-neutral-800 dark:text-neutral-200"
      )}
    >
      {children}
    </motion.button>
  );
}
