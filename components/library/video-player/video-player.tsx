"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../_lib/cn";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}

const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

/**
 * A minimal custom video player: big play button that morphs into a control
 * bar, scrubbable timeline with hover preview time, mute and fullscreen.
 * Controls auto-hide while playing. Keyboard: Space, ← →, M, F.
 */
export function VideoPlayer({ src, poster, title, className }: VideoPlayerProps) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<number | null>(null);

  const wake = () => {
    setIdle(false);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2200);
  };

  useEffect(() => () => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const seek = (fraction: number) => {
    const v = video.current;
    if (v && duration) v.currentTime = Math.max(0, Math.min(1, fraction)) * duration;
  };

  const showControls = !playing || !idle;

  return (
    <div
      ref={box}
      tabIndex={0}
      onMouseMove={wake}
      onKeyDown={(e) => {
        const v = video.current;
        if (!v) return;
        if (e.key === " ") {
          e.preventDefault();
          toggle();
        }
        if (e.key === "ArrowRight") v.currentTime += 5;
        if (e.key === "ArrowLeft") v.currentTime -= 5;
        if (e.key.toLowerCase() === "m") setMuted((m) => !m);
        if (e.key.toLowerCase() === "f") box.current?.requestFullscreen?.().catch(() => {});
      }}
      className={cn("group relative aspect-video w-full overflow-hidden rounded-2xl bg-black outline-none focus-visible:ring-2 focus-visible:ring-neutral-400", playing && idle && "cursor-none", className)}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          wake();
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        className="h-full w-full object-cover"
      />

      <AnimatePresence>
        {!playing && (
          <motion.button
            key="big"
            type="button"
            aria-label="Play"
            onClick={toggle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4, filter: "blur(6px)" }}
            whileHover={{ scale: 1.06 }}
            className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-xl backdrop-blur"
          >
            <svg viewBox="0 0 24 24" className="ml-1 size-6" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 12 }}
        className="absolute inset-x-3 bottom-3 rounded-xl bg-black/50 px-3 pb-2 pt-2.5 text-white backdrop-blur-md"
      >
        {title && <p className="mb-1.5 truncate text-xs text-white/70">{title}</p>}
        <div
          className="relative h-1.5 cursor-pointer rounded-full bg-white/20"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            seek((e.clientX - r.left) / r.width);
          }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setHoverX((e.clientX - r.left) / r.width);
          }}
          onMouseLeave={() => setHoverX(null)}
        >
          <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${duration ? (time / duration) * 100 : 0}%` }} />
          {hoverX !== null && (
            <span className="absolute -top-7 -translate-x-1/2 rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-900" style={{ left: `${hoverX * 100}%` }}>
              {fmt(hoverX * duration)}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs">
          <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="flex size-6 items-center justify-center">
            {playing ? (
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
            )}
          </button>
          <span className="font-mono tabular-nums text-white/80">
            {fmt(time)} / {fmt(duration)}
          </span>
          <span className="flex-1" />
          <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} className="flex size-6 items-center justify-center">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor" />
              {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16 9a4 4 0 010 6M19 6a8 8 0 010 12" />}
            </svg>
          </button>
          <button type="button" onClick={() => box.current?.requestFullscreen?.().catch(() => {})} aria-label="Fullscreen" className="flex size-6 items-center justify-center">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
