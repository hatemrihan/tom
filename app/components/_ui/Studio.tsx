"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Eye, EyeOff, Maximize2, Minimize2, Pause, Play, Repeat } from "lucide-react";
import { specs } from "@/components/motion/specs";
import { canEncode, createPainter, download, encodeMp4, imagesReady, pickEngine, seekMedia, toPng, type Painter } from "@/components/motion/export";
import { FORMATS, type Field, type Format, type Media, type Segment, type Value, type Values } from "@/components/motion/types";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CodeTabs";

const RULE = "border-neutral-200 dark:border-neutral-800";
const QUIET = "text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white";
const LOUD = "text-neutral-900 dark:text-white";
const INPUT =
  "w-full rounded-md border border-neutral-200 bg-transparent px-2 py-1.5 text-[12px] font-normal normal-case tracking-normal text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-800 dark:text-white dark:focus:border-white";

/** The stage sets its own type, so the piece never inherits the small capitals of the editor around it. */
const SURFACE = "relative overflow-hidden bg-white text-base font-normal normal-case leading-normal tracking-normal text-neutral-900";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const seconds = (ms: number) => (ms / 1000).toFixed(2);
const drawable = { drawable: "" } as object;
const drawableCanvas = { content: "drawable" } as object;

type Job = { kind: "mp4" | "png"; time: number; done: number; total: number };
type Saved = { name: string; url: string; size: string };

const megabytes = (bytes: number) => (bytes < 1e6 ? `${Math.max(1, Math.round(bytes / 1e3))} KB` : `${(bytes / 1e6).toFixed(1)} MB`);

/**
 * The motion edition of a component: the real component on a stage, with its
 * layers, a timeline to scrub and stretch, a panel to change what it says and
 * shows, and an export that renders it in the browser.
 */
export default function Studio({ slug }: { slug: string }) {
  const spec = specs[slug];
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const cancel = useRef(false);

  const [values, setValues] = useState<Values>(spec.defaults);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loop, setLoop] = useState(true);
  const [format, setFormat] = useState<Format>(FORMATS[0]);
  const [selected, setSelected] = useState<string | null>(null);
  const [group, setGroup] = useState<"design" | "animate">("design");
  const [scale, setScale] = useState<1.5 | 3>(1.5);
  const [fps, setFps] = useState<30 | 60>(60);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");
  const [full, setFull] = useState(false);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [visible, setVisible] = useState(true);
  const [engine] = useState(() => pickEngine());
  const [video] = useState(() => canEncode());

  const duration = spec.duration(values);
  const now = Math.min(time, duration);
  const set = (key: string, value: Value) => setValues((v) => ({ ...v, [key]: value }));

  // Nothing runs while the editor is off screen or behind another tab.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const running = playing && visible && !job;

  // The file that was made stays within reach until the next one, or until the page is left.
  const kept = useRef<string | null>(null);
  useEffect(() => {
    const old = kept.current;
    kept.current = saved?.url ?? null;
    if (old && old !== kept.current) URL.revokeObjectURL(old);
  }, [saved]);
  useEffect(() => () => void (kept.current && URL.revokeObjectURL(kept.current)), []);

  /* ------------------------------- playback ------------------------------- */

  const clock = useRef({ time: 0, duration, loop });
  const latest = useRef(values);
  useEffect(() => {
    clock.current = { time: now, duration, loop };
    latest.current = values;
  });

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const tick = (at: number) => {
      const c = clock.current;
      let next = c.time + (at - last);
      last = at;
      if (next >= c.duration) {
        if (c.loop) next %= c.duration;
        else {
          setTime(c.duration);
          setPlaying(false);
          return;
        }
      }
      c.time = next;
      setTime(next);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const toggle = () => {
    if (!playing && now >= duration) setTime(0);
    setPlaying((p) => !p);
  };

  // Films on the stage follow the playhead.
  useEffect(() => {
    for (const film of stage.current?.querySelectorAll("video") ?? []) {
      const length = film.duration || 0;
      const at = (now - Number(film.dataset.motionStart ?? 0)) / 1000;
      const target = length ? Math.max(0, at) % length : 0;
      if (running && at >= 0) {
        if (film.paused) void film.play().catch(() => {});
        if (Math.abs(film.currentTime - target) > 0.3) film.currentTime = target;
      } else {
        if (!film.paused) film.pause();
        if (Math.abs(film.currentTime - target) > 0.03) film.currentTime = target;
      }
    }
  }, [now, running]);

  // A file the browser cannot show is taken off again, with a word about why.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onError = (e: Event) => {
      const broken = e.target as HTMLElement;
      if (!(broken instanceof HTMLVideoElement) && !(broken instanceof HTMLImageElement)) return;
      const field = spec.fields.find((f) => f.type === "media" && (latest.current[f.key] as Media | null)?.url === broken.getAttribute("src"));
      if (!field) return;
      setError(`This browser cannot show ${(latest.current[field.key] as Media).name}. Try an MP4, WebM, JPG or PNG.`);
      setValues((v) => ({ ...v, [field.key]: null }));
    };
    el.addEventListener("error", onError, true);
    return () => el.removeEventListener("error", onError, true);
  }, [spec]);

  /* --------------------------------- stage -------------------------------- */

  const well = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(0.4);
  useEffect(() => {
    const el = well.current;
    if (!el) return;
    const measure = () => setFit(Math.max(0.05, Math.min((el.clientWidth - 40) / format.w, (el.clientHeight - 40) / format.h)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [format]);

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const choose = (key: string, file: File | undefined) => {
    if (!file) return;
    const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
    if (!kind) return setError("That file is not an image or a video.");
    const old = values[key] as Media | null;
    if (old) URL.revokeObjectURL(old.url);
    setError("");
    set(key, { kind, url: URL.createObjectURL(file), name: file.name });
  };
  const mediaKey = spec.fields.find((f) => f.type === "media")?.key;

  /* -------------------------------- export -------------------------------- */

  const run = async (kind: Job["kind"]) => {
    setError("");
    setSaved(null);
    setPlaying(false);
    cancel.current = false;
    const start = kind === "png" ? now : 0;
    flushSync(() => setJob({ kind, time: start, done: 0, total: 1 }));
    const c = canvas.current;
    const s = surface.current;
    if (!c || !s) return setJob(null);

    let painter: Painter | null = null;
    try {
      await document.fonts.ready;
      await imagesReady(s);
      const brush = (painter = await createPainter(engine, c, s, format.w, format.h));
      const frame = async (t: number) => {
        flushSync(() => setJob((j) => j && { ...j, time: t }));
        await seekMedia(s, t);
        await brush.draw();
      };

      const base = `tomm-${slug}-${c.width}x${c.height}`;
      let blob: Blob | null;
      let name: string;
      if (kind === "png") {
        await frame(start);
        blob = await toPng(c);
        name = `${base}.png`;
      } else {
        blob = await encodeMp4({
          canvas: c,
          fps,
          duration,
          frame,
          onProgress: (done, total) => setJob((j) => j && { ...j, done, total }),
          cancelled: () => cancel.current,
        });
        name = `${base}-${fps}fps.mp4`;
      }
      if (blob) {
        const url = URL.createObjectURL(blob);
        setSaved({ name, url, size: megabytes(blob.size) });
        download(url, name);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error && e.message ? e.message : "The export did not finish. Please try again.");
    } finally {
      painter?.dispose();
      setJob(null);
    }
  };

  /* ------------------------------- timeline ------------------------------- */

  const lane = useRef<HTMLDivElement>(null);
  const [frozen, setFrozen] = useState<number | null>(null);
  const span = frozen ?? duration;
  const tracks = spec.tracks(values);

  const scrub = (e: React.PointerEvent) => {
    const rect = lane.current?.getBoundingClientRect();
    if (!rect) return;
    setTime(clamp((e.clientX - rect.left) / rect.width, 0, 1) * span);
  };

  const stretch = (e: React.PointerEvent, segment: Segment) => {
    const field = spec.fields.find((f) => f.key === segment.field);
    const rect = lane.current?.getBoundingClientRect();
    if (!field || field.type !== "number" || !rect) return;
    e.stopPropagation();
    e.preventDefault();
    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);
    const from = e.clientX;
    const length = segment.end - segment.start;
    const per = segment.per ?? 1;
    const msPerPx = duration / rect.width;
    setFrozen(duration);
    setPlaying(false);
    const move = (m: PointerEvent) => {
      const value = (length + (m.clientX - from) * msPerPx) / per;
      set(field.key, clamp(Math.round(value / field.step) * field.step, field.min, field.max));
    };
    const up = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
      setFrozen(null);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  };

  const step = span <= 8000 ? 500 : span <= 20000 ? 1000 : 5000;
  const ticks = Array.from({ length: Math.floor(span / step) + 1 }, (_, i) => i * step);

  /* --------------------------------- panel -------------------------------- */

  const shown = spec.fields.filter((f) => f.group === group && (!selected || f.layer === selected));
  const code = spec.code(values);
  const W = format.w;
  const H = format.h;

  return (
    <div
      ref={root}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key !== " " || (e.target as HTMLElement).closest("input, textarea, button, select")) return;
        e.preventDefault();
        toggle();
      }}
      className={cn(
        "grid overflow-hidden rounded-2xl border bg-white text-[11px] font-medium uppercase leading-[1.35] tracking-[0.01em] text-neutral-900 outline-none dark:bg-neutral-950 dark:text-neutral-200",
        "grid-cols-1 [grid-template-areas:'bar''stage''time''panel']",
        "md:grid-cols-[150px_minmax(0,1fr)_240px] md:[grid-template-areas:'bar_bar_bar''layers_stage_panel''time_time_time']",
        // On a wide screen the editor grows into the empty room beside the column of text.
        full ? "h-full w-full rounded-none border-0 md:grid-rows-[auto_minmax(0,1fr)_auto]" : "md:grid-rows-[auto_460px_auto] lg:w-[max(100%,min(1140px,calc(100vw-275px)))]",
        RULE,
      )}
    >
      {/* ------------------------------- top bar ------------------------------ */}
      <div className={cn("flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b px-4 py-2.5 [grid-area:bar]", RULE)}>
        <div className="flex items-center gap-4">
          <span className="font-normal text-neutral-400">Frame</span>
          {FORMATS.map((f) => (
            <button key={f.id} type="button" onClick={() => setFormat(f)} aria-pressed={f.id === format.id} className={cn("cursor-pointer tabular-nums", f.id === format.id ? LOUD : QUIET)}>
              {f.id}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden font-normal tabular-nums text-neutral-400 sm:inline">
            {W * scale}×{H * scale}
          </span>
          {([1.5, 3] as const).map((s) => (
            <button key={s} type="button" onClick={() => setScale(s)} aria-pressed={s === scale} className={cn("cursor-pointer", s === scale ? LOUD : QUIET)}>
              {s === 3 ? "4K" : "HD"}
            </button>
          ))}
          {video && (
            <>
              <span className={cn("h-3 border-l", RULE)} />
              {([30, 60] as const).map((n) => (
                <button key={n} type="button" onClick={() => setFps(n)} aria-pressed={n === fps} className={cn("cursor-pointer tabular-nums", n === fps ? LOUD : QUIET)}>
                  {n} fps
                </button>
              ))}
            </>
          )}
          <span className={cn("h-3 border-l", RULE)} />
          <button type="button" disabled={!!job} onClick={() => run("png")} title="Save this frame as a picture" className={cn("cursor-pointer disabled:opacity-40", video ? QUIET : LOUD)}>
            {video ? "PNG" : "Download PNG"}
          </button>
          {video ? (
            <button
              type="button"
              disabled={!!job}
              onClick={() => run("mp4")}
              className="cursor-pointer rounded-full bg-neutral-900 px-3 py-1.5 uppercase text-white transition active:scale-[0.97] disabled:opacity-40 dark:bg-white dark:text-neutral-900"
            >
              Download MP4
            </button>
          ) : (
            <span className="font-normal text-neutral-400">Video needs a newer browser</span>
          )}
          <button
            type="button"
            aria-label={full ? "Exit full screen" : "Full screen"}
            onClick={() => (document.fullscreenElement ? void document.exitFullscreen() : void root.current?.requestFullscreen?.().catch(() => {}))}
            className={cn("cursor-pointer", QUIET)}
          >
            {full ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* -------------------------------- layers ------------------------------ */}
      <div className={cn("hidden overflow-y-auto border-r py-3 [grid-area:layers] md:block", RULE)}>
        <p className="mb-2 px-4 font-normal text-neutral-400">Layers</p>
        {spec.layers.map((layer) => {
          const on = !layer.toggle || values[layer.toggle] !== false;
          return (
            <div key={layer.id} className={cn("group flex items-center justify-between gap-2 px-4", selected === layer.id && "bg-neutral-100 dark:bg-neutral-900")}>
              <button
                type="button"
                onClick={() => setSelected(selected === layer.id ? null : layer.id)}
                aria-pressed={selected === layer.id}
                className={cn("flex min-w-0 flex-1 cursor-pointer items-center gap-2 py-1.5 text-left uppercase", selected === layer.id ? LOUD : QUIET, !on && "line-through")}
              >
                <Glyph kind={layer.kind} />
                <span className="truncate">{layer.name}</span>
              </button>
              {layer.toggle && (
                <button type="button" aria-label={on ? `Hide ${layer.name}` : `Show ${layer.name}`} onClick={() => set(layer.toggle!, !on)} className={cn("cursor-pointer", QUIET)}>
                  {on ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* --------------------------------- stage ------------------------------ */}
      <div
        ref={well}
        onDragOver={(e) => mediaKey && e.preventDefault()}
        onDrop={(e) => {
          if (!mediaKey) return;
          e.preventDefault();
          choose(mediaKey, e.dataTransfer.files[0]);
        }}
        className={cn("relative flex min-h-0 items-center justify-center overflow-hidden bg-neutral-100 [grid-area:stage] dark:bg-neutral-900", !full && "h-[300px] md:h-auto")}
      >
        <div className="relative shrink-0 overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/10" style={{ width: W * fit, height: H * fit }}>
          <div
            ref={stage}
            className="absolute left-0 top-0 origin-top-left overflow-hidden bg-white text-base font-normal normal-case leading-normal tracking-normal text-neutral-900"
            style={{ width: W, height: H, transform: `scale(${fit})` }}
          >
            {spec.render(values, now)}
          </div>
        </div>

        {job?.kind === "mp4" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-neutral-100 dark:bg-neutral-900">
            <p className="tabular-nums" role="status">
              Rendering frame {job.done} of {job.total}
            </p>
            <div className="h-px w-48 bg-neutral-300 dark:bg-neutral-700">
              <div className="h-px bg-neutral-900 dark:bg-white" style={{ width: `${(job.done / job.total) * 100}%` }} />
            </div>
            <p className="font-normal text-neutral-400">Made on your machine. Keep this tab in front.</p>
            <button type="button" onClick={() => (cancel.current = true)} className={cn("cursor-pointer uppercase", QUIET)}>
              Cancel
            </button>
          </div>
        )}
        {error && !job && (
          <p role="alert" className="absolute inset-x-3 bottom-3 z-20 rounded-lg bg-white px-3 py-2 text-center font-normal normal-case tracking-normal text-red-600 shadow-sm dark:bg-neutral-950">
            {error}
          </p>
        )}
        {saved && !job && !error && (
          <p role="status" className="absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-neutral-950">
            <span className="font-normal text-neutral-500">Saved</span>
            <span className="max-w-full truncate normal-case tracking-normal">{saved.name}</span>
            <span className="font-normal tabular-nums text-neutral-400">{saved.size}</span>
            <a href={saved.url} download={saved.name} className={cn("cursor-pointer underline underline-offset-4", LOUD)}>
              Save again
            </a>
            <button type="button" aria-label="Dismiss" onClick={() => setSaved(null)} className={cn("cursor-pointer", QUIET)}>
              Close
            </button>
          </p>
        )}
      </div>

      {/* --------------------------------- panel ------------------------------ */}
      <div className={cn("flex min-h-0 flex-col border-t [grid-area:panel] md:border-l md:border-t-0", RULE)}>
        <div className={cn("flex gap-4 border-b px-4 py-2.5", RULE)}>
          {(["design", "animate"] as const).map((g) => (
            <button key={g} type="button" onClick={() => setGroup(g)} aria-pressed={g === group} className={cn("cursor-pointer uppercase", g === group ? LOUD : QUIET)}>
              {g}
            </button>
          ))}
          {selected && (
            <button type="button" onClick={() => setSelected(null)} className={cn("ml-auto cursor-pointer font-normal uppercase", QUIET)}>
              All layers
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 [scrollbar-width:thin]">
          {shown.length === 0 && <p className="font-normal text-neutral-400">Nothing to {group === "design" ? "design" : "animate"} on this layer.</p>}
          {shown.map((field, i) => {
            const heading = !selected && (i === 0 || shown[i - 1].layer !== field.layer) ? spec.layers.find((l) => l.id === field.layer)?.name : null;
            return (
              <div key={field.key}>
                {heading && <p className={cn("mb-3 border-b pb-1.5", RULE, i > 0 && "mt-6")}>{heading}</p>}
                <Control field={field} value={values[field.key]} onChange={(v) => set(field.key, v)} onFile={(file) => choose(field.key, file)} />
              </div>
            );
          })}
        </div>

        <div className={cn("flex items-center justify-between gap-2 border-t py-1 pl-4 pr-1.5", RULE)}>
          <span className="font-normal text-neutral-400">Code</span>
          <span className="flex">
            <CopyButton text={code.tsx} label="TypeScript" className="uppercase" />
            {code.dart && <CopyButton text={code.dart} label="Dart" className="uppercase" />}
          </span>
        </div>
      </div>

      {/* -------------------------------- timeline ---------------------------- */}
      <div className={cn("grid select-none grid-cols-[84px_minmax(0,1fr)] border-t pb-2 [grid-area:time] md:grid-cols-[150px_minmax(0,1fr)]", RULE)}>
        <div>
          <div className="flex h-9 items-center gap-3 px-4">
            <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className={cn("cursor-pointer", LOUD)}>
              {playing ? <Pause className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current" />}
            </button>
            <button type="button" onClick={() => setLoop((l) => !l)} aria-pressed={loop} aria-label="Loop" className={cn("cursor-pointer", loop ? LOUD : QUIET)}>
              <Repeat className="size-3.5" />
            </button>
            <span className="hidden font-normal tabular-nums text-neutral-400 md:inline">{seconds(duration)}s</span>
          </div>
          {tracks.map((t) => (
            <button
              key={t.layer}
              type="button"
              onClick={() => setSelected(selected === t.layer ? null : t.layer)}
              className={cn("block h-8 w-full cursor-pointer truncate px-4 text-left uppercase", selected === t.layer ? LOUD : QUIET)}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="overflow-hidden pr-5">
          <div
            ref={lane}
            className="relative cursor-pointer touch-none"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setPlaying(false);
              scrub(e);
            }}
            onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && scrub(e)}
          >
            {/* ruler */}
            <div className="relative h-9">
              {ticks.map((ms) => (
                <span key={ms} className="absolute bottom-2 font-normal tabular-nums text-neutral-400" style={{ left: `${(ms / span) * 100}%` }}>
                  {ms % 1000 === 0 ? (
                    <span className={cn("block border-l pl-1 leading-none", RULE)}>{ms / 1000}s</span>
                  ) : (
                    <span className={cn("block h-1.5 border-l", RULE)} />
                  )}
                </span>
              ))}
            </div>

            {/* bars */}
            {tracks.map((t) => (
              <div key={t.layer} className="relative h-8">
                {t.segments.map((segment) => (
                  <div
                    key={segment.label}
                    className={cn(
                      "absolute bottom-1 top-1 flex items-center overflow-hidden rounded-[4px] border-r-2 border-white dark:border-neutral-950",
                      selected === t.layer ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
                    )}
                    style={{ left: `${(segment.start / span) * 100}%`, width: `${((segment.end - segment.start) / span) * 100}%` }}
                  >
                    <span className="truncate px-1.5 font-normal">{segment.label}</span>
                    {segment.field && (
                      <span
                        role="slider"
                        aria-label={`Length of ${segment.label}`}
                        aria-valuenow={Math.round(segment.end - segment.start)}
                        title="Drag to change the length"
                        onPointerDown={(e) => stretch(e, segment)}
                        className="absolute inset-y-0 right-0 w-2.5 cursor-ew-resize touch-none after:absolute after:inset-y-1.5 after:right-1 after:w-px after:bg-current after:opacity-50"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* playhead */}
            <div className="pointer-events-none absolute inset-y-0 w-px bg-neutral-900 dark:bg-white" style={{ left: `${(now / span) * 100}%` }}>
              <span className="absolute left-0 top-1 -translate-x-1/2 rounded-[3px] bg-neutral-900 px-1 py-0.5 leading-none tabular-nums text-white dark:bg-white dark:text-neutral-900">{seconds(now)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* The export surface: the same stage, laid out inside a canvas the browser can draw it into. */}
      {job && (
        <div aria-hidden className="pointer-events-none fixed left-0 top-0 size-px overflow-hidden opacity-0">
          {engine === "native" ? (
            <canvas ref={canvas} width={W * scale} height={H * scale} style={{ display: "block", width: W, height: H }} {...drawableCanvas}>
              <div ref={surface} {...drawable} className={SURFACE} style={{ width: W, height: H }}>
                {spec.render(values, job.time)}
              </div>
            </canvas>
          ) : (
            <>
              <canvas ref={canvas} width={W * scale} height={H * scale} />
              <div ref={surface} className={SURFACE} style={{ width: W, height: H }}>
                {spec.render(values, job.time)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Glyph({ kind }: { kind: "text" | "shape" | "media" }) {
  if (kind === "text") return <span className="w-3 shrink-0 text-center font-serif normal-case leading-none">T</span>;
  if (kind === "shape") return <span className="size-2.5 shrink-0 rounded-[2px] bg-current" />;
  return <span className="size-2.5 shrink-0 rounded-[2px] border border-current" />;
}

function Control({ field, value, onChange, onFile }: { field: Field; value: Value; onChange: (value: Value) => void; onFile: (file: File | undefined) => void }) {
  const name = <span className="font-normal text-neutral-500">{field.label}</span>;

  if (field.type === "text") {
    return (
      <label className="block space-y-1.5">
        {name}
        <input className={INPUT} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
      </label>
    );
  }

  if (field.type === "list") {
    const lines = (value as string[]) ?? [];
    return (
      <label className="block space-y-1.5">
        <span className="flex justify-between">
          {name}
          {field.hint && <span className="font-normal text-neutral-400">{field.hint}</span>}
        </span>
        <textarea
          dir="auto"
          rows={Math.min(8, Math.max(3, lines.length))}
          className={cn(INPUT, "resize-none leading-[1.6]")}
          defaultValue={lines.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
        />
      </label>
    );
  }

  if (field.type === "color") {
    const hex = String(value ?? "#000000");
    return (
      <label className="flex items-center justify-between gap-3">
        {name}
        <span className="flex items-center gap-2">
          <span className="font-normal tabular-nums text-neutral-400">{hex}</span>
          <span className="relative size-5 overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700" style={{ background: hex }}>
            <input type="color" value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : "#000000"} onChange={(e) => onChange(e.target.value)} className="absolute -inset-2 size-10 cursor-pointer opacity-0" />
          </span>
        </span>
      </label>
    );
  }

  if (field.type === "toggle") {
    const on = value !== false;
    return (
      <div className="flex items-center justify-between gap-3">
        {name}
        <button type="button" role="switch" aria-checked={on} aria-label={field.label} onClick={() => onChange(!on)} className={cn("relative h-[18px] w-8 shrink-0 cursor-pointer rounded-full transition-colors", on ? "bg-neutral-900 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700")}>
          <span className={cn("absolute left-[3px] top-[3px] size-3 rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-neutral-900", on && "translate-x-[14px]")} />
        </button>
      </div>
    );
  }

  if (field.type === "number") {
    const n = Number(value ?? 0);
    return (
      <label className="block space-y-1">
        <span className="flex justify-between">
          {name}
          <span className="tabular-nums">
            {field.step < 1 ? n.toFixed(2) : Math.round(n)}
            {field.unit && <span className="font-normal lowercase text-neutral-400"> {field.unit}</span>}
          </span>
        </span>
        <input type="range" min={field.min} max={field.max} step={field.step} value={n} onChange={(e) => onChange(Number(e.target.value))} className="block h-4 w-full cursor-pointer accent-neutral-900 dark:accent-white" />
      </label>
    );
  }

  const media = value as Media | null;
  return (
    <div className="space-y-1.5">
      {name}
      <label className={cn("flex cursor-pointer items-center justify-center rounded-md border border-dashed px-3 py-4 text-center font-normal transition-colors hover:border-neutral-900 dark:hover:border-white", RULE, media ? LOUD : "text-neutral-400")}>
        <input type="file" accept="image/*,video/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        <span className="truncate normal-case tracking-normal">{media ? media.name : "Choose a file, or drop one on the stage"}</span>
      </label>
      <p className="flex justify-between font-normal text-neutral-400">
        <span>Stays on your machine</span>
        {media && (
          <button
            type="button"
            onClick={() => {
              URL.revokeObjectURL(media.url);
              onChange(null);
            }}
            className={cn("cursor-pointer uppercase", QUIET)}
          >
            Remove
          </button>
        )}
      </p>
    </div>
  );
}
